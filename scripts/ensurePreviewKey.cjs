const fs = require('fs');
const crypto = require('crypto');

const ENV_PATH = '.env';
const KEY_NAME = 'PREVIEW_KEY';

const readEnvFile = () => {
  try {
    return fs.readFileSync(ENV_PATH, 'utf8');
  } catch {
    return '';
  }
};

const hasPreviewKey = (content) => new RegExp(`^${KEY_NAME}=`, 'm').test(content);

const generateKey = () => crypto.randomBytes(32).toString('base64url');

const writeEnvFile = (content) => {
  fs.writeFileSync(ENV_PATH, content, 'utf8');
};

const content = readEnvFile();
if (hasPreviewKey(content)) {
  process.exit(0);
}

const key = generateKey();
let output = content;
if (output.length && !output.endsWith('\n')) output += '\n';
output += `${KEY_NAME}=${key}\n`;
writeEnvFile(output);

console.log('Preview key generated and stored in .env.');
