import express from "express";
import request from "supertest";
const chai = require("chai");
import app from "../app";
import router from "../router";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", router);

app.listen(3001, () => console.log("server is listening")); 

const JWT_ACCESSTOKEN = ""  // 여기에 jwt 엑세스토큰 넣고 mocha /test/파일명 으로 실행

describe("[GET] /home with vaild param", () => {
  it("should success and return 200 statusCode", done => {
    request(app)
      .get("/home") 
      .set("Content-Type", "application/json")
      .set("accesstoken", JWT_ACCESSTOKEN) 
      .expect(200) 
      .expect("Content-Type", "application/json; charset=utf-8") 
      .then(res => {
        done();
      })
      .catch(err => {
        console.error("######Error >>", err);
        done(err);
      })
  }); 
});