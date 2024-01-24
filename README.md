# 🚀 KeepGoEat-Server

## 💡 킵고잇은?<br>
<div align="center">
<strong>킵고잇 (Keep-Go-Eat)</strong> <br><br>
"좋은 음식은 더 먹고,<br>
나쁜 음식은 덜 먹는 날을 늘려가도록 돕는<br>
즐거운 식습관 기록 서비스"<br><br>

"먹는 건 원래 즐거운 일이니까.<br> 
건강한 식사도 즐거울 수 있다.<br>
킵고잇과 함께라면"<br><br>
![image](https://user-images.githubusercontent.com/82032418/212300993-8eb759a1-6bb2-4181-9fa8-b2bc4921156a.png)

</div><br>

## 🥗 API Docs 
[🍽️ 킵고잇 API 명세서](https://www.notion.so/68space/API-e09873efb3514933967638e8b6eaa20e?pvs=4)

<br>

## 🥗 Tech Stack
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"> <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Expressjs&logoColor=white"> 
<br>
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black"> <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
<br>
<img src="https://img.shields.io/badge/amazonaws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white">
<img src="https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=PM2&logoColor=white">
<img src="https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=Nodemon&logoColor=white">
<br>
<img src="https://img.shields.io/badge/postgreSQL-4169E1.svg?style=for-the-badge&logo=postgreSQL&logoColor=white"> <img src="https://img.shields.io/badge/Prisma-2D3748.svg?style=for-the-badge&logo=Prisma&logoColor=white"> 
<br>
<img src="https://img.shields.io/badge/mocha-8D6748.svg?style=for-the-badge&logo=Mocha&logoColor=white"> <img src="https://img.shields.io/badge/JSONWebTokens-000000.svg?style=for-the-badge&logo=JSONWebTokens&logoColor=white">

<br>


## 🎉 주요 기능 소개
### 1️⃣ 메인 홈
나를 응원해주는 달팽이를 만나요.<br>
중간에 포기하지 않도록 가볍고 즐겁게 식습관을 만드는 것이 중요하다는 것을 알려줘요.<br><br>
<img src="https://user-images.githubusercontent.com/82032418/212301567-d7f1785d-c016-469d-815d-0c5e94a3a8f1.png" width="50%"><br><br>

### 2️⃣ 목표 설정
더 먹기, 덜 먹기 중 한 가지를 선택하고<br>
자유롭게 나만의 목표를 입력해요.<br><br>
<img src="https://user-images.githubusercontent.com/82032418/212301806-7d54dad3-3e59-4474-9cb9-89d831f00e5d.png" width="50%"><br><br>

### 3️⃣ 목표 달성
진행중인 목표를 얼마나 달성했는지 홈에서 확인할 수 있어요.<br>
목표를 달성하면 킵고잇을 찾아와 잘 해냈다고 알려주세요.<br><br>
<img src="https://user-images.githubusercontent.com/82032418/212302036-08acc0f3-33ab-4c32-b44d-1d9c6fb3f469.png" width="50%"><br><br>

### 4️⃣ 목표 기록 
노력한 날들을 기록합니다.<br>
전 날 채우지 못했더라도 괜찮아요.<br>
성취의 즐거움과 뿌듯함을 오롯이 남겨보세요.<br><br>
<img src="https://user-images.githubusercontent.com/82032418/212302269-2f6d8c49-69cc-49d5-9b59-454fc1d55c71.png" width="50%"><br><br>

### 5️⃣ 목표 보관
이제 진행하지 않는 목표는<br>
지우지 말고 보관해요.<br><br>
<img src="https://user-images.githubusercontent.com/82032418/212302424-874e20c8-7095-48f5-a204-d335874e4b56.png" width="50%"><br><br>


## 🥗 역할 분담
<div align="center">

|임승하|장한빛|
|:---:|:---:|
|<img src="https://user-images.githubusercontent.com/82032418/212297276-621851d7-fb93-4d36-b516-0a700c1668e7.png" width="150px">|<img src="https://user-images.githubusercontent.com/82032418/212296932-b9d4af0f-f8eb-4c33-8750-c2c06a7422c8.png" width="130px">|
|홈 화면조회 api,<br> 목표 달성 api,<br> 기록뷰 api,<br> 마이페이지 조회 api,<br> 소셜로그인 및 회원가입 api,<br> 토큰 재발급 api |목표 추가 api,<br> 목표 보관 api,<br> 목표 삭제 api,<br> 목표 수정 api|
</div>

## 🥗 server architecture
![image](https://user-images.githubusercontent.com/82032418/212338099-62f146fe-4d52-4712-b176-2c92243576d1.png)

## 🥗 ERD
![image](https://user-images.githubusercontent.com/82032418/212294282-f80a425c-89fc-4f0c-82ae-985e6cf36c95.png)

## 🥗 Project Dependency
```
{
  "scripts": {
    "dev": "nodemon",
    "build": "tsc && node dist",
    "test": "mocha",
    "prepare": "husky install",
    "greeting": "echo \"\\033[32mHello World\""
  },
  "devDependencies": {
    "@types/chai": "^4.3.4",
    "@types/express": "^4.17.14",
    "@types/express-validator": "^3.0.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/lodash": "^4.14.191",
    "@types/mocha": "^10.0.1",
    "@types/node": "^18.11.9",
    "@types/node-schedule": "^2.1.0",
    "@typescript-eslint/eslint-plugin": "^5.47.1",
    "@typescript-eslint/parser": "^5.47.1",
    "nodemon": "^2.0.20",
    "husky": "^8.0.0"
  },
  "dependencies": {
    "@prisma/client": "^4.8.0",
    "@types/body-parser": "^1.19.2",
    "@types/supertest": "^2.0.12",
    "axios": "^1.2.2",
    "chai": "^4.3.7",
    "dayjs": "^1.11.7",
    "eslint": "^8.30.0",
    "express": "^4.18.2",
    "express-validator": "^6.14.2",
    "jsonwebtoken": "^9.0.0",
    "node-schedule": "^2.1.0",
    "prisma": "^4.8.0",
    "supertest": "^6.3.3"
  }
}

```

## 🥗 foldering
root-dir<br>
  ㄴprisma<br>
  ㄴsrc<br>
    ㄴconfig<br>
    ㄴconstants<br>
    ㄴcontroller<br>
    ㄴinterfaces<br>
    ㄴmiddlewares<br>
    ㄴmodules<br>
    ㄴrouter<br>
    ㄴservice<br>
    ㄴauth
