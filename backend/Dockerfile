FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B -DskipTests package \
    && java -Djarmode=tools -jar target/taleforge.jar extract --destination /app

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app ./

# Class-data-sharing archive from a training run (against the bundled H2 so no database is needed at build
# time). It cuts JVM startup noticeably, which matters on small free-tier instances that sleep.
RUN java -XX:ArchiveClassesAtExit=app.jsa -Dspring.context.exit=onRefresh -Dspring.profiles.active=dev \
    -jar taleforge.jar > /dev/null

RUN addgroup -S spring && adduser -S spring -G spring
USER spring

ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75 -XX:+UseSerialGC -XX:TieredStopAtLevel=1 -Xss512k"
EXPOSE 8080
ENTRYPOINT ["java", "-XX:SharedArchiveFile=app.jsa", "-jar", "taleforge.jar"]
