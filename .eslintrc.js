module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "overrides": [
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    // 이 규칙은 선언 전에 type, interface, function 등을 선언하기 전에 사용하는 것을 금지합니다.
    "@typescript-eslint/no-use-before-define": "warn",
    // 이 규칙은 타입에 any 타입을 사용하는 것을 경고합니다.
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    // 이 규칙은 빈 함수를 사용하는 것을 금지합니다.
    "@typescript-eslint/no-empty-function": [
      "error",
      {
        "allow": [
          "arrowFunctions"
        ]
      }
    ],
    // 이 규칙은 멤버 표현식에서 개행 일관성을 유지하는 목표를 가집니다.
    "dot-location": "off",
    // 이 규칙은 카멜케이스를 사용하도록 경고합니다.
    "camelcase": "warn",
    // 이 규칙은 안전하지 않은 형식의 등식 연산자를 제거하기위한 것입니다.
    "eqeqeq": "warn",
    //이 규칙은 블록 문을 중괄호로 묶어 버그를 방지하고 코드 선명도를 높이는 데 목적이 있습니다. 중괄호가 생략 된 블록이 발견되면 경고합니다.
    "curly": "error",
    // 들여쓰기 규칙을 추가하기 위한 것입니다.
    "indent": ["warn", 2],
    // 이 규칙은 console 개체의 메서드에 대한 호출 또는 할당을 허용하지 않습니다 .
    "no-console": "warn",
    // 이 규칙은 백틱, 큰 따옴표 또는 작은 따옴표를 일관되게 사용합니다.
    "quotes": ["error", "double"]
  }
}