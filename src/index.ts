import express, { Request, Response } from "express";
import router from "./router";
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
