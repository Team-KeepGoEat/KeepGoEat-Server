const winston = require("winston");
const ecsFormat = require("@elastic/ecs-winston-format");
import express, { Request, Response } from "express";
import router from "./router";
import schedule from "node-schedule";
import { resetIsAchieved } from "./jobs";

const JOB_SCHEDULE_TIME = process.env.JOB_SCHEDULE_TIME as string;
const app = express(); 
const PORT = 3000;

const logger = winston.createLogger({
  level: "debug",
  format: ecsFormat({ convertReqRes: true }),
  transports: [
    //new winston.transports.Console(),
    new winston.transports.File({
      //path to log file
      filename: "logs/log.json",
      level: "debug"
    })
  ]
})


app.use(express.json()); 

app.get("/test", (req: Request, res: Response) => {
  res.send("server is listening on 3000");
});

app.use("/", router); 

app.listen(PORT, () => {
  logger.log("debug", `
        #############################################
            🛡️ Server listening on port: ${PORT} 🛡️
        #############################################
    `);
}); 

console.log("##### before schedule #####");
const job = schedule.scheduleJob(JOB_SCHEDULE_TIME, function () {
  console.log("##### schedule #####");
  resetIsAchieved();
});

