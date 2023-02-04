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
    const JWT_EXPIRED_ACCESS = process.env.JWT_EXPIRED_ACCESS;
    const JWT_EXPIRED_REFRESH = process.env.JWT_EXPIRED_REFRESH;

    request(app)
      .post("/auth/refresh") 
      .set("Content-Type", "application/json")
      .set("accesstoken", JWT_EXPIRED_ACCESS as string) 
      .set("refreshtoken", JWT_EXPIRED_REFRESH as string) 
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