const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890abcdefghijklmnoprstuvyz", 24);

module.exports = nanoid;