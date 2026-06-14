# Etapa 1 - Build com Maven
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copia o pom e baixa dependências 
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia o código-fonte e compila
COPY src ./src
RUN mvn package -DskipTests -B

# Etapa 2 - Runtime com JRE mínimo
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Cria diretório para o banco SQLite
VOLUME /data

# Copia o JAR gerado na etapa de build
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
