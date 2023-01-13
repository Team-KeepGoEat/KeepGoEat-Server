import express from "express";
import request from "supertest";
import { expect } from "chai";
import app from "../app";
import router from "../router";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", router);

app.listen(3001, () => console.log("server is listening")); 

describe("[GET] /mypage with vaild param", () => {
  it("should refresh and return 200 statusCode", done => {
    const JWT_ACCESSTOKEN = process.env.JWT_ACCESSTOKEN;

    request(app)
      .get("/mypage?sort=all") 
      .set("Content-Type", "application/json")
      .set("accesstoken", JWT_ACCESSTOKEN as string)  
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