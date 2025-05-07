## JS Engine 종류

1. V8 - 크롬
2. SpiderMonkey - 파이어폭스
3. JavaScriptCore - Safari

## Just In Time Compilation ( JIT ) V8

1. 코드 실행환경 준비하기
2. 컴파일하기
3. 바이트 코드 생성
4. Interpret 실행하기 ( Byte Code )
5. 자주 사용하는 코드를 Turbofan이 Machine Code를 생성함 (optimization)

## Byte Code VS Machine Code

Machine Codes는 CPU가 바로 읽고 사용 할 수 있는 코드

- 실행이 겁나 빠름
- 컴파일이 느림
- 운영체제에 종속적이라 다른 운영체제에서는 사용 불가
  Byte Codes는 CPU가 바로 읽고 사용 할 수 없는 코드로 중간에 interpreter 등이 존재
- High Level Language로 작성된 코드
- 실행이 느림
- 컴파일이 빠름
- 운영체제에 종속적이지 않음 ( interpreter 만 있으면 실행가능)

## JS가 ByteCode를 사용하는 이유

- JS코드가 1만 줄이라면 ByteCode는 약 8만줄 이고 Machine Code는 약 8000만줄? 이라고 한다.

## NodeJS의 싱글 스레드 모델(non-blocking I/O)

1. non-blocking request -> Event Queue -> Event Loop -> response
2. blacking request -> Event Queue -> Event Loop -> Worker Thread -> blacking request end -> Event Loop -> response

## HTTP 구성요소

1. URL - 요청을 보내는 주소
2. Method - 요청의 종류/타입 ( GET, POST, PUT, PATCH, DELETE )
3. Header - 요청에 대한 메타데이터

- ex) Content-Type, Authorization, User-Agent

4. Body - 요청의 데이터

### URL의 구성요소

1. Scheme - 프로토콜 ( http, https, ftp )
2. Host - 서버의 주소 ( www.naver.com )
3. Path - 서버의 경로 ( /api/user )
4. Query - 요청의 파라미터 ( ?id=1&name=kim )

### Method

1. 같은 URL에 여러개의 Method가 존재할 수 있다.
2. GET - 조회
3. POST - 생성
4. PUT - 생성, 수정
5. PATCH - 수정
6. DELETE - 삭제

### Header

- 라이브러리, 프레임워크, 환경에 의해 자동 생성 되는 값들이 많고 직접 값을 변경 하는 경우는 상대적으로 적다.

### Body

- 요청에 대한 로직 수행에 필요한 직적접으로 필요한 정보를 정의한다.

### Status Code

100 - 199: Informational responses ( 정보 응답 )  
200 - 299: Successful responses ( 성공 응답 )
300 - 399: Redirection messages ( 리다이렉션 응답 )
400 - 499: Client error responses ( 클라이언트 오류 응답 )
500 - 599: Server error responses ( 서버 오류 응답 )
