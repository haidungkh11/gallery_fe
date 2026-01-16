# =========================
# STAGE 1: BUILD ANGULAR
# =========================
FROM node:20-alpine AS builder

# Set working directory ở root project
WORKDIR /app

# Copy package files trước để tận dụng cache
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Build production
RUN npm run build --prod
# Hoặc tương đương: ng build --configuration production

# =========================
# STAGE 2: NGINX
# =========================
FROM nginx:alpine

# Xóa config mặc định
RUN rm /etc/nginx/conf.d/default.conf

# Copy config Nginx tùy chỉnh
COPY nginx.conf /etc/nginx/nginx.conf

# Copy đúng output build từ stage 1
# Output nằm ở /app/dist/sakai-ng
COPY --from=builder /app/dist/sakai-ng/browser /usr/share/nginx/html

# Expose port
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
