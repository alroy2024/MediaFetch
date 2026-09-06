# Stage 1: Build JAR
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime using official Playwright image
FROM mcr.microsoft.com/playwright/java:v1.49.0-noble
WORKDIR /app

# Copy the fat jar from stage 1
COPY --from=build /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Xmx180m", "-Xss256k", "-XX:+UseSerialGC", "-jar", "app.jar"]