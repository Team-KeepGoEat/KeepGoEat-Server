import express from "express";
import request from "supertest"
import { expect } from "chai";
import app from "../app";
import router from "../router";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", router);

app.listen(3001, () => console.log("server is listening")); 

describe("POST /goal", () => {
  it("목표 추가에 성공했습니다.", done => {
    const JWT_ACCESSTOKEN = process.env.JWT_ACCESSTOKEN;
    request(app)
      .post("/goal")
      .set("Content-Type", "application/json")
      .set("accessToken", JWT_ACCESSTOKEN as string) 
      .send({
        "goalContent" : "하루에 파프리카",
        "isMore": true,
      }) 
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8") 
      .then(res => {
        expect(res.body.success).to.equal(true); 
        done();
      })
      .catch(err => {
        console.error("######Error >>", err);
        done(err);
      })
  });
});