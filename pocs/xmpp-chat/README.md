# XMPP Chat POC

This is a Proof of Concept (POC) demonstrating a real-time chat application using the XMPP (Extensible Messaging and Presence Protocol) protocol. The application showcases how XMPP can be used to implement instant messaging features in a modern web application.

## Features

- Real-time messaging between users
- User presence (online/offline status)
- Simple and intuitive user interface
- Built with modern web technologies (TypeScript, React)
- Containerized XMPP server using ejabberd

## Prerequisites

- Docker and Docker Compose
- Node.js (v14 or later)
- pnpm (recommended) or npm

## Getting Started

### 1. Start the XMPP Server

```bash
docker-compose -f apps/infra/docker-compose.yml up -d
```

### 2. Create XMPP Users

You'll need to create at least two users to test the chat functionality. Run the following commands to create users:

```bash
# Create first user
docker exec xmpp-ejabberd ejabberdctl register leonardo localhost 123456

# Create second user
docker exec xmpp-ejabberd ejabberdctl register heitor localhost 123456
```

You can create as many users as needed by repeating the command with different usernames.

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Start the Application

```bash
pnpm dev
```

The web application should now be running at `http://localhost:3000`.

## How to Use

1. Open the application in your web browser
2. Log in using one of the users you created (e.g., leonardo@localhost)
3. Open another browser window in incognito/private mode
4. Log in with a different user (e.g., heitor@localhost)
5. Start chatting between the two users

## Project Structure

- `/apps/web` - Frontend React application
- `/apps/api` - Backend API (if applicable)
- `/apps/infra` - Infrastructure configuration (Docker, ejabberd)
- `/packages` - Shared code between frontend and backend

## Technologies Used

- **Frontend**: React, TypeScript
- **XMPP Library**: Strophe.js or similar
- **XMPP Server**: ejabberd
- **Containerization**: Docker
- **Package Manager**: pnpm

## What I learned?

Trying to understand how WhatsApp uses XMPP to avoid reinventing the wheel. This uses XMPP to implement a simple chat application and have features like presence, read receipts and other cool stuffs that we have in core of XMPP.
