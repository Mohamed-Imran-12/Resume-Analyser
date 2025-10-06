# ===== Build Stage =====
FROM maven:3.9.5-eclipse-temurin-21 AS build

WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# ===== Run Stage =====
FROM eclipse-temurin:21-jre AS runtime

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]