# Mommos CLI

EDA(Event Driven Architecture) 기반의 마이크로 서비스를 구현하기 위한 Monolith의 프레임워크인 Mommos 의 소스코드 생성을 돕는 도구입니다.

## 설치

설치를 위해서 우선 사용하고자 하는 시스템에 `Node.js`가 설치되어 있어야 합니다.
`Node.js`가 설치된 상태에서 다음 명령어를 실행합니다.

```sh
$ npm i -g https://github.com/monolith-taehyun/mommos-cli.git
```

## 최신 버전으로 업데이트

이미 `Mommos CLI`가 설치되어 있다면 최신 버전을 설치하기 위해 위의 설치 명령어를 사용해도 되지만 `update` 명령어를 이용할 수도 있습니다.

```sh
$ mmm update
? 업데이트 가능한 최신 버전이 있습니다. 업데이트 하시겠습니까? Yes
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
  app|ap          Mommos 기반 Application 생성
  configure|conf  Mommos CLI 설정
  event|ev        Event 생성
  avro|av         Avro 파일 생성
  kafka|k         Kafka 요청
  sample|sam      샘플 텍스트 파일 생성
  help [command]  display help for command
```

명령어 뒤에 `-h` 옵션을 추가하여 실행가능한 하위 명령어 및 옵션을 확인할 수 있습니다.

```sh
$ mmm kafka topic -h
Usage: mmm kafka topic|tp [options] [command]

Kafka Topic Command

Options:
  -h, --help         display help for command

Commands:
  create|c [name]    Kafka Topic Command
  list|ls            List Topics
  delete|del <name>  Delete Topic
  help [command]     display help for command
```

명령어의 체계는 다음과 같습니다.

> 모서리가 둥근 사각형은 `명령어`를 나타내고 육각형은 해당 명령어의 설명을 나타냅니다.
> 예를 들어 Avro를 스키마레지스트리에 등록하는 명령은 `$ mmm avro register ./src/main/avro/my-avro-v1.avsc` 와 같이 사용할 수 있습니다.

```mermaid
graph LR

Main(mmm) --> APP(app)
Main --> UPDATE(update)
Main --> CONF(configure)
Main --> EVENT(event)
Main --> AVRO(avro)
Main --> KAFKA(kafka)

APP -.-> |생략가능| APP_CREATE(create) -.- ACR{{애플리케이션 생성}}

UPDATE -.- UP_DESC{{CLI 업데이트}}

CONF -.- CONF_DESC{{정보 설정}}

EVENT -.- ER{{토픽 및 매핑 생성}}
EVENT --> EVENT_TOPIC(topic) -.- ETR{{토픽 관련 파일 생성}}
EVENT --> EVENT_MAPPING(mapping) -.- EMR{{이벤트 매핑 파일 생성}}

AVRO -.- AVCR{{Avro 파일 생성}}
AVRO --> AVRO_REGISTER(register) -.- |path| AVREGR{{Avro를 스키마레지스트리에 등록}}
AVRO --> AVRO_DOWNLOAD(download) -.- AVDOWR{{스키마 레지스트리에 등록된 Avro 파일들을 다운로드}}

KAFKA --> KAFKA_CONF(configure) -.- KTCONFR{{카프카 접속 설정}}
KAFKA --> KAFKA_TOPIC(topic)
KAFKA_TOPIC --> KAFKA_TOPIC_CREATE(create) -.- |name|KTCR{{Topic 생성}}
KAFKA_TOPIC --> KAFKA_TOPIC_DELETE(delete) -.- |name|KTDR{{Topic 삭제}}
KAFKA_TOPIC --> KAFKA_TOPIC_LIST(list) -.- KTLR{{등록된 Topic 목록 조회}}
```

기본 앱을 생성하는 방법

```sh
$ mkdir test-api
$ cd test-api
$ mmm app

::Mommos Application 생성::
? 애플리케이션명(디렉토리명):  sample-test-api
? 사용하고자 하는 네임스페이스(패키지)명을 알려주세요. kr.co.monolith.park
...
애플리케이션 소스가 생성되었습니다.
```

스키마 레지스트리 정보 등록

```sh
$ mmm configure

::CLI 설정 파일 생성::
? Schema Registry 정보를 설정하시겠습니까? Yes
? Schema Registry URL을 입력하세요. http://localhost:8081
? Schema Registry API Key를 입력하세요. [hidden]
? Schema Registry API Secret을 입력하세요. [hidden]
```

Topic 및 EventDispatcher 생성
- [x] EventDispatcher 파일 생성
- [ ] Kafka에 Topic 생성

```sh
$ mmm event

::Topic 생성::
? Topic 파일을 생성하시겠습니까? Yes
? Topic 명을 입력하세요. test
? Event Dispacher를 생성하시겠습니까? Yes
? Event Dispacher 클래스명을 입력하세요. TestEventDispacher
::Event Mapping 생성::
? Event Mapping 파일을 생성하시겠습니까? Yes
? Topic 명을 입력하세요. test
? 수신하려는 이벤트명을 입력하세요.
? 발행하려는 이벤트명을 입력하세요.
? Event Dispacher 클래스명을 입력하세요. TestEventHandler
this.answers {
  topicName: 'test',
  cunsumeEventName: '',
  produceEventName: '',
  eventHandlerName: 'TestEventHandler'
}
   create src/main/java/kr/co/monolith/park/kafka/TestEventDispacher.java
   create src/main/java/kr/co/monolith/park/event/TestEventHandler.java
   create src/test/java/kr/co/monolith/park/event/TestEventHandlerTest.java
```

Avro 파일 생성 명령어 예시

```sh
$ mmm avro

::Avro 파일 생성::
? 사용하고자 하는 네임스페이스(패키지)명을 알려주세요. kr.co.monolith.park.avro
? Avro의 유형을 선택하세요. Command
? Avro를 사용할 이벤트명을 입력하세요. Event와 Avro는 생략합니다.(예시: 'CreateTeam', 'create team', 'create-team') createSample
? 필드를 추가하시겠습니까? Yes
? 추가할 필드의 이름을 알려주세요. myField
? 추가할 필드의 데이터 타입을 선택하세요. string: 문자열 값을 나타냅니다
? null 값을 허용하시겠습니까? Yes
? 기본 값이 있다면 입력하세요. sample
? 필드를 추가하시겠습니까? No
? 방금 추가한 Avro를 참조하는 Topic Value Avro를 추가하시겠습니까? Yes
 conflict src/main/avro/schema-CreateSampleEventCommandAvro-v1.avsc
? Overwrite src/main/avro/schema-CreateMyEventEventCommandAvro-v1.avsc? overwrite
    force src/main/avro/schema-CreateSampleEventCommandAvro-v1.avsc
identical src/main/avro/schema-create_sample-value-v1.avsc
Avro 파일이 생성되었습니다.
? 생성된 Avro 파일의 내용을 출력할까요? Yes
```

Avro 스키마 등록 명령어 예시

```sh
$ mmm avro reg ./src/main/avro/schema-CreateSampleEventCommandAvro-v1.avsc

::Schema Registry 등록::
{
  "fields": [
    {
      "name": "myField",
      "type": [
        "string",
        "null"
      ]
    }
  ],
  "name": "CreateSampleEventCommandAvro",
  "namespace": "kr.co.monolith.park.avro",
  "type": "record"
}
? Schema Registry URL:https://psrc-7q7vj.ap-southeast-2.aws.confluent.cloud
Avro 파일을 위 Schema Registry에 등록하시겠습니까? Yes
result { id: 100511 }
```

Avro 파일 다운로드 명령어 예시

```sh
$ mmm avro download

::Avro 파일 다운로드::
? 다운로드할 Avro 파일들을 선택하세요.
선택한 Avro가 참조하는 Avro가 있다면 함께 다운로드됩니다.
 (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
 ◯ AddProductAvro
 ◯ CompleteMemberJoinAvro
 ◯ CreateGuildCommandAvro
❯◉ CreateMemberAvro
 ◯ CreateMemberCompletedAvro
 ◯ CreateOrderAvro
 ◯ CreateProductAvro
 ◯ CreateProductAvroByPSUs
 ◯ CreateSampleEventCommandAvro
 ◯ CreateTeamEventCommandAvro
 ◯ DeleteRoleAvro
...

 CreateOrderAvro
   create src/main/avro/schema-CreateMemberAvro-v2.avsc
```

Kafka 정보 설정

```sh
$ mmm kafka configure

::Kafka 설정 파일 생성::
? Kafka 접속 정보를 설정하시겠습니까? Yes
? Kafka Broker의 URL을 입력하세요. localhost:9092
? Kafka Cluster Id를 입력하세요. XR6H6GPdRFiW7kQQk9VxSQ
? SASL 인증 [username]을 입력하세요. [hidden]
? SASL 인증 [password]를 입력하세요. [hidden]
```

Kafka Topic 목록 조회

```sh
$ mmm kafka topic list

[
  '_confluent-monitoring',
  '_confluent-ksql-default__command_topic',
  '__consumer_offsets',
  ...
  'my-topic',
]
```

Kafka Topic 생성

- 파티션은 1개로 고정되어 있습니다.

```sh
$ mmm kafka topic create my-topic

Topic [my-topic] created successfully.
```

Kafka Topic 생성

```sh
$ mmm kafka topic delete my-topic

Topic [my-topic] deleted successfully.
```