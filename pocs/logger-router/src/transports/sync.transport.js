class SyncTransport {
  constructor(driver) {
    this.driver = driver;
  }

  deliver(message) {
    this.driver.write(message);
  }
}

module.exports = SyncTransport;
