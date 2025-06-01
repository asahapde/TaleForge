# 📚 TaleForge

🚀 **Check out the app:** [Frontend (Vercel)](https://tale-forge.vercel.app/) &nbsp;|&nbsp; [Backend API (Fly.io)](https://your-fly-backend-url.fly.dev/)

TaleForge is a modern web application for writers and readers to share and discover stories. Built with Spring Boot and React, it provides a seamless experience for creating, reading, and engaging with stories.

## Features

- **User Authentication**: Secure login and registration system
- **Story Management**: Create, edit, and delete stories
- **Reading Experience**: Clean and intuitive interface for reading stories
- **Categories**: Organize stories with tags and categories
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Backend

- Spring Boot 3.2.3
- Spring Security with JWT
- PostgreSQL
- Fly.io for hosting
- Docker

### Frontend

- React 18
- TypeScript
- Tailwind CSS
- Vercel for hosting
- Docker

### Database

- Supabase (PostgreSQL)

## Hosting

The application is hosted on multiple platforms:

- Frontend: [Vercel](https://tale-forge.vercel.app/)
- Backend: Fly.io
- Database: Supabase

## Getting Started

### Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL
- Maven
- npm or yarn
- Docker and Docker Compose

### Using Docker (Recommended)

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/taleforge.git
   cd taleforge
   ```

2. Start the application using Docker Compose:

   ```bash
   docker-compose up -d
   ```

3. The application will be available at:

   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080

4. To stop the application:
   ```bash
   docker-compose down
   ```

### Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   mvn install
   ```
3. Configure the database in `application.properties`
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Docker Configuration

### Backend Dockerfile

```dockerfile
# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create a non-root user
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy the built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Environment variables will be provided by fly.io
ENV JAVA_OPTS="-Xmx512m -Xms256m -Djava.security.egd=file:/dev/./urandom -Dserver.address=0.0.0.0"

# Expose the port your application runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

### Frontend Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
version: "3.8"

services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - DB_URL=jdbc:postgresql://db:5432/taleforge
      - DB_USERNAME=postgres
      - DB_PASSWORD=postgres
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=taleforge
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Environment Variables

### Backend

- `DB_URL`: Database connection URL
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRATION`: JWT token expiration time
- `SERVER_PORT`: Port for the backend server (default: 8080)
- `SERVER_CONTEXT_PATH`: Base path for all endpoints (default: /api)
- `ADMIN_USERNAME`: Username for admin user
- `ADMIN_PASSWORD`: Password for admin user

### Frontend

- `NEXT_PUBLIC_API_URL`: Backend API URL

## Database Schema

### Table Relationships

#### Users

- One-to-Many with Stories (A user can write multiple stories)
- One-to-Many with Comments (A user can make multiple comments)
- One-to-Many with Likes (A user can like multiple stories)

#### Stories

- Many-to-One with Users (Each story belongs to one author)
- One-to-Many with Comments (A story can have multiple comments)
- One-to-Many with Likes (A story can have multiple likes)
- Many-to-Many with Categories (A story can have multiple categories)

#### Comments

- Many-to-One with Users (Each comment belongs to one user)
- Many-to-One with Stories (Each comment belongs to one story)

#### Likes

- Many-to-One with Users (Each like belongs to one user)
- Many-to-One with Stories (Each like belongs to one story)

#### Categories

- Many-to-Many with Stories (A category can have multiple stories)

### Key Constraints

- Users must have unique email addresses
- Stories must have a title and content
- Comments must have content
- Each user can only like a story once
- Categories must have unique names

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏗️ Project Structure

```
taleforge/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/taleforge/
│   │   │   │       ├── config/      # Configuration classes
│   │   │   │       ├── controller/  # REST controllers
│   │   │   │       ├── domain/      # Entity classes
│   │   │   │       ├── repository/  # Data repositories
│   │   │   │       ├── service/     # Business logic
│   │   │   │       └── security/    # Security configuration
│   │   │   │       └── resources/
│   │   └── test/
│   └── pom.xml
│
└── frontend/                # Next.js frontend
    ├── src/
    │   ├── app/            # Next.js app directory
    │   ├── components/     # React components
    │   ├── contexts/       # React contexts
    │   └── config/         # Configuration files
    ├── public/             # Static files
    └── package.json
```

## 🔧 API Documentation

The API documentation is available at `/api/docs` when running the backend server.

### Key Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/stories` - Get all stories
- `POST /api/stories` - Create a new story
- `GET /api/stories/{id}` - Get story by ID
- `PUT /api/stories/{id}` - Update story
- `DELETE /api/stories/{id}` - Delete story

## 🛠️ Technologies Used

### Frontend

- Next.js 14
- React
- Tailwind CSS
- Axios
- React Context API

### Backend

- Spring Boot 3
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT Authentication

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Abdullah Sahapdeen - Initial work - [YourGitHub](https://github.com/asahapde)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape TaleForge
- Inspired by platforms like Wattpad and Medium
- Built with ❤️ for the writing community
