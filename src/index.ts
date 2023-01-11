import schedule from "node-schedule";
import { resetIsAchieved } from "./jobs";
import app from "./app";
import router from "./router";

const JOB_SCHEDULE_TIME = process.env.JOB_SCHEDULE_TIME as string;
const PORT = 3000;

app.use("/", router); 

app.listen(PORT, () => {
  console.log(`
        #############################################
            🛡️ Server listening on port: ${PORT} 🛡️
        #############################################
    `);
}); 

const job = schedule.scheduleJob(JOB_SCHEDULE_TIME, function () {
  resetIsAchieved();
});