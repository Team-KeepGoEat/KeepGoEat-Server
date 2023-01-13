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

## 🎉 주요 기능 소개
- 이미지 출처: 킵고잇(Keep-Go-Eat) Team Design
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

## 🥗 dependencies module
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

## 🥗 server architecture

## 🥗 ERD
![image](https://user-images.githubusercontent.com/82032418/212294282-f80a425c-89fc-4f0c-82ae-985e6cf36c95.png)



## 🥗 commit convention
### Commit Message Structure
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s) - 생략 가능]
```

#### 언어
한글, 영어 무엇을 사용하여도 상관 없으나 식별할 수 있도록 작성한다.
해당 commit 이 어떤 commit 인지 알 수 있어야 한다.

#### Description
글자의 큰 제한은 없으나 되도록 50 글자 내외로 작성하도록 한다.

#### Body
글자의 큰 제한은 없으나 가능한 100 글자가 넘는 경우 줄 바꿈이 가능하도록 노력한다.

### Commit Type
Commit Message Type은 아래 명시된 기준으로 분류한다.
```
feat - A new feature
fix - A bug fix
docs - Documentation only changes
style - Changes that do not affect the meaning of the code(white-space, formatting, missing semi-colons, etc)
refactor - A code change that neither fixes a bug nor adds a feature
perf - A code change that improves performance
test - Adding missing tests or correcting existing tests
build - Changes that affect the build system or external dependencies
ci - Chnage to our CI configuration files and scripts(ex: Travis, Circle, Github Action, etc)
chore - Other changes that don't modify src or test files
```

## 🥗 coding convention
1. 선언되지 않은 type, interface, function 등을 사용하는 것 금지
2. any 타입을 사용할 시 경고
3. 빈 함수를 사용하는 것 금지. 단, 화살표 함수 예외
4. 멤버 표현식에서 개행 일관성을 유지
5. 카멜케이스 사용하지 않을 시 경고
6. == 및 != 사용을 경고
7. 중괄호로 묶이지 않은 블록문을 금지
8. 들여쓰기로 스페이스 2번을 하지 않을 경우 에러
9. console 개체의 메서드에 대한 호출 또는 할당을 불허
10. 백틱, 큰 따옴표 또는 작은 따옴표를 일관되게 사용
11. 변수(함수)명에 대한 이름
    - 변수, 함수 , 인스턴스 - Camel Case
    - 함수명 작성 시 동사 + 명사
    - Class, Constructor - Pascal Case
12. 글자 길이: 20개 제한, 최대 3단어까지
13. 약칭 사용: 최대한 피하자.
14. 최대 depth: 4개로 제한
15. 주석
    - 한 줄 주석 - `//`
    - 두 줄부터 - `/* */`
16. if문 bracket({}) : 여러 줄로 작성
17. 함수 사용
    - else if 사용 지양
    - 테스트가 필요한 기능일 시 arrow function 사용하지 않음
    - 한 줄로 끝나는 경우나 테스트가 필요한 경우에만 arrow function 사용
    - 함수 파라미터 개수 3개까지만
    - Promise 함수보단 async, await 사용. 

## 🥗 branch 전략
0. dev가 default 브랜치입니다
필요시 stg나 prod 브랜치를 추가로 생성합니다

1. 기능별로 feature/기능이름 으로 브랜치를 dev에서 딴다
    - dev로 체크아웃 한 뒤에 브랜치를 따야됨
    - dev는 항상 풀을 받아놓은 상태
    - 브랜치를 따기 전에는 항상 dev에 풀을 받아놓아야 함
    
    ```
    git checkout dev
    
    git pull origin dev --no-rebase
    
    git branch feature/onboarding
    ```
    
2. 해당 기능 브랜치에서 기능 개발을 함

3. 개발 완료 후 해당 remote 기능 브랜치에 push
    ```
    git push origin feature/onboarding
    ```
    
4. pr 날린 뒤 문제 없으면 dev에 merge함

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
