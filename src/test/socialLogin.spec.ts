import express from "express";
import request from "supertest";
import { expect } from "chai";
import app from "../app";
import router from "../router";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", router);

app.listen(3001, () => console.log("server is listening")); 

describe("[POST] /auth with unauthorized token", () => {
  it("should return 401 statusCode and error message", done => {
    const requestBody = {
      platform: "KAKAO",
      platformAccessToken: "X5qnClzv43jyc-_E_lN2Ko3fCHSkEnr9gpgS9sYhCiolDQAAAYWKpKXs"
    }
    request(app)
      .post("/auth") 
      .set("Content-Type", "application/json")
      .send(requestBody) 
      .expect(401)
      .expect("Content-Type", "application/json; charset=utf-8") 
      .then(res => {
        expect(res.body.message).to.equal("권한이 없는 유저입니다."); 
        done();
      })
      .catch(err => {
        console.error("######Error >>", err);
        done(err);
      })
  }); 
});