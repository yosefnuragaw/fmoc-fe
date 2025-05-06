# ------------------- STAGE 1: Build Aplikasi Spring Boot -------------------
FROM gradle:8.6-jdk21 AS build
WORKDIR /app

# Copy Gradle wrapper dan file build
COPY gradle gradle
COPY build.gradle settings.gradle gradlew ./
COPY src src

# Izinkan gradlew dieksekusi
RUN chmod +x gradlew

RUN ./gradlew bootJar


# ------------------- STAGE 2: Base + NGINX + Jalankan Aplikasi -------------------
FROM eclipse-temurin:21-jre
WORKDIR /app

# Install NGINX
USER root
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Salin JAR dari Stage 1
COPY --from=build /app/build/libs/*.jar app.jar

# Buat file konfigurasi NGINX (default.conf) langsung di Dockerfile
RUN echo "server {\n\
    listen 80;\n\
    server_name _;\n\
    location / {\n\
        proxy_pass http://127.0.0.1:8080/;\n\
        proxy_http_version 1.1;\n\
        proxy_set_header Host \$host;\n\
        proxy_set_header X-Real-IP \$remote_addr;\n\
    }\n\
}\n" > /etc/nginx/sites-available/default

# Buat script run.sh langsung di Dockerfile untuk jalankan Spring Boot + NGINX
RUN echo "#!/bin/bash\n\
java -jar /app/app.jar &\n\
exec nginx -g 'daemon off;'\n" > /run.sh && chmod +x /run.sh

# Expose port 80
EXPOSE 80
# EXPOSE 8080

ENTRYPOINT ["/run.sh"]

