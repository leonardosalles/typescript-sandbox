const LoggerRouter = require("./logger.router");
const FSDriver = require("./drivers/fs.driver");
const ELKDriver = require("./drivers/elk.driver");
const SyncTransport = require("./transports/sync.transport");
const AsyncTransport = require("./transports/async.transport");

class LoggerBuilder {
  constructor() {
    this.targets = [];
  }

  toFS(filePath) {
    this.currentTarget = { type: "fs", config: filePath };
    return this;
  }

  toELK(endpoint) {
    this.currentTarget = { type: "elk", config: endpoint };
    return this;
  }

  sync() {
    if (!this.currentTarget) return this;

    this.currentTarget.mode = "sync";
    this.targets.push(this.currentTarget);
    this.currentTarget = null;

    return this;
  }

  async(bufferSize) {
    if (!this.currentTarget) return this;

    this.currentTarget.mode = "async";
    this.currentTarget.bufferSize = bufferSize;
    this.targets.push(this.currentTarget);
    this.currentTarget = null;

    return this;
  }

  build() {
    const transports = this.targets.map((target) => {
      let driver;

      if (target.type === "fs") {
        driver = new FSDriver(target.config);
      }
      if (target.type === "elk") {
        driver = new ELKDriver(target.config);
      }

      if (target.mode === "async") {
        return new AsyncTransport(driver, target.bufferSize);
      }

      return new SyncTransport(driver);
    });

    return new LoggerRouter(transports);
  }
}

module.exports = LoggerBuilder;
