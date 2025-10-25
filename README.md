# 🤖 ChatSeekAI

<div align="center">

![Python](https://img.shields.io/badge/Python-3.12+-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.119+-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19+-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

**A production-ready AI chat application with real-time streaming, powered by Ollama**

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

ChatSeekAI is a modern, full-stack AI chatbot application that brings the power of large language models to your fingertips. Built with cutting-edge technologies and following best practices, it provides a seamless chat experience with real-time AI responses, conversation management, and a beautiful user interface.

### ✨ Why ChatSeekAI?

- 🚀 **Production Ready** - Built with SOLID principles and clean architecture
- 🔐 **Secure** - JWT authentication with refresh tokens
- ⚡ **Real-time** - Streaming AI responses for instant feedback
- 🎨 **Modern UI** - Beautiful, responsive interface with Shadcn UI
- 🐳 **Easy Deploy** - Complete Docker setup with docker-compose
- 🔧 **Flexible** - Support for multiple Ollama models
- 📱 **Responsive** - Works seamlessly on desktop and mobile

---

## 🎯 Features

### Core Features

- **🔐 Authentication & Authorization**
  - JWT-based authentication with access & refresh tokens
  - Secure password hashing with bcrypt
  - User registration and login
  - Protected routes and API endpoints

- **💬 Chat Management**
  - Create unlimited conversations
  - Persistent chat history
  - Edit and delete conversations
  - Real-time chat updates
  - Conversation context maintained

- **🤖 AI Integration**
  - Powered by Ollama for local LLM inference
  - Real-time streaming responses
  - Support for multiple models (llama2, codellama, mistral, etc.)
  - Custom system prompts
  - Conversation context awareness

- **📝 Rich Message Features**
  - Markdown rendering
  - Syntax highlighting for code blocks
  - Copy code functionality
  - Inline code formatting
  - Support for tables, lists, and more

- **🎨 Modern UI/UX**
  - Collapsible sidebar with icon-only mode
  - Dark/Light mode support
  - Responsive design for all devices
  - Smooth animations and transitions
  - Professional Shadcn UI components

### Technical Features

- **Backend Architecture**
  - Repository pattern for data access
  - Service layer for business logic
  - Dependency injection
  - Comprehensive error handling
  - Database migrations with Alembic
  - Type-safe with Pydantic

- **Frontend Architecture**
  - React Query for server state management
  - Custom hooks for all API interactions
  - TypeScript for type safety
  - Zustand for auth state
  - Optimistic updates for better UX
  - Automatic cache invalidation

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| **FastAPI** | Modern Python web framework |
| **SQLModel** | SQL database ORM with type hints |
| **PostgreSQL** | Relational database |
| **Alembic** | Database migrations |
| **Pydantic** | Data validation |
| **JWT** | Authentication tokens |
| **Ollama** | Local LLM inference |

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **React Query** | Server state management |
| **Zustand** | Client state management |
| **Axios** | HTTP client |
| **Shadcn UI** | UI component library |
| **Tailwind CSS** | Utility-first CSS |
| **React Markdown** | Markdown rendering |
| **Highlight.js** | Code syntax highlighting |

### DevOps

- **Docker** & **Docker Compose** - Containerization
- **GitHub Actions** - CI/CD (optional)
- **Nginx** - Reverse proxy (production)

---

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**

```bash
git clone https://github.com/mdfarhankc/ChatSeekAI.git
cd ChatSeekAI
```

2. **Pull Ollama model**

```bash
# Start Ollama service
docker-compose up ollama -d

# Pull llama3 model (this may take several minutes)
docker exec -it chatseek_ollama ollama pull llama3

```

3. **Start all services**

```bash
docker-compose up -d
```

4. **Access the application**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

5. **Create your account**

- Open http://localhost:5173
- Click "Sign up"
- Fill in your details
- Login and start chatting!

### Option 2: Local Development Setup

#### Backend

```bash
cd backend

# Install dependencies
uv sync

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run migrations
alembic upgrade head

# Start the server
fastapi dev app/main.py
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

#### Ollama (Separate Terminal)

```bash
# Install Ollama from https://ollama.ai/

# Start Ollama
ollama serve

# Pull models
ollama pull llama3
```

---

## 📁 Project Structure

```
ChatSeekAI/
├── backend/
│   ├── app/
│   │   ├── core/                # Project Config, Database, setup  
│   │   ├── models/              # Database models (SQLModel)
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── repositories/        # Data access layer
│   │   ├── services/            # Business logic layer
│   │   ├── api/v1/              # API routes
│   │   ├── utils/               # Utility functions
│   │   └── main.py              # FastAPI app
│   ├── alembic/                 # Database migrations
│   ├── tests/                   # Backend tests
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/           # Chat components
│   │   │   ├── layout/         # Layout components
│   │   │   └── ui/             # Shadcn UI components
│   │   ├── hooks/              # Custom React Query hooks
│   │   ├── services/           # API services
│   │   ├── store/              # Zustand stores
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
├── .gitignore
├── LICENSE
└── README.md
```

---

## 📚 Documentation

### API Endpoints

#### Authentication

```
POST   /api/v1/auth/register     - Register new user
POST   /api/v1/auth/login        - Login user
POST   /api/v1/auth/refresh      - Refresh access token
```

#### Users

```
GET    /api/v1/users/me          - Get current user info
```

#### Chats

```
POST   /api/v1/chats             - Create new chat
GET    /api/v1/chats             - List user's chats
GET    /api/v1/chats/{id}        - Get specific chat
PUT    /api/v1/chats/{id}        - Update chat
DELETE /api/v1/chats/{id}        - Delete chat
```

#### Messages

```
GET    /api/v1/messages/chat/{id}    - Get chat messages
POST   /api/v1/messages/stream       - Stream AI response (SSE)
```

### Custom Hooks (Frontend)

#### Authentication Hooks
```typescript
useLogin()       // Login with credentials
useRegister()    // Register new user
useCurrentUser() // Get current user
useLogout()      // Logout user
```

#### Chat Hooks
```typescript
useChats()         // Get paginated chat list
useChat(id)        // Get single chat
useCreateChat()    // Create new chat
useUpdateChat()    // Update chat
useDeleteChat()    // Delete chat
```

#### Message Hooks
```typescript
useChatMessages(chatId)  // Get chat messages
useStreamMessage()       // Stream AI responses
```

### Environment Variables

#### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Ollama
OLLAMA_BASE_URL=http://localhost:11434
DEFAULT_MODEL=llama2

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=30

# CORS
CORS_ORIGINS=["http://localhost:5173"]
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000
```

---

## 🎨 Screenshots

### Chat Interface
*Beautiful, modern chat interface with real-time streaming*

### Sidebar
*Collapsible sidebar with all your conversations*

### Code Highlighting
*Syntax highlighted code blocks with copy functionality*

*(Add your actual screenshots here)*

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm run test
npm run lint
```

---

## 📦 Available Ollama Models

### Popular Models

- **llama2** - General purpose (7B, 13B, 70B)
- **codellama** - Code generation (7B, 13B, 34B, 70B)
- **mistral** - High performance (7B)
- **mixtral** - Mixture of experts (8x7B)
- **neural-chat** - Conversational AI
- **starling-lm** - RLAIF trained
- **orca-mini** - Small but capable

### Pull a Model

```bash
docker exec -it chatseek_ollama ollama pull <model-name>
```

### List Installed Models

```bash
docker exec -it chatseek_ollama ollama list
```

---

## 🔧 Configuration

### Change Default Model

Update `backend/app/config.py`:

```python
DEFAULT_MODEL: str = "codellama"  # Change to your preferred model
```

### Configure Chat Settings

In the chat creation, you can specify:
- Model name
- System prompt
- Temperature (coming soon)
- Max tokens (coming soon)

---

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Error**

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View logs
docker-compose logs postgres
```

**2. Ollama Not Responding**

```bash
# Check Ollama status
docker-compose ps ollama

# View logs
docker-compose logs ollama

# Restart Ollama
docker-compose restart ollama
```

**3. Frontend Build Errors**

```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**4. Port Already in Use**

```bash
# Change ports in docker-compose.yml
# Frontend: 5173 -> 3000
# Backend: 8000 -> 8080
# PostgreSQL: 5432 -> 5433
```

---

## 🚀 Deployment

### Production Deployment with Docker

1. **Update environment variables**

```bash
# Backend .env
SECRET_KEY=your-super-secret-production-key
DEBUG=False
DATABASE_URL=postgresql://user:password@production-db:5432/db
```

2. **Build production images**

```bash
docker-compose -f docker-compose.prod.yml build
```

3. **Start services**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Deploy to Cloud

- **AWS**: Use ECS or EC2 with docker-compose
- **DigitalOcean**: Deploy to App Platform or Droplets
- **Heroku**: Use containers for backend and frontend
- **Vercel**: Frontend only (separate backend deployment needed)
- **Railway**: Full-stack deployment with PostgreSQL

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Steps to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Mohammed Farhan KC**

- GitHub: [@mdfarhankc](https://github.com/mdfarhankc)
- LinkedIn: [Connect with me](https://linkedin.com/in/mdfarhankc)

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Amazing web framework
- [Ollama](https://ollama.ai/) - Local LLM platform
- [Shadcn UI](https://ui.shadcn.com/) - Beautiful UI components
- [Tanstack Query](https://tanstack.com/query) - Powerful data fetching
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

## 📧 Support

If you have any questions or need help, please:

- Open an [issue](https://github.com/mdfarhankc/ChatSeekAI/issues)
- Start a [discussion](https://github.com/mdfarhankc/ChatSeekAI/discussions)
- Reach out on social media

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=mdfarhankc/ChatSeekAI&type=Date)](https://star-history.com/#mdfarhankc/ChatSeekAI&Date)

---

<div align="center">

**Built with ❤️ using FastAPI, React, and Ollama**

</div>