import express from "express";
import request from "supertest";
import { expect } from "chai";
import app from "../app";
import router from "../router";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", router);

app.listen(3001, () => console.log("server is listening")); 

describe("[POST] /auth/refresh with both expired token", () => {
  it("should return 401 statusCode and error message", done => {
    const JWT_ACCESSTOKEN = process.env.JWT_ACCESSTOKEN;
    const JWT_REFRESHTOKEN = process.env.JWT_REFRESHTOKEN;

    request(app)
      .post("/auth/refresh") 
      .set("Content-Type", "application/json")
      .set("accesstoken", JWT_ACCESSTOKEN as string) 
      .set("refreshtoken", JWT_REFRESHTOKEN as string) 
      .expect(401) 
      .expect("Content-Type", "application/json; charset=utf-8") 
      .then(res => {
        expect(res.body.message).to.equal("모든 토큰이 만료되었습니다."); 
        done();
      })
      .catch(err => {
        console.error("######Error >>", err);
        done(err);
      })
  }); 
});