const crypto = require('node:crypto');

function hashString(value, salty) {
  return crypto.createHmac('sha256', salty).update(value).digest('hex');
}

module.exports = { hashString };
