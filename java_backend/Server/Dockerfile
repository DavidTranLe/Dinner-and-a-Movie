FROM ubuntu:latest
LABEL authors="david.le"

ENTRYPOINT ["top", "-b"]

FROM eclipse-temurin:21-jdk-jammy

# Set the working directory inside the container
WORKDIR /app

# Copy the executable JAR file from your build output to the container
COPY build/libs/*.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# Define the command to run the application when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]
