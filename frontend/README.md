# Revadau UI

A premium, modern web application built with Next.js 16, React 19, and Tailwind CSS v4. It features a powerful, immersive dashboard designed for configuring and managing customized AI agents, voice providers, and real-time workflows.

## Features

- **Advanced Authentication**: Secure custom split-screen login/signup flow powered by NextAuth.js.
- **Premium UI/UX**: High-end visual design tailored for top-tier SaaS products. Features include glassmorphism, dynamic glowing inputs, isometric 3D dashboard perspectives, and an interactive 3D globe.
- **AI Agent Management**: Complete interface suite for building, testing, and deploying Realtime, Custom, STT (Speech-to-Text), and TTS (Text-to-Speech) AI agents.
- **Dynamic API Integrations**: Endpoints for dynamically retrieving LLM models, voice assets, and providers.
- **Dark Mode Native**: Immersive design emphasizing deep vignette shadows, ambient glows, and rich contrast.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router & Turbopack)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: custom premium components, [shadcn/ui](https://ui.shadcn.com/), Lucide React
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Animations/3D**: Native Tailwind keyframes, CSS filters, and [cobe](https://github.com/shuding/cobe)

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (Node 20+ corresponds with Next.js 16).

### Installation

1. Clone the repository:
   \\\ash
   git clone https://github.com/kid-ye/revadau-ui.git
   cd revadau-ui
   \\\

2. Install dependencies:
   \\\ash
   npm install
   \\\

3. Set up your environment variables:
   Create a \.env.local\ file at the root of the project with your necessary API secrets and NextAuth configurations (e.g., \NEXTAUTH_URL\, \NEXTAUTH_SECRET\).

4. Start the development server:
   \\\ash
   npm run dev
   \\\

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- \/src/app/\: Contains all App Router pages (Landing, Dashboard, Login, Builder) and extensive backend API routes (\/api/v1/agents\, \/api/tts-models\, etc.).
- \/src/components/\: Reusable, customized UI elements including \SplitAuthPage\, \FloatingLogin\, and the 3D \Globe\ component.
- \/src/lib/\: Core library helpers, utilities, and API configuration logic.

## Scripts

- \
pm run dev\: Runs the app in development mode.
- \
pm run build\: Creates an optimized production build.
- \
pm run start\: Starts a production server.
- \
pm run lint\: Lints the codebase using ESLint.
