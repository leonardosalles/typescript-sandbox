class LoggerRouter {
  constructor(transports = []) {
    this.transports = transports;
  }

  log(message) {
    const formatted = `[${new Date().toISOString()}] ${message}`;
    for (const transport of this.transports) {
      transport.deliver(formatted);
    }
  }
}

module.exports = LoggerRouter;
