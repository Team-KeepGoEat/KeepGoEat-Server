import express from "express";
import request from "supertest";
import { expect } from "chai";
import app from "../app";
import router from "../router";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", router);

app.listen(3001, () => console.log("server is listening")); 

const JWT_ACCESSTOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoibHNoMzI4MzI4QG5hdmVyLmNvbSIsImlhdCI6MTY3MzQ2NTE2NiwiZXhwIjoxNjczNDY1MTY3LCJpc3MiOiJLRUVQR09FQVRfU0VSVkVSIn0.VNQ7G7IGTh47uO667jctlGVKuWEtGtJt1ePH0LSeIXg";
const JWT_REFRESHTOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzM0NjUxNjYsImV4cCI6MTY3MzQ2NTE2NywiaXNzIjoiS0VFUEdPRUFUX1NFUlZFUiJ9.qv5o7eUryUxkxUu2-TqZrDzvoKpz5RcaphLAFcL08bw";

describe("[POST] /auth/refresh with both expired token", () => {
  it("should return 401 statusCode and error message", done => {
    request(app)
      .post("/auth/refresh") 
      .set("Content-Type", "application/json")
      .set("accesstoken", JWT_ACCESSTOKEN) 
      .set("refreshtoken", JWT_REFRESHTOKEN) 
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