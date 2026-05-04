class ELKDriver {
  constructor(endpoint) {
    this.endpoint = endpoint || "http://localhost:9200/logs/_doc";
  }

  write(message) {
    const payload = JSON.stringify({
      timestamp: new Date().toISOString(),
      message,
      environment: process.env.NODE_ENV || "development",
    });

    const url = new URL(this.endpoint);
    const http = url.protocol === "https:" ? require("https") : require("http");

    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        res.resume();
      },
    );

    req.on("error", () => {});
    req.write(payload);
    req.end();
  }
}

module.exports = ELKDriver;
