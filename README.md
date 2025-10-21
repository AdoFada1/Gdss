# AcademiaOS

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/AdoFada1/generated-app-20251021-184209)

A modern, intuitive School Management System for GDSS Waziri Ibrahim, designed for seamless administration, staff management, and student engagement.

AcademiaOS is a visually striking and intuitive platform that provides a centralized hub for administrators, staff, and students, each with a dedicated, role-based dashboard. The system facilitates seamless management of student and staff records, academic results, and user profiles. Built with a focus on exceptional user experience, visual excellence, and operational efficiency.

## ✨ Key Features

-   **Role-Based Dashboards**: Separate, tailored dashboards for Administrators, Staff, and Students.
-   **Centralized User Management**: Admins can easily add, view, and manage student and staff records.
-   **Academic Results Portal**: Staff can input grades, and students can view and print their academic reports.
-   **Secure Authentication**: A secure login portal for all user roles.
-   **Modern UI/UX**: A clean, responsive, and visually appealing interface built with shadcn/ui and Tailwind CSS.
-   **Edge-Powered**: Built on Cloudflare Workers for global performance and scalability.

## 🚀 Technology Stack

### Frontend

-   **Framework**: React (Vite)
-   **Routing**: React Router
-   **UI Components**: shadcn/ui
-   **Styling**: Tailwind CSS
-   **State Management**: Zustand
-   **Forms**: React Hook Form with Zod for validation
-   **Icons**: Lucide React
-   **Animations**: Framer Motion

### Backend

-   **Runtime**: Cloudflare Workers
-   **Framework**: Hono
-   **Storage**: Cloudflare Durable Objects

### Tooling & Language

-   **Language**: TypeScript
-   **Package Manager**: Bun
-   **Deployment**: Wrangler CLI

## 🏁 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd academia_os
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

## 💻 Development

### Running the Development Server

To start the local development server, which includes both the Vite frontend and the Hono backend worker, run:

```bash
bun run dev
```

This will start the application, typically on `http://localhost:3000`.

### Project Structure

-   `src/`: Contains the React frontend application code.
    -   `pages/`: Top-level page components and views.
    -   `components/`: Reusable UI components.
    -   `lib/`: Utility functions and API client.
-   `worker/`: Contains the Cloudflare Worker (Hono) backend code.
    -   `user-routes.ts`: API route definitions.
    -   `entities.ts`: Data models and business logic for Durable Objects.
-   `shared/`: TypeScript types and constants shared between the frontend and backend.

## 🚀 Deployment

This project is configured for seamless deployment to Cloudflare Pages and Workers.

1.  **Build the project:**
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    Make sure you are logged in to your Cloudflare account via the Wrangler CLI.
    ```bash
    wrangler login
    ```
    Then, run the deployment script:
    ```bash
    bun run deploy
    ```

Alternatively, you can connect your GitHub repository to Cloudflare Pages for automatic deployments on every push.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/AdoFada1/generated-app-20251021-184209)