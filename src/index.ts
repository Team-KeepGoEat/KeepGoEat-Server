import express, { Request, Response } from "express";
import router from "./router";
import schedule from "node-schedule";
import { resetIsAchieved } from "./jobs";
import app from "./app";

const PORT = 3000;

app.use(express.json()); 

app.get("/test", (req: Request, res: Response) => {
  res.send("server is listening on 3000");
});

app.use("/", router); 

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
}); 

const rule = new schedule.RecurrenceRule
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = 20;
rule.minute = 30;
rule.tz = "Asia/Seoul";

const job = schedule.scheduleJob(rule, resetIsAchieved);