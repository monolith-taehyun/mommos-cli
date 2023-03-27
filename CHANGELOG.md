## v0.5.0 (2023-03-27)

### Feat

- **kafka**: kafka 명령어 추가
- **app**: app 명령어 파라미터 추가
- 명령어 별로 파일 분리

### Fix

- **avro**: null 참조 버그 수정
- **avro**: mmmrc 파일이 없는 경우에도 참조하는 버그 수정, 스타일 변경
- **configure**: null 참조 버그 수정

## v0.4.0 (2023-03-23)

### Feat

- **topic**: Topic 명령어 및 생성기 추가

### Fix

- **avro**: 유효하지 않은 property 참조 버그 수정

### Refactor

- 불필요한 로그 제거 및 스타일 포매팅

## v0.3.0 (2023-03-22)

### Feat

- **avro**: avro 명령어 사용 시 설정파일 사용
- **app**: app 명령어 실행 시 설정파일 추가
- **utils**: json 파일의 내용을 추가해 파일을 덮어쓰는 유틸 함수 추가

### Refactor

- **configure**: configure 명령어 사용 시 기존 설정 파일이 있는 경우 내용을 업데이트한다

## v0.2.0 (2023-03-22)

### Feat

- **app**: app 명령어 사용 시 패키지 적용

### Fix

- **릴리즈-스크립트-수정**: 토큰 정보 수정

## v0.1.1 (2023-03-21)

### Fix

- **actions**: Bump 버전 수정

## v0.1.0 (2023-03-21)

### Feat

- **avro**: Avro 를 Schema Registry 등록 시 발생할 수 있는 에러 try-catch
- **avro**: Avro 파일의 Schema Registry 등록
- **configure**: CLI 설정 명령어 추가
- **avro**: Avro 파일 생성 명령어 추가
- **docs**: 기본 앱 생성 방법 설명 추가
- **docs**: 프로젝트 설명 문서 추가
- **build**: 설정파일 추가
- **app**: 앱 생성기 수정
