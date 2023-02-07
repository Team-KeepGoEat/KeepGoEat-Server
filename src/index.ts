import express, { Request, Response } from "express";
import router from "./router";
import schedule from "node-schedule";
import { resetIsAchieved } from "./jobs";
import app from "./app";
import { debugLog } from "./logger/logger";

const JOB_SCHEDULE_TIME = process.env.JOB_SCHEDULE_TIME as string;
const PORT = 3000;

app.use(express.json()); 

app.get("/test", (req: Request, res: Response) => {
  res.send("server is listening on 3000");
});

app.use("/", router); 

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
}); 

const job = schedule.scheduleJob(JOB_SCHEDULE_TIME, function () {
  resetIsAchieved();
});