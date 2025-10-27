# Vibe 🎵

**An AI-Powered Code Generation Platform**

Build apps and websites by vibing with AI. Vibe is a powerful Next.js application that leverages AI agents to generate full-stack applications in a sandboxed environment.

## ✨ Features

- **AI-Powered Code Generation**: Generate complete applications using natural language prompts
- **Real-time Preview**: See your generated apps live in an embedded sandbox
- **Multi-Agent System**: Sophisticated AI agents handle different aspects of code generation
- **Template Library**: Pre-built templates for common applications (Netflix clone, Admin dashboard, Kanban board, etc.)
- **Credit-Based Usage**: Flexible pricing with free and pro tiers
- **Project Management**: Save, organize, and iterate on your generated projects
- **Code Export**: View and copy generated code
- **Dark/Light Mode**: Full theme support

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.3.4** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/UI 2.7.0** - Component library
- **Lucide React** - Icons
- **next-themes** - Theme management

### Backend & Database

- **tRPC** - Type-safe APIs
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Zod** - Schema validation

### AI & Code Generation

- **Inngest** - Background job processing
- **OpenAI GPT-4.1** - Primary AI model
- **Google Gemini** - Secondary AI model
- **@inngest/agent-kit** - Multi-agent orchestration
- **E2B Code Interpreter** - Sandboxed code execution

### Authentication & Payments

- **Clerk** - Authentication
- **Clerk Billing** - Payment processing

### Development & Deployment

- **Docker** - Containerization
- **E2B Sandboxes** - Isolated execution environments
- **Vercel** Deployment platform

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker
- PostgreSQL database

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd vibe
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up the database**

```bash
# Start PostgreSQL with Docker
docker run -d --name postgres-db -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=12345678 -p 5432:5432 postgres

# Set up Prisma
npx prisma generate
npx prisma db push
```

4. **Environment Variables**
   Create a `.env.local` file with:

```env
# Database
DATABASE_URL="postgresql://admin:12345678@localhost:5432/vibe"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key

# E2B
E2B_API_KEY=your_e2b_api_key

# Other required environment variables...
```

5. **Run the development server**

For Inngets dev server

```bash
npx inngest-cli@latest dev
```

For Project

```bash
npm run dev
```

6. **Start Inngest dev server** (in a separate terminal)

```bash
npx inngest-cli@latest dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
│   └── ui/                # Shadcn/UI components
├── constants/             # Application constants and prompts
├── generated/             # Prisma generated types
├── inngest/               # Background job functions
├── lib/                   # Utility functions
├── modules/               # Feature-based modules
│   ├── home/             # Homepage components
│   ├── messages/         # Message handling
│   └── projects/         # Project management
├── sandbox/              # Sandbox templates and configurations
└── trpc/                 # tRPC setup and procedures
```

## 🎯 Key Features Explained

### AI Code Generation

The platform uses a sophisticated multi-agent system:

- **Code Agent**: Generates application code using GPT-4
- **Response Agent**: Creates user-friendly summaries
- **Title Agent**: Generates descriptive titles for code fragments

### Sandbox Environment

- Isolated Next.js 15.3.4 environments
- Pre-installed Shadcn/UI components
- Configurable timeouts (5 min free, 10 min pro)
- Real-time code execution and preview

### Project Templates

Pre-built templates include:

- Netflix clone
- Admin dashboard
- Kanban board
- File manager
- YouTube clone
- E-commerce store
- Airbnb clone
- Spotify clone

## 🔧 Development

### Key Commands

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npx prisma studio   # Open Prisma Studio
npx prisma generate # Generate Prisma client
```

### Database Schema

The application uses Prisma with PostgreSQL. Key entities:

- **User**: User accounts and authentication
- **Project**: Generated projects
- **Message**: Chat messages and prompts
- **Fragment**: Generated code fragments

## 🔐 Environment Setup

Ensure you have accounts and API keys for:

- [Clerk](https://clerk.dev) - Authentication
- [OpenAI](https://openai.com) - AI models
- [E2B](https://e2b.dev) - Code sandboxes
- [Inngest](https://inngest.com) - Background jobs
