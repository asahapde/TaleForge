# 📚 TaleForge

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

### Frontend

- React 18
- TypeScript
- Tailwind CSS
- Vercel for hosting

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

### Backend Setup

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

### Frontend Setup

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

## Environment Variables

### Backend

- `DB_URL`: Database connection URL
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRATION`: JWT token expiration time

### Frontend

- `VITE_API_URL`: Backend API URL
- `VITE_APP_NAME`: Application name

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
│   │   │   └── resources/
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
