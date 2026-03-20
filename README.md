# WavePods

WavePods is a full stack project built with React and Node.js that started as a landing page and is now evolving into a complete application. At this stage, it already includes a React/Vite frontend, an Express backend, Stripe checkout integration, and local persistence for newsletter subscriptions.

## Overview

- Frontend: React, Vite, Material UI, and React Router
- Backend: Node.js, Express, and Stripe
- Infrastructure: Docker, Docker Compose, and Nginx
- Recommended Node version for local development and CI: Node 20
- Current stage: a functional product landing page with purchase flow and a solid foundation for future product evolution

## Current Features

- Responsive landing page with product presentation sections
- Stripe Checkout integration
- Success and canceled purchase pages
- Newsletter subscription with local JSON persistence
- Basic `login` and `signup` routes as placeholders for the next phase

## Project Structure

```text
wavepods/
|-- client/
|   |-- public/
|   |-- src/
|   |   |-- api/
|   |   `-- components/
|   |-- Dockerfile
|   `-- vite.config.js
|-- server/
|   |-- controllers/
|   |-- data/
|   |-- routes/
|   |-- tests/
|   |-- utils/
|   |-- Dockerfile
|   `-- index.js
|-- docker-compose.yml
|-- package.json
`-- README.md
```

## Running with Docker

This is the easiest way to test the project in an environment closer to production.

### 1. Configure the backend environment variables

Fill in `server/.env.production` with your own values:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
FRONTEND_URL=http://localhost:8080
PORT=4242
```

### 2. Start the containers

```bash
docker compose up --build
```

### 3. Access the application

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:4242`

## Running Locally

### 1. Install dependencies

At the root:

```bash
npm install
```

In the frontend:

```bash
cd client
npm install
```

In the backend:

```bash
cd ../server
npm install
```

### 2. Configure the `.env` file

Create `server/.env` based on `server/.env.example`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
FRONTEND_URL=http://localhost:5173
PORT=4242
```

### 3. Go back to the root and start the project

```bash
cd ..
npm run dev
```

### 4. Local URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4242`

## Environment Variables

The variables below are required for the checkout flow to work correctly:

- `STRIPE_SECRET_KEY`: Stripe secret key in test or production mode
- `STRIPE_PRICE_ID`: price identifier created in the Stripe Dashboard
- `FRONTEND_URL`: frontend URL allowed by the backend
- `PORT`: port where the Express server will run

Without valid `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID` values, the buy button will not be able to create a checkout session.

## Newsletter Persistence

Newsletter subscriptions are currently stored in:

`server/data/newsletter-subscribers.json`

This is a transitional persistence layer. The next recommended step is migrating this data to a real database.

## Screenshots

[![Main](./client/public/contentmain.jpeg)](./client/public/contentmain.jpeg)
[![Features](./client/public/features.jpeg)](./client/public/features.jpeg)
[![Motivation 1](./client/public/motivation1.jpeg)](./client/public/motivation1.jpeg)
[![Motivation 2](./client/public/motivation2.jpeg)](./client/public/motivation2.jpeg)
[![Motivation 3](./client/public/motivation3.jpeg)](./client/public/motivation3.jpeg)
[![Buy Section](./client/public/buysection-footer.jpeg)](./client/public/buysection-footer.jpeg)

## Current Status and Next Steps

The project already delivers a functional full stack foundation, but it is not yet a complete application. The most important next steps are:

1. Implement real authentication for `login` and `signup`
2. Add a database for users, orders, and newsletter data
3. Build catalog, cart, and customer area flows
4. Replace client-side payment confirmation with Stripe webhooks
5. Add CI, frontend tests, and end-to-end coverage
