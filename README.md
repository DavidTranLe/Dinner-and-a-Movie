# Fork and Film: Full-Stack Restaurant Ordering System

This project is a complete full-stack web application that simulates a restaurant ordering system. It features a modern React frontend, a robust Java Spring Boot backend, and a MariaDB database, all containerized with Docker for easy setup and deployment.

## Technology Stack

* **Frontend:** React (Next.js) with TypeScript & Tailwind CSS
* **Backend:** Java 21 with Spring Boot 3
* **Database:** MariaDB
* **API Documentation:** SpringDoc OpenAPI (Swagger UI)
* **Containerization:** Docker & Docker Compose
* **Build Tool:** Gradle

## Prerequisites

Before you begin, ensure you have the following installed on your system:

* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

## Getting Started

This project is designed to be run with a single command. The `docker-compose.yaml` file will build the necessary images and start all the services in the correct order.

### 1. Clone the Repository

If you haven't already, clone this project to your local machine.

### 2. Build and Run the Application

Navigate to the root directory of the project (where the `docker-compose.yaml` file is located) and run the following command in your terminal:

```bash
docker-compose up --build