### yarn init

- 사용시 editorconfig, gitattributes, package.json, yarn lock 파일이 생성된다.
  - editorconfig은 코드 스타일을 통일하기 위한 설정 파일이다. 다른 설정파일 (프리티어)를 사용하기 위해 삭제하였다
  - gitattributes는 git에서 사용하는 설정파일이다. 현재시점에 의미가없어서 우선 삭제하였다.

### yarn add express

- express설치를 위해 yarn add express를 사용 하였는데 pnp.cjs가 생성되었다.(추후 별도로 공부 해야할듯) - 설치하지않는 패키지
  - Node_modules가 생성 되지않아 찾아보니 `yarn config set nodeLinker node-modules` 사용하는 경우 node_modules가 사용가능하도록 변경되고 `yarn install`를 통해 설치를 진행한다.

## Nest 리소스 생성방법

- npx nest g resource

## Nest 실행 방법

- start:dev
