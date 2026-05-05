class AsyncTransport {
  constructor(driver, bufferSize = 1000) {
    this.driver = driver;
    this.queue = [];
    this.bufferSize = bufferSize;
    this.isProcessing = false;
    this.setupShutdownHook();
  }

  deliver(message) {
    if (this.queue.length >= this.bufferSize) {
      this.flush();
    }

    this.queue.push(message);
    this.processQueue();
  }

  processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    setImmediate(() => {
      while (this.queue.length > 0) {
        const message = this.queue.shift();

        try {
          this.driver.write(message);
        } catch (err) {
          process.stderr.write(`Transport failure: ${err.message}\n`);
        }
      }

      this.isProcessing = false;
    });
  }

  flush() {
    while (this.queue.length > 0) {
      const message = this.queue.shift();

      try {
        this.driver.write(message);
      } catch (err) {
        process.stderr.write(`Flush failure: ${err.message}\n`);
      }
    }
  }

  setupShutdownHook() {
    const handleShutdown = () => {
      this.flush();
      process.exit(0);
    };

    process.once("SIGINT", handleShutdown);
    process.once("SIGTERM", handleShutdown);
  }
}

module.exports = AsyncTransport;
