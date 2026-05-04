const fs = require("fs");
const path = require("path");

class FSDriver {
  constructor(filePath = "app.log") {
    this.filePath = path.resolve(filePath);
  }

  write(message) {
    fs.appendFileSync(this.filePath, message + "\n");
  }
}

module.exports = FSDriver;
