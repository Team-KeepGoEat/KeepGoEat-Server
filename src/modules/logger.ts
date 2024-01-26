const winston = require("winston");
const ecsFormat = require("@elastic/ecs-winston-format");

const debugLog = (url?: any, method?: any, body?: any, uid?: any) => {
  const logger = winston.createLogger({
    level: "debug",
    format: ecsFormat({ convertReqRes: true }),
    transports: [
      new winston.transports.File({
        filename: "logs/log.json",
        level: "debug"
      })
    ]
  });

  logger.log("debug", `[${method}] ${url} || Request Body: ${JSON.stringify(body)} ${uid ? `uid: ${uid}` : "uid is Null"}`);

};

const infoLog = (url?: any, method?: any, body?: any, uid?: any) => {
  const logger = winston.createLogger({
    level: "info",
    format: ecsFormat({ convertReqRes: true }),
    transports: [
      new winston.transports.File({
        filename: "logs/log.json",
        level: "info"
      })
    ]
  });

  logger.log("info", `[${method}] ${url} || Request Body: ${JSON.stringify(body)} ${uid ? `uid: ${uid}` : "uid is Null"}`);

};

const errorLog = (url?: any, method?: any, body?: any, error?: any, uid?: any) => {
  const logger = winston.createLogger({
    level: "error",
    format: ecsFormat({ convertReqRes: true }),
    transports: [
      new winston.transports.File({
        filename: "logs/log.json",
        level: "error",
      })
    ]
  });

  logger.log("error", `[${method}] ${url} || Request Body: ${JSON.stringify(body)} ${uid ? `uid: ${uid}` : "uid is Null"} || error: ${error}`);

};

const logger = {
  debugLog,
  infoLog,
  errorLog
};

export default logger;


