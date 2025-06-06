# Mayaverse

Mayaverse is a collaborative platform for developers built using [Next.js](w) and [TypeScript](w), designed to create and manage virtual spaces. It leverages a monorepo structure with [Turborepo](w) for efficient development and build processes.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](w) (Latest LTS version recommended)
- [npm](w) (Package manager)
- [Git](w)

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/jsndz/mayaverse.git
cd mayaverse
npm install
```

### Running the Development Server

To start the development server, run:

```bash
cd mayaverse
npm run dev
```

You need to setup TURN servers to for video calls. You can setup TURN servers for free in [https://dashboard.metered.ca/dashboard/](Metered).
Set them up in constants.ts
Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

## Features

- **User Authentication**: Signup and Signin functionality.
- **Virtual Spaces**: Create and manage virtual spaces.
- **Real-Time Chat**: Chat with people in your virtual space. Powered by [WebSockets](w).
- **Video chat**: One to One Video chat available.
- **Minimalistic UI**: Designed using [Tailwind CSS](w).
- **Type Safety**: Ensured with TypeScript.

## Technologies Used

- **[Next.js](w)**: A React framework for server-side rendering and static site generation.
- **[TypeScript](w)**: A strongly typed programming language that builds on JavaScript.
- **[Prisma](w)**: ORM for database management.
- **[WebSocket](w)**: Enables real-time communication.
- **[Tailwind CSS](w)**: A utility-first CSS framework for styling.

## Folder Structure

```
mayaverse/
├── apps/
│   ├── client/        # Frontend application
│   ├── http/          # HTTP server
│   └── ws/            # WebSocket server
├── packages/
│   ├── db/            # Database package
│   ├── eslint-config/ # ESLint configurations
│   ├── typescript-config/ # TypeScript configurations
│   └── ui/            # UI components
└── turbo.json         # Turborepo configuration
```

## Scripts

- `npm run dev` - Start the development server.
- `npm build` - Build the application for production.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

For major changes, please open an issue first to discuss the proposed modifications.
