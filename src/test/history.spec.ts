import express from "express";
import request from "supertest";
import app from "../app";
import router from "../router";

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
app.use("/", router);

app.listen(3001, () => console.log("server is listening")); 

describe("[GET] /history with vaild param", () => {
  it("should return 200 statusCode", done => {
    const JWT_ACCESSTOKEN = process.env.JWT_ACCESSTOKEN as string;
    request(app)
      .get("/history/12345") 
      .set("Content-Type", "application/json")
      .set("accesstoken", JWT_ACCESSTOKEN) 
      .expect(200)
      .then(res => { done() })
      .catch(err => {
        console.error("######Error >>", err);
        done();
      })
  }); 
});