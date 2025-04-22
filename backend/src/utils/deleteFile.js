const fs = require('fs');
const path = require('path');

const deleteFile = (relativePath) => {
  try {
    const fullPath = path.join(__dirname, '..', relativePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (err) {
    console.warn(`⚠️ Failed to delete file: ${relativePath}`, err.message);
  }
};

module.exports = { deleteFile };
