# 📚 TaleForge

TaleForge is a modern, full-stack storytelling platform where writers can share their stories, connect with readers, and build their audience. Built with Next.js, Spring Boot, and a passion for storytelling.

![TaleForge Banner](https://tale-forge.vercel.app/banner.png)

## ✨ Features

### For Writers

- 📝 Create and publish stories with rich text formatting
- 🏷️ Add tags to categorize your stories
- 📊 Track story views and engagement
- 👥 Build your author profile with bio and display name
- 🔒 Save drafts and publish when ready
- 📱 Responsive design for writing on any device

### For Readers

- 📚 Discover stories by category and tags
- 🔍 Advanced search functionality
- ❤️ Like and save favorite stories
- 💬 Comment on stories and engage with authors
- 👤 Follow your favorite writers
- 📱 Read stories on any device

### Technical Features

- 🔐 Secure authentication with JWT
- 🌐 Cross-origin resource sharing (CORS) enabled
- 📱 Responsive design with Tailwind CSS
- 🔄 Real-time updates for likes and comments
- 📊 Pagination for better performance
- 🔍 Full-text search capabilities

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Java 17+
- Maven
- Docker (optional)

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/taleforge.git
cd taleforge
```

2. Navigate to the backend directory:

```bash
cd backend
```

3. Configure environment variables:
   Create a `.env` file in the backend directory with:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/taleforge
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=86400000
```

4. Run the backend:

```bash
./mvnw spring-boot:run
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

3. Configure environment variables:
   Create a `.env.local` file in the frontend directory with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

4. Run the development server:

```bash
npm run dev
```

### Docker Deployment

1. Build the backend Docker image:

```bash
cd backend
docker build -t taleforge-backend .
```

2. Run the backend container:

```bash
docker run -p 8080:8080 taleforge-backend
```

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

- Your Name - Initial work - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape TaleForge
- Inspired by platforms like Wattpad and Medium
- Built with ❤️ for the writing community
