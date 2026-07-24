-- Database Schema for Moi Collection Software (u745362362_moivirunthu)

-- 1. Create entries table
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

-- 2. Create settings table
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

-- 3. Create printer_settings table
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

-- Insert default settings row if it doesn't exist
INSERT INTO settings (id, functionType, marriageTitle, brideName, groomName, hostName1, hostName2, venue, date, receiptPrefix, receiptNextNum, currencySymbol, printFooter, securityPin, theme, language)
SELECT 1, 'marriage', 'சுபமுகூர்த்த திருமண விழா (Marriage Reception)', '', '', '', '', '', CURDATE(), 'MOI-', 101, '₹', 'நன்றி! தங்களின் வருகைக்கும் நல்வாழ்த்திற்கும் எங்கள் மனமார்ந்த நன்றிகள்!', '1234', 'light', 'ta'
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE id = 1);

-- Insert default printer_settings row if it doesn't exist
INSERT INTO printer_settings (id, printerType, printerName, ipAddress, port, autoPrintOnSave, paperWidth, status)
SELECT 1, 'thermal80', 'TVS RP3160 Gold Thermal POS', '192.168.1.200', '9100', 1, '80mm', 'Ready (Connected)'
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM printer_settings WHERE id = 1);
