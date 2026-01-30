# Uber Select Test

A React + TypeScript + Vite application for testing the SearchableSelect component.

## Prerequisites

- Node.js (v18 or higher)
- npm

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Application

```bash
npm run dev
```

This command starts both:
- **Vite dev server** at `http://localhost:5173`
- **Mock API server** at `http://localhost:3001`

### 3. Access in Browser

Open your browser and navigate to:

```
http://localhost:5173
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both Vite dev server and mock API server |
| `npm run server` | Start only the mock API server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
uber-select-test/
├── src/                  # React source code
├── server.js             # Mock API server (Express)
├── dist/                 # Production build output
├── index.html            # HTML entry point
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

## Mock API Endpoints

The mock server provides endpoints for testing the SearchableSelect component:

- `GET http://localhost:3001/api/v1/agents/sponsors/search?searchText=<query>`

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- react-select
- react-hook-form
- Express (mock server)
