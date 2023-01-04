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
root-dir
  ㄴprisma
  ㄴsrc
    ㄴconfig
    ㄴconstants
    ㄴcontroller
    ㄴinterfaces
    ㄴmiddlewares
    ㄴmodules
    ㄴrouter
    ㄴservice
    ㄴauth

## 🥗 전체 API 로직 구현 진척도
한빛 
ㄴ목표 추가 90%
ㄴ목표 보관 20%
ㄴ목표 삭제 90%
ㄴ목표 수정 20%

승하
ㄴ목표 달성 0%
ㄴ홈 화면조회 0%
ㄴ기록뷰 90%
ㄴ마이페이지 조회 90%
ㄴ소셜로그인 및 회원가입 90%
ㄴ토큰 재발급 90%
