import express, { Request, Response } from "express";
import router from "./router";

const app = express(); 
const PORT = 3000;

app.use(express.json()); 

app.use("/api", router); 

app.get("/", (req: Request, res: Response) => {
  res.send("server is listening on 3000");
});

app.listen(PORT, () => {
  console.log(`
        #############################################
            🛡️ Server listening on port: ${PORT} 🛡️
        #############################################
    `);
}); 