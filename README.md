# Dynamic A* Pathfinding with Neo4j (Frontend)

This project is a modern frontend application for visualizing and interacting with dynamic A* pathfinding, powered by a Neo4j backend. It allows users to select waypoints on a map (focused on Gujarat, India) and find the most efficient routes between them using the A* algorithm.

## Features

- **Interactive Map**: Select multiple waypoints within Gujarat using an intuitive map interface (powered by Leaflet and OpenStreetMap).
- **Dynamic Pathfinding**: Calculates the shortest path between selected points using the A* algorithm, with data fetched from a Neo4j-powered backend.
- **Route Visualization**: Draws the computed path on the map and displays route details, including total cost/distance.
- **Modern UI**: Built with React, shadcn-ui, and Tailwind CSS for a responsive, accessible, and visually appealing experience.
- **Error Handling**: User-friendly notifications for invalid selections, errors, or unavailable routes.

## Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (build tool)
- [Leaflet](https://leafletjs.com/) (interactive maps)
- [Tailwind CSS](https://tailwindcss.com/) (utility-first styling)
- [shadcn/ui](https://ui.shadcn.com/) (UI components)
- [Radix UI](https://www.radix-ui.com/) (accessible primitives)
- [Neo4j](https://neo4j.com/) (graph database, backend)

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/) (for dependency management)
- A running backend server exposing a compatible API (see below)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   bun install
   ```
3. **Start the development server:**
   ```sh
   npm run dev
   # or
   bun run dev
   ```
   The app will be available at [http://localhost:8080](http://localhost:8080) by default.

### Usage
- Click on the map to add waypoints (must be within Gujarat).
- Click **Find Path** to compute the shortest route between the selected points.
- View the route and details below the map.
- Use **Reset** to clear waypoints and start over.

### Backend API
This frontend expects a backend API (default: `http://localhost:5000/api/find-path`) that accepts `start` and `end` coordinates as query parameters and returns a JSON response with the path and total cost. Example request:

```
GET /api/find-path?start=22.2587,71.1924&end=23.0225,72.5714
```

Example response:
```json
{
  "path": [
    { "name": "A", "latitude": 22.2587, "longitude": 71.1924 },
    { "name": "B", "latitude": 23.0225, "longitude": 72.5714 }
  ],
  "totalCost": 123.45
}
```

> **Note:** You must have the backend running and accessible for the frontend to function correctly.

## Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Lint code

## Customization
- To change the map region, update the bounding box in `src/components/MapComponent.tsx`.
- To point to a different backend, update the API URL in the same file.

## License

This project is for educational and demonstration purposes. See [LICENSE](LICENSE) if present.
