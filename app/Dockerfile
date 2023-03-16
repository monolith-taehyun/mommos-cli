FROM openjdk:11-jre-slim
ENV TZ=Asia/Seoul
COPY build/libs/*.jar app.jar
ENTRYPOINT ["java","-Duser.timezone=Asia/Seoul","-jar","/app.jar"]