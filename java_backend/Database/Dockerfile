FROM mariadb:11.8.1-ubi9-rc
COPY daamdb.sql /docker-entrypoint-initdb.d
ENV MYSQL_ROOT_PASSWORD=secret123
ENV MYSQL_DATABASE=daamdb