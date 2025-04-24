# Dinner and a Movie Java Style

This is the Dinner and a Movie with a real database for working with Java JPA and Spring Boot.

This application can be run in both secure (JWT) and non-secure mode.

The application comes with SWAGGER to view the API calls.

## Using SWAGGER to view API

Change **security.enabled** in the **application.properties** file to **false** to use SWAGGER.

The SWAGGER URLs;

1. http://localhost:8080/api-docs
    This is a YAML dump of the API

2. http://localhost:8180/swagger-ui/index.html
    This is the SWAGGER web UI where you can trial the API and see the different calls.

## Running this project

To spin up the application you can run the whole system through the docker-compose.yml file at the top of the project as follows;

```
docker compose up -d
```

Older versions of docker compose;

```
docker-compose up -d
```

Alternatively you might decide to compile the project yourself.

## Running as a Java application

To run as a Java application each component can be built as a Maven project, except the database that you would have to launch as a Docker container, or start your own MariaDB or MySQL database.

The steps and order to start the application if running as Java components are;

### 1. Create or start a MySQL/MariaDB database

#### Manually

* Install and start your MySQL or MariaDB database system.
  * Set the **root** password to **secret123**
    * If you already have a root password, then you can use the **DB_PASSWORD** environment variable to change it for the application.
      * **NOTE:** You will need to do this for both the auth and server.
* Create the database called **daamdb**
  ```
  create database daamdb
  ```

**NOTE:** The database schema is created by the applications, through JPA.

### 2. Launching the Authentication server

To launch the authentication server you will need the JAR file.

#### Source

If you have the source code then you can compile the authentication server as follows;
  ```
  cd auth-server-mysql
  ./mvnw clean package -D-Dmaven.test.skip=true
  ```

#### Just the jar file

The application has the ability to override settings through environment variables.  The defaults are as follows;
```
export SERVER_PORT=9000
export DB_HOST=localhost
DB_PORT=3306
DB_NAME=daamdb
DB_USER=root
DB_PASSWORD=secret123
```

You can also supply your own application.properties file and change the values.  The default is;
```
server.port=${SERVER_PORT:9000}
rsa.private-key=classpath:keys/private.pem
rsa.public-key=classpath:keys/public.pem

# Database
spring.datasource.url=jdbc:mariadb://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:daamdb}
spring.datasource.username=${DB_USER:root}
spring.datasource.password=${DB_PASSWORD:secret123}
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
spring.jpa.properties.hibernate.show_sql=true
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.generate-ddl=true
spring.jpa.defer-datasource-initialization=true
# Modify these lines from create to update and never after DB is created
spring.jpa.hibernate.ddl-auto=update
spring.sql.init.mode=always
# Enable initialisation always and continue if error, dangerous unless you know - never for production
spring.sql.init.continue-on-error=true
```

Launching the authentication server;
```
java -jar daam-auth-0.0.1-SNAPSHOT.jar
```

If you compiled from source;
```
java -jar target/daam-auth-0.0.1-SNAPSHOT.jar
```

### 3. Launching the resource server

To launch the resource server you will need the JAR file.

#### Source

If you have the source code then you can compile the authentication server as follows;
  ```
  cd daam-server
  ./mvnw clean package -D-Dmaven.test.skip=true
  ```

#### Just the jar file

The application has the ability to override settings through environment variables.  The defaults are as follows;
```
export DB_HOST=localhost
export DB_PORT=3336
# export DB_USER=root
# export DB_PASSWORD=secret123
# export DB_NAME=daamdb
export SERVER_PORT=8180
# export DEBUG_LEVEL=INFO
export DAAM_SEC=false
# export DB_DDL=update
# export DB_INIT=always
# export DB_ON_ERR=true
# export SEC_DEBUG=DEBUG
```

**NOTE:** **DAAM_SEC** needs to be false if you wish to view the /swagger-ui/index.html documentation for the API.

You can also supply your own application.properties file and change the values.  The default is;
```
server.port=${SERVER_PORT:8080}
rsa.public-key=classpath:keys/public.pem
logging.level.com=${DEBUG_LEVEL:DEBUG}
# Disable security to use SWAGGER
security.enabled=${DAAM_SEC:true}

# Database
spring.datasource.url=jdbc:mariadb://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:daamdb}
spring.datasource.username=${DB_USER:root}
spring.datasource.password=${DB_PASSWORD:secret123}
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.generate-ddl=true
spring.jpa.defer-datasource-initialization=true

# The next line will add or update the database to include the new entities for the tables
spring.jpa.hibernate.ddl-auto=${DB_DDL:update}
# Uncomment the following line to enable SQL initialization to populate the tables with the data.sql
spring.sql.init.mode=${DB_INIT:always}
# Enable initialisation always and continue if error, dangerous unless you know - never for production
spring.sql.init.continue-on-error=${DB_ON_ERR:true}

# DEBUGGING
spring.jpa.properties.hibernate.show_sql=true
logging.level.org.springframework.security=${SEC_DEBUG:DEBUG}
# logging.level.org.hibernate.SQL=DEBUG

# SWAGGER API Documentation
springdoc.api-docs.path=/api-docs
```

Launching the authentication server;
```
java -jar daamsrv-0.0.1-SNAPSHOT.jar
```

If you compiled from source;
```
java -jar target/daamsrv-0.0.1-SNAPSHOT.jar
```

## Using the Auth server

The auth server has only 1 purpose and that is to issue you a JSON Web Token (JWT).

```
http://localhost:9000/login
```

The request is a POST request and the users can be found in the **users** table of the database once the Auth service is launched.

2 Users for quick start:
- username: **admin**
  password: **pass**
- username: **me**
  password: **pass**

The **me** user does not have admin privileges.

## Using the resource server

The resource server can be used with or without authentication server.

The resource server comes with inbuilt API documentation provided by the SWAGGER-UI URL http://localhost:8080/swagger-ui/index.html.

**NOTE:** When using the **POST** methods you do not need to provide the **id:** in the JSON as the IDs are auto generated.

**NOTE:** The **items** API is linked to **orders**, but since the system was converted from a noSQL database, no referential integrity has been applied to the relational database, so you will need an Order ID to be able to insert **items** into the items table.  The **items** API takes an array of item objects.

### Using without authentication

Ensure that you set the environment variable **export DAAM_SEC=false** before running the jar file

### Using with authentication

Ensure that you set the environment variable **export DAAM_SEC=true** before running the jar file.

The default for the application is to run with authentication, so you can simply unset the DAAM_SEC environment variable.

**NOTE:** You cannot view the SWAGGER UI API documentation with security turned on.