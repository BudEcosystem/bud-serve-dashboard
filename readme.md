```markdown
# 🚀 Next.js Application

This repository contains a [Next.js](https://nextjs.org/) application built and deployed using a multi-stage Dockerfile. It supports environment-based configuration and is suitable for deployment in production, development, Docker, and Kubernetes environments.

---

## 📁 Project Structure

- **Dockerfile** – Multi-stage build for optimized production deployment.
- **entrypoint.sh** – Entrypoint for running in containers.
- **package.json / yarn.lock** – Dependency manifest and lockfile.

---

## 🌐 Running the App

### 1. 🧪 Run on a Local/Remote Server (Production/Development)

#### ✅ Prerequisites

- [Node.js](https://nodejs.org/) v18+ (LTS recommended)
- [Yarn](https://yarnpkg.com/)

#### 🛠 Setup

```bash
# Install dependencies
yarn install

# Development mode
yarn dev

# Production build
yarn build
yarn start
```

#### 🔐 Environment Variables

Create a `.env.local` file at the root with the following variables:

```env
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_VERCEL_ENV=production
NEXT_PUBLIC_PASSWORD=your-password
NEXT_PUBLIC_PRIVATE_KEY=your-key
NEXT_PUBLIC_NOVU_SOCKET_URL=wss://socket.url
NEXT_PUBLIC_NOVU_BASE_URL=https://api.novu.url
NEXT_PUBLIC_NOVU_APP_ID=novu-app-id
NEXT_PUBLIC_TEMP_API_BASE_URL=https://temp.api.url
NEXT_PUBLIC_COPY_CODE_API_BASE_URL=https://copy.api.url
NEXT_PUBLIC_PLAYGROUND_URL=https://playground.url
```

---

### 2. 🐳 Run with Docker

#### ✅ Prerequisites

- [Docker](https://docs.docker.com/get-docker/)

#### 🛠 Build & Run

```bash
# Build the image
docker build -t nextjs-app .

# Run the container with environment variables
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_BASE_URL=https://yourdomain.com \
  -e NEXT_PUBLIC_VERCEL_ENV=production \
  -e NEXT_PUBLIC_PASSWORD=your-password
