# Holt-Eco Platform

## ⚙️ What is this project?

Holt-Eco is a modular, scalable ecosystem for cyber-security recon, bounty tracking, chat orchestration, and tool execution. Built as a monorepo with TypeScript, Node.js, NestJS, micro-services and Go modules, it aims to streamline security operations and developer workflows.

## 🧪 Status

Currently: **Gateway & Auth service scaffolds complete**
Planned: Recon, Bounty, Chat, Tool services (see roadmap).

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/mckoyd/holt-eco.git
cd holt-eco

# Install dependencies
pnpm install

# Start all services for development
pnpm dev:all
```

## 🛠️ Project Structure

```bash
holt-eco/
├── services/        # micro-services (gateway, auth, etc.)
├── packages/        # shared libraries (config, logger, types, queue)
├── apps/            # future frontend applications
├── tools/           # scripts, docker-compose configs
├── package.json
└── pnpm-workspace.yaml
```

## 🧮 Environment Variables

Create a .env file (or copy from .env.example) with:

```bash
NODE_ENV=development
JWT_SECRET=your-super-secret
DATABASE_URL=postgresql://user:password@localhost:5432/holt
REDIS_URL=redis://localhost:6379
```

## 🧑‍💻 Usage Example

    1.	Login to get JWT:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'
```

    2.	Use JWT to call protected endpoint:

```bash
curl http://localhost:3000/ping \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

    3.	Access public health endpoint:

```bash
curl http://localhost:3000/health
```
