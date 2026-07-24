import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pool, { initializeDatabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB and tables on start
try {
  await initializeDatabase();
} catch (err) {
  console.error('CRITICAL: Database initialization failed. Server starting anyway...', err);
}

// -------------------------------------------------------------
// 1. ENTRIES API
// -------------------------------------------------------------

// GET all entries
app.get('/api/entries', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM entries ORDER BY createdAt DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

// POST new entry
app.post('/api/entries', async (req, res) => {
  const { id, receiptNo, name, address, amount, mobile, remarks, date, time, createdAt } = req.body;
  try {
    const query = `
      INSERT INTO entries (id, receiptNo, name, address, amount, mobile, remarks, date, time, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Format createdAt for MySQL
    let mysqlCreatedAt = createdAt;
    if (createdAt) {
      mysqlCreatedAt = new Date(createdAt).toISOString().slice(0, 19).replace('T', ' ');
    } else {
      mysqlCreatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    await pool.query(query, [
      id,
      receiptNo,
      name,
      address,
      amount,
      mobile || null,
      remarks || null,
      date,
      time,
      mysqlCreatedAt
    ]);
    res.status(201).json({ success: true, message: 'Entry added successfully' });
  } catch (error) {
    console.error('Error inserting entry:', error);
    res.status(500).json({ error: 'Failed to insert entry' });
  }
});

// PUT update entry
app.put('/api/entries/:id', async (req, res) => {
  const { id } = req.params;
  const { receiptNo, name, address, amount, mobile, remarks, date, time } = req.body;
  try {
    const query = `
      UPDATE entries
      SET receiptNo = ?, name = ?, address = ?, amount = ?, mobile = ?, remarks = ?, date = ?, time = ?
      WHERE id = ?
    `;
    const [result] = await pool.query(query, [
      receiptNo,
      name,
      address,
      amount,
      mobile || null,
      remarks || null,
      date,
      time,
      id
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.json({ success: true, message: 'Entry updated successfully' });
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

// DELETE entry
app.delete('/api/entries/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM entries WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.json({ success: true, message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

// -------------------------------------------------------------
// 2. SETTINGS API
// -------------------------------------------------------------

// GET settings
app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM settings WHERE id = 1');
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// POST settings
app.post('/api/settings', async (req, res) => {
  const s = req.body;
  try {
    const query = `
      INSERT INTO settings (id, functionType, marriageTitle, brideName, groomName, hostName1, hostName2, venue, date, receiptPrefix, receiptNextNum, currencySymbol, printFooter, securityPin, theme, language)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        functionType = VALUES(functionType),
        marriageTitle = VALUES(marriageTitle),
        brideName = VALUES(brideName),
        groomName = VALUES(groomName),
        hostName1 = VALUES(hostName1),
        hostName2 = VALUES(hostName2),
        venue = VALUES(venue),
        date = VALUES(date),
        receiptPrefix = VALUES(receiptPrefix),
        receiptNextNum = VALUES(receiptNextNum),
        currencySymbol = VALUES(currencySymbol),
        printFooter = VALUES(printFooter),
        securityPin = VALUES(securityPin),
        theme = VALUES(theme),
        language = VALUES(language)
    `;
    await pool.query(query, [
      s.functionType,
      s.marriageTitle,
      s.brideName,
      s.groomName,
      s.hostName1,
      s.hostName2,
      s.venue,
      s.date,
      s.receiptPrefix,
      s.receiptNextNum,
      s.currencySymbol,
      s.printFooter,
      s.securityPin,
      s.theme,
      s.language
    ]);
    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// -------------------------------------------------------------
// 3. PRINTER SETTINGS API
// -------------------------------------------------------------

// GET printer settings
app.get('/api/printer-settings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM printer_settings WHERE id = 1');
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Printer settings not found' });
    }
    // Parse boolean from TINYINT
    const settings = {
      ...rows[0],
      autoPrintOnSave: rows[0].autoPrintOnSave === 1
    };
    res.json(settings);
  } catch (error) {
    console.error('Error fetching printer settings:', error);
    res.status(500).json({ error: 'Failed to fetch printer settings' });
  }
});

// POST printer settings
app.post('/api/printer-settings', async (req, res) => {
  const p = req.body;
  try {
    const query = `
      INSERT INTO printer_settings (id, printerType, printerName, ipAddress, port, autoPrintOnSave, paperWidth, status)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        printerType = VALUES(printerType),
        printerName = VALUES(printerName),
        ipAddress = VALUES(ipAddress),
        port = VALUES(port),
        autoPrintOnSave = VALUES(autoPrintOnSave),
        paperWidth = VALUES(paperWidth),
        status = VALUES(status)
    `;
    await pool.query(query, [
      p.printerType,
      p.printerName,
      p.ipAddress,
      p.port,
      p.autoPrintOnSave ? 1 : 0,
      p.paperWidth,
      p.status
    ]);
    res.json({ success: true, message: 'Printer settings saved successfully' });
  } catch (error) {
    console.error('Error saving printer settings:', error);
    res.status(500).json({ error: 'Failed to save printer settings' });
  }
});

// -------------------------------------------------------------
// 4. BACKUP IMPORT API
// -------------------------------------------------------------
app.post('/api/backup/import', async (req, res) => {
  const { entries, settings } = req.body;
  if (!Array.isArray(entries)) {
    return res.status(400).json({ error: 'Entries must be an array' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Clear old entries
    await connection.query('DELETE FROM entries');

    // 2. Bulk insert new entries if any exist
    if (entries.length > 0) {
      const insertQuery = `
        INSERT INTO entries (id, receiptNo, name, address, amount, mobile, remarks, date, time, createdAt)
        VALUES ?
      `;
      const values = entries.map(e => [
        e.id,
        e.receiptNo,
        e.name,
        e.address,
        Number(e.amount),
        e.mobile || null,
        e.remarks || null,
        e.date,
        e.time,
        e.createdAt ? new Date(e.createdAt).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ')
      ]);
      await connection.query(insertQuery, [values]);
    }

    // 3. Update settings if provided
    if (settings) {
      const updateSettingsQuery = `
        INSERT INTO settings (id, functionType, marriageTitle, brideName, groomName, hostName1, hostName2, venue, date, receiptPrefix, receiptNextNum, currencySymbol, printFooter, securityPin, theme, language)
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          functionType = VALUES(functionType),
          marriageTitle = VALUES(marriageTitle),
          brideName = VALUES(brideName),
          groomName = VALUES(groomName),
          hostName1 = VALUES(hostName1),
          hostName2 = VALUES(hostName2),
          venue = VALUES(venue),
          date = VALUES(date),
          receiptPrefix = VALUES(receiptPrefix),
          receiptNextNum = VALUES(receiptNextNum),
          currencySymbol = VALUES(currencySymbol),
          printFooter = VALUES(printFooter),
          securityPin = VALUES(securityPin),
          theme = VALUES(theme),
          language = VALUES(language)
      `;
      await connection.query(updateSettingsQuery, [
        settings.functionType,
        settings.marriageTitle,
        settings.brideName,
        settings.groomName,
        settings.hostName1,
        settings.hostName2,
        settings.venue,
        settings.date,
        settings.receiptPrefix,
        settings.receiptNextNum,
        settings.currencySymbol,
        settings.printFooter,
        settings.securityPin,
        settings.theme,
        settings.language
      ]);
    }

    await connection.commit();
    res.json({ success: true, message: 'Backup imported successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error importing backup:', error);
    res.status(500).json({ error: 'Failed to import backup' });
  } finally {
    connection.release();
  }
});

// Serve frontend in production environment
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback all other routes to React index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
