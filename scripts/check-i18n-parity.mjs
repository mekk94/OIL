import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EN_PATH = path.join(__dirname, '../public/i18n/en.json');
const AR_PATH = path.join(__dirname, '../public/i18n/ar.json');

function getKeys(obj, prefix = '') {
  return Object.keys(obj).reduce((res, el) => {
    if (Array.isArray(obj[el])) {
      return [...res, prefix + el];
    } else if (typeof obj[el] === 'object' && obj[el] !== null) {
      return [...res, ...getKeys(obj[el], prefix + el + '.')];
    }
    return [...res, prefix + el];
  }, []);
}

try {
  const en = JSON.parse(fs.readFileSync(EN_PATH, 'utf-8'));
  const ar = JSON.parse(fs.readFileSync(AR_PATH, 'utf-8'));

  const enKeys = new Set(getKeys(en));
  const arKeys = new Set(getKeys(ar));

  let hasError = false;

  for (const key of enKeys) {
    if (!arKeys.has(key)) {
      console.error(`❌ Missing in ar.json: ${key}`);
      hasError = true;
    }
  }

  for (const key of arKeys) {
    if (!enKeys.has(key)) {
      console.error(`❌ Missing in en.json: ${key}`);
      hasError = true;
    }
  }

  if (hasError) {
    console.error('💥 i18n parity check failed.');
    process.exit(1);
  }

  console.log('✅ i18n parity check passed.');
} catch (err) {
  console.error('Error reading i18n files:', err);
  process.exit(1);
}
