FROM eclipse-temurin:17-jdk-alpine
COPY target/*.jar app.jar
ADD expert_ontology/ expert_ontology/
EXPOSE 8082
ENTRYPOINT ["java","-jar","/app.jar"]