# 🚀 KeepGoEat-Server
🥗 킵고잇 킵서버 gbzg
❗ 킵고잇 킵서버는 아직 리드미 수정중..

## 🥗 ERD
![image](https://user-images.githubusercontent.com/82032418/210483620-a84873c2-6ba9-4792-9f69-4ca82727dcb3.png)

## 🥗 역할 분담
|임승하|
|:---:|
|Lead|
|홈 화면조회 api, 목표 달성 api, 기록뷰 api, 마이페이지 조회 api, 소셜로그인 및 회원가입 api, 토큰 재발급 api |

|장한빛|
|:---:|
|Potato|
|목표 추가 api, 목표 보관 api, 목표 삭제 api, 목표 수정 api|

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
### 선언되지 않은 type, interface, function 등을 사용하는 것 금지
### any 타입을 사용할 시 경고
### 빈 함수를 사용하는 것 금지. 단, 화살표 함수 예외
### 멤버 표현식에서 개행 일관성을 유지
### 카멜케이스 사용하지 않을 시 경고
### == 및 != 사용을 경고
### 중괄호로 묶이지 않은 블록문을 금지
### 들여쓰기로 스페이스 2번을 하지 않을 경우 에러
### console 개체의 메서드에 대한 호출 또는 할당을 불허

## 🥗 branch 전략

## 🥗 foldering

## 🥗 전체 API 로직 구현 진척도
