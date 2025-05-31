# Tale Forge - Interactive Story Platform

An innovative platform for creating and experiencing interactive stories with branching narratives.

## Project Structure

```
tale-forge/
├── frontend/          # Next.js frontend application
└── backend/           # Spring Boot backend application
```

## Features

### Writer Side

- Create stories with branching paths
- Add text, media, and tags per node
- Approve/reject viewer-submitted branches
- View analytics and engagement metrics

### Viewer Side

- Interactive story navigation
- Branch voting system
- Submit alternate story paths
- Comment and rating system

## Tech Stack

### Frontend

- Next.js (App Router)
- Tailwind CSS
- Radix UI
- React Flow
- NextAuth.js

### Backend

- Spring Boot 3.x
- PostgreSQL
- Redis
- WebSocket
- JWT Authentication

## Getting Started

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
./mvnw spring-boot:run
```

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

MIT License
