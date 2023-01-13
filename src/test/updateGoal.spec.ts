import express from "express";
import request from "supertest";
import { expect } from "chai";
import app from "../app";
import router from "../router";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", router);

app.listen(3001, () => console.log("server is listening")); 

describe("POST /goal/:goalId with vaild param", () => {
  it("목표 수정에 성공했습니다.", done => {
    const token = process.env.JWT_ACCESSTOKEN;
    const data = {
      "goalContent" : "양파쿵야"
    }
    request(app)
      .post("/goal/98") 
      .set("Content-Type", "application/json")
      .set("accesstoken", token as string) 
      .send(data)
      .expect(200) 
      .expect("Content-Type", "application/json; charset=utf-8") 
      .then(res => {
        expect(res.body.data.goalId).to.equal(98);
        done();
      })
      .catch(err => {
        console.error("######Error >>", err);
        done(err);
      })
  }); 
});