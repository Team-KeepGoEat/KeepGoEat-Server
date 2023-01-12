import express from "express";
import request from "supertest";
import { expect } from "chai";
import app from "../app";
import router from "../router";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", router);

app.listen(3001, () => console.log("server is listening")); 

const JWT_ACCESSTOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoibHNoMzI4MzI4QG5hdmVyLmNvbSIsImlhdCI6MTY3MzQ2Mjk1NiwiZXhwIjoxNjczOTY2OTU2LCJpc3MiOiJLRUVQR09FQVRfU0VSVkVSIn0.N90z3Kqd9b0ZljcPWpRNl0MAb5oWHnVz-RUvB3nhaKM";  

describe("[GET] /home with vaild param", () => {
  it("should success and return 200 statusCode", done => {
    request(app)
      .get("/home") 
      .set("Content-Type", "application/json")
      .set("accesstoken", JWT_ACCESSTOKEN) 
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