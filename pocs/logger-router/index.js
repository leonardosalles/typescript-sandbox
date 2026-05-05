const LoggerBuilder = require("./src/logger.builder");

const logger = new LoggerBuilder()
  .toFS("bench.log")
  .async(5000)
  .toELK("http://localhost:9200/logs/_doc")
  .sync()
  .build();

console.time("Execution Time");

for (let i = 0; i < 10000; i++) {
  logger.log(`Test log sequence ${i}`);
}

console.timeEnd("Execution Time");

console.log("Main thread execution finished. Processing async queue...");
