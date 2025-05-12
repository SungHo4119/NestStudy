# 의존성 주입과 제의 역전

## 의존성 주입(Dependency Injection)

의존성 주입(Dependency Injection, DI)은 객체 간의 의존 관계를 외부에서 주입하는 디자인 패턴입니다.

## 제어의 역전(Inversion of Control, IoC)

제어의 역전(Inversion of Control, IoC)은 객체의 생성과 의존성 관리를 프레임워크가 담당하도록 하는 디자인 패턴입니다.

## NestJS에서의 DI/IoC

NestJS는 의존성 주입/제어의 역전을 통해 모듈 간의 의존성을 관리합니다.

- NestJS는 실행과 동시에 IoC Container를 생성합니다.
- IoC Container는 모듈을 등록하고, 모듈 간의 의존성을 관리합니다.
- NestJS는 IoC Container를 통해 의존성 주입을 수행합니다.
- 인스턴스를 별도로 생성하는 코드가 없다면 NestJS가 자동으로 인스턴스를 생성 및 관리함으로 코드 작성하기가 매우쉽다.
