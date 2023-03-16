# Mommos CLI

EDA(Event Driven Architecture) 기반의 마이크로 서비스를 구현하기 위한 Monolith의 프레임워크인 Mommos 의 소스코드 생성을 돕는 도구입니다.

## 설치

설치를 위해서 우선 사용하고자 하는 시스템에 `Node.js`가 설치되어 있어야 합니다.
`Node.js`가 설치된 상태에서 다음 명령어를 실행합니다.

```sh
$ npm i -g https://github.com/monolith-taehyun/mommos-cli.git
```

## 사용법

설치가 완료되면 터미널 상에서 `mmm` 명령어를 사용할 수 있습니다.

```sh
$ mmm
Usage: mmm [options] [command]

Command Line Interface of Mommos Application

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  app|a           Mommos 기반 Application 생성
  sample|s        샘플 텍스트 파일 생성
  help [command]  display help for command
```

기본 앱을 생성하는 방법

```sh
$ mkdir test-api
$ cd test-api
$ mmm app
```

## 개발 로드맵

- [x] 기본 애플리케이션 구조 생성
- [ ] DB 접속 등 각종 설정 추가
- [ ] Topic 생성
- [ ] Avro 소스 생성
- [ ] Entity 소스 생성
- [ ] 이벤트 Flow 에 소스 생성
