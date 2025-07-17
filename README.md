# Sapient Slingshot AI Platform

A React-based agentic UI for Publicis Sapient with Slingshot AI integration, featuring chat capabilities, authentication, and project management.

## 🚀 Quick Start

### Windows Setup (Recommended)

1. **Prerequisites**
   - Node.js 18+ (download from https://nodejs.org/)
   - PostgreSQL 12+ (or use cloud database)
   - Git
   - VS Code (recommended)

2. **Installation**
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd PS_Project_V1.0
   
   # Run setup script
   setup.bat
   ```

3. **Configuration**
   - Edit `.env` file with your database credentials
   - Set up PostgreSQL database (local or cloud)

4. **Start Development Server**
   ```bash
   # Windows
   dev.bat
   
   # OR cross-platform
   npm run dev
   ```

### Cross-Platform Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   ```bash
   # Create database and push schema
   npm run db:push
   ```

3. **Start Development**
   ```bash
   # Development server
   npm run dev
   
   # OR start components separately
   npm run server    # Backend only
   npm run client    # Frontend only
   ```

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query
- **Routing**: Wouter
- **Build**: Vite

### Backend (Node.js + Express)
- **Framework**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect)
- **WebSocket**: Real-time chat support

### Key Features
- ✅ Publicis Sapient branding (red/black theme)
- ✅ Authentication with Replit OAuth
- ✅ Project management dashboard
- ✅ Real-time AI chat assistant
- ✅ WebSocket integration
- ✅ Database-backed sessions
- ✅ Responsive design

## 📂 Project Structure

```
PS_Project_V1.0/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── chat/       # Chat interface
│   │   │   ├── dashboard/  # Dashboard components
│   │   │   └── layout/     # Layout components
│   │   ├── pages/          # Page components
│   │   │   ├── landing.tsx # Landing page
│   │   │   ├── dashboard.tsx
│   │   │   └── chat.tsx
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utilities
├── server/                 # Express backend
│   ├── routes.ts           # API routes
│   ├── db.ts              # Database config
│   ├── storage.ts         # Data layer
│   └── replitAuth.ts      # Authentication
├── shared/                 # Shared types
│   └── schema.ts          # Database schema
├── .env.example           # Environment template
├── dev.bat               # Windows dev script
└── setup.bat            # Windows setup script
```

## 🗄️ Database Schema

### Core Tables
- **users**: User profiles and authentication
- **projects**: Development projects
- **messages**: Chat messages
- **ai_agents**: AI agent configurations
- **sessions**: Session storage

### Relations
- Users → Projects (one-to-many)
- Users → Messages (one-to-many)
- Projects → AI Agents (one-to-many)
- Projects → Messages (one-to-many)

## 🔧 Development Commands

### Windows
```bash
setup.bat          # Initial setup
dev.bat            # Start development server
```

### Cross-Platform
```bash
npm run dev        # Start full development server
npm run server     # Backend only
npm run client     # Frontend only
npm run db:push    # Push database schema
npm run build      # Production build
npm run start      # Production server
```

## 🎨 Design System

### Brand Colors
- **Primary Red**: `#E31837` (PS Red)
- **Black**: `#1A1A1A` (PS Black)
- **Gray**: `#F8F9FA` (PS Gray)
- **Accent**: `#6B7280` (PS Accent)

### Typography
- **Primary Font**: System font stack
- **Headings**: Bold, PS Black
- **Body**: Regular, PS Accent

## 🔐 Environment Variables

Create a `.env` file with:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=your_database

# Authentication
SESSION_SECRET=your-secret-key
REPLIT_DOMAINS=localhost:5000
REPL_ID=your-repl-id

# Development
NODE_ENV=development
PORT=5000
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure production database
- Set secure `SESSION_SECRET`
- Configure `REPLIT_DOMAINS`

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify `.env` database credentials
   - Run `npm run db:push`

2. **Authentication Issues**
   - Verify `REPLIT_DOMAINS` settings
   - Check `SESSION_SECRET` is set
   - Ensure database sessions table exists

3. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run check`

### Development Tips
- Use VS Code with TypeScript and Tailwind extensions
- Enable auto-format on save
- Use the integrated terminal for commands
- Monitor console logs for errors

## 📋 Features

### Current Features
- [x] User authentication (Replit OAuth)
- [x] Project dashboard
- [x] Real-time chat
- [x] AI agent status monitoring
- [x] WebSocket integration
- [x] Responsive design
- [x] Database persistence

### Slingshot AI Integration Points
- [x] Code generation API endpoints
- [x] Legacy modernization placeholders
- [x] Chat assistant interface
- [x] Project management integration
- [ ] Full AI model integration (requires API keys)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
>>>>>>> 2440051 (Improve Windows development and setup process for the application)
