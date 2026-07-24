import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

let dbHost = process.env.DB_HOST || '193.203.184.143';
if (!dbHost || dbHost.includes('auth-db') || dbHost === 'srv1639.hstgr.io') {
  dbHost = '193.203.184.143';
}

const poolConfig = {
  host: dbHost,
  user: process.env.DB_USER || 'u745362362_moivirunthu',
  password: process.env.DB_PASSWORD || 'Aedentek@123',
  database: process.env.DB_NAME || 'u745362362_moivirunthu',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

if (process.env.DB_SSL === 'true') {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = mysql.createPool(poolConfig);

export async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    console.log('Connected to MySQL database. Initializing tables...');

    // 1. Create entries table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS entries (
        id VARCHAR(50) PRIMARY KEY,
        receiptNo VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        mobile VARCHAR(20) DEFAULT NULL,
        remarks TEXT DEFAULT NULL,
        date VARCHAR(20) NOT NULL,
        time VARCHAR(20) NOT NULL,
        createdAt DATETIME NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Create settings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT PRIMARY KEY DEFAULT 1,
        functionType VARCHAR(50) DEFAULT 'marriage',
        marriageTitle VARCHAR(255),
        brideName VARCHAR(255),
        groomName VARCHAR(255),
        hostName1 VARCHAR(255),
        hostName2 VARCHAR(255),
        venue VARCHAR(255),
        date VARCHAR(50),
        receiptPrefix VARCHAR(50) DEFAULT 'MOI-',
        receiptNextNum INT DEFAULT 101,
        currencySymbol VARCHAR(10) DEFAULT '₹',
        printFooter VARCHAR(255),
        securityPin VARCHAR(10) DEFAULT '1234',
        theme VARCHAR(20) DEFAULT 'light',
        language VARCHAR(10) DEFAULT 'ta'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Create printer_settings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS printer_settings (
        id INT PRIMARY KEY DEFAULT 1,
        printerType VARCHAR(50) DEFAULT 'thermal80',
        printerName VARCHAR(255),
        ipAddress VARCHAR(50),
        port VARCHAR(10),
        autoPrintOnSave TINYINT(1) DEFAULT 1,
        paperWidth VARCHAR(20),
        status VARCHAR(100)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Insert default settings row if it doesn't exist
    const [settingsRows] = await connection.query('SELECT id FROM settings WHERE id = 1');
    if (settingsRows.length === 0) {
      await connection.query(`
        INSERT INTO settings (id, functionType, marriageTitle, brideName, groomName, hostName1, hostName2, venue, date, receiptPrefix, receiptNextNum, currencySymbol, printFooter, securityPin, theme, language)
        VALUES (1, 'marriage', 'சுபமுகூர்த்த திருமண விழா (Marriage Reception)', '', '', '', '', '', CURDATE(), 'MOI-', 101, '₹', 'நன்றி! தங்களின் வருகைக்கும் நல்வாழ்த்திற்கும் எங்கள் மனமார்ந்த நன்றிகள்!', '1234', 'light', 'ta')
      `);
    } else {
      await connection.query(`
        UPDATE settings 
        SET brideName = '', groomName = '', hostName1 = '', hostName2 = '', venue = '' 
        WHERE id = 1 AND (brideName LIKE '%Anitha%' OR venue LIKE '%Madurai%')
      `);
    }

    // Insert default printer_settings row if it doesn't exist
    const [printerRows] = await connection.query('SELECT id FROM printer_settings WHERE id = 1');
    if (printerRows.length === 0) {
      await connection.query(`
        INSERT INTO printer_settings (id, printerType, printerName, ipAddress, port, autoPrintOnSave, paperWidth, status)
        VALUES (1, 'thermal80', 'Default System Connected Printer', '', '', 1, '80mm', 'Ready (Connected)')
      `);
    } else {
      await connection.query(`
        UPDATE printer_settings 
        SET printerName = 'Default System Connected Printer', ipAddress = '', port = '' 
        WHERE id = 1 AND (printerName LIKE '%TVS RP3160%' OR printerName LIKE '%Epson%')
      `);
    }

    console.log('Database tables successfully initialized.');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  } finally {
    connection.release();
  }
}

export default pool;
