import { getTodayDateString } from './dateUtils';

const STORAGE_KEYS = {
  ENTRIES: 'moi_app_entries_v1',
  SETTINGS: 'moi_app_settings_v1',
  PRINTER: 'moi_app_printer_v1',
  DELETED: 'moi_app_deleted_v1'
};

export const FUNCTION_TYPES = [
  {
    id: 'marriage',
    label: 'திருமணம் / ரிசப்ஷன் (Marriage)',
    defaultTitle: 'சுபமுகூர்த்த திருமண விழா (Marriage Reception)',
    h1: 'மணமகள் (Bride)',
    h2: 'மணமகன் (Groom)'
  },
  {
    id: 'kaathukuthu',
    label: 'காது குத்து விழா (Ear Piercing)',
    defaultTitle: 'சுப காது குத்து விழா (Ear Piercing Function)',
    h1: 'குழந்தை பெயர் (Child Name)',
    h2: 'பெற்றோர் பெயர் (Parents)'
  },
  {
    id: 'sadagu',
    label: 'சடங்கு / மஞ்சள் நீராட்டு (Sadagu)',
    defaultTitle: 'மஞ்சள் நீராட்டு விழா (Puberty Function / Sadagu)',
    h1: 'செல்வி (Girl Name)',
    h2: 'பெற்றோர் பெயர் (Parents)'
  },
  {
    id: 'kedavettu',
    label: 'கிடா வெட்டு / கோயில் விழா (Keda Vettu)',
    defaultTitle: 'கிடா வெட்டு மொய் விருந்து (Keda Vettu Function)',
    h1: 'விழா நாயகன் / குடும்பத்தார்',
    h2: 'ஊர் / கோயில்'
  },
  {
    id: 'housewarming',
    label: 'கிரகப்பிரவேசம் (Housewarming)',
    defaultTitle: 'புதுமனை புகுவிழா (Housewarming Function)',
    h1: 'வீட்டின் உரிமையாளர்',
    h2: 'குடும்பத்தார்'
  },
  {
    id: 'birthday',
    label: 'பிறந்தநாள் விழா (Birthday)',
    defaultTitle: 'பிறந்தநாள் விழா (Birthday Celebration)',
    h1: 'பிறந்தநாள் நாயகன்/நாயகி',
    h2: 'பெற்றோர்/குடும்பத்தார்'
  },
  {
    id: 'general',
    label: 'பொது மொய் விருந்து (General Virundhu)',
    defaultTitle: 'சுப மொய் விருந்து விழா (Moi Virundhu)',
    h1: 'விழா குடும்பத்தார்',
    h2: 'குறிப்பு'
  }
];

export const defaultPrinterSettings = {
  printerType: 'thermal80', // 'standard', 'thermal80', 'thermal58', 'network'
  printerName: 'TVS RP3160 Gold Thermal POS',
  ipAddress: '192.168.1.200',
  port: '9100',
  autoPrintOnSave: true,
  paperWidth: '80mm',
  status: 'Ready (Connected)'
};

export const defaultSettings = {
  functionType: 'marriage',
  marriageTitle: 'சுபமுகூர்த்த திருமண விழா (Marriage Reception)',
  brideName: '',
  groomName: '',
  hostName1: '',
  hostName2: '',
  venue: '',
  date: getTodayDateString(),
  receiptPrefix: 'MOI-',
  receiptNextNum: 101,
  currencySymbol: '₹',
  printFooter: 'நன்றி! தங்களின் வருகைக்கும் நல்வாழ்த்திற்கும் எங்கள் மனமார்ந்த நன்றிகள்!',
  securityPin: '1234',
  theme: 'light',
  language: 'ta'
};

export const initialMockEntries = [];

export const loadEntriesFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(initialMockEntries));
      return initialMockEntries;
    }
    const parsed = JSON.parse(data);
    const filtered = parsed.filter(item => !['mock-1', 'mock-2', 'mock-3'].includes(item.id));
    if (filtered.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(filtered));
    }
    return filtered;
  } catch (err) {
    console.error('Error loading entries from LocalStorage:', err);
    return initialMockEntries;
  }
};

export const saveEntriesToStorage = (entries) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  } catch (err) {
    console.error('Error saving entries to LocalStorage:', err);
  }
};

export const loadSettingsFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    const parsed = JSON.parse(data);
    if (parsed.brideName === 'S. Anitha, B.E.') parsed.brideName = '';
    if (parsed.groomName === 'K. Karthik, M.Tech.') parsed.groomName = '';
    if (parsed.hostName1 === 'S. Anitha, B.E.') parsed.hostName1 = '';
    if (parsed.hostName2 === 'K. Karthik, M.Tech.') parsed.hostName2 = '';
    if (parsed.venue === 'Sri Raja Rajeswari Mahal, Madurai') parsed.venue = '';
    return { ...defaultSettings, ...parsed };
  } catch (err) {
    console.error('Error loading settings from LocalStorage:', err);
    return defaultSettings;
  }
};

export const saveSettingsToStorage = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings to LocalStorage:', err);
  }
};

export const loadPrinterSettingsFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRINTER);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRINTER, JSON.stringify(defaultPrinterSettings));
      return defaultPrinterSettings;
    }
    return { ...defaultPrinterSettings, ...JSON.parse(data) };
  } catch (err) {
    return defaultPrinterSettings;
  }
};

export const savePrinterSettingsToStorage = (printerSettings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRINTER, JSON.stringify(printerSettings));
  } catch (err) {
    console.error('Error saving printer settings:', err);
  }
};
