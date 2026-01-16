
# CMS Frontend Documentation

This document provides a detailed overview of the `cms-frontend` application, including its architecture, features, and API integrations.

## 1. Project Structure and Technology

The `cms-frontend` is a modern web application built with **[Next.js](https://nextjs.org/) (v15)**, a popular framework based on **[React](https://react.dev/) (v19)**. The code is written in **[TypeScript](https://www.typescriptlang.org/)**, which adds static typing to JavaScript for improved code quality and maintainability. The user interface is styled using **[Tailwind CSS](https://tailwindcss.com/)**, a utility-first CSS framework.

The high-level project structure is as follows:

```
cms-frontend/
├── .next/           # Automatically generated directory for Next.js build output.
├── docs/            # Contains documentation related to the project.
├── node_modules/    # Stores all third-party project dependencies.
├── public/          # For static assets like images, fonts, that are publicly accessible.
├── src/             # The heart of the application, containing all source code.
├── .env             # Stores environment variables (e.g., API keys, base URLs).
├── next.config.ts   # Configuration file for Next.js (e.g., redirects, port settings).
├── package.json     # Lists project dependencies and defines npm scripts (e.g., `dev`, `build`).
├── tailwind.config.mjs # Configuration for the Tailwind CSS framework.
└── tsconfig.json    # The TypeScript compiler configuration file.
```

## 2. File Structure Explained

The core application logic resides in the `src` directory. Its organization promotes a clean and scalable architecture.

-   `src/app/`: This directory uses the **Next.js App Router** to define the application's routes and pages. Each subdirectory typically corresponds to a URL path.
    -   `src/app/login/`: The admin login page.
    -   `src/app/dashboard/`: The main dashboard area for authenticated admins. It contains further subdirectories for each major feature of the CMS.
    -   `src/app/api/`: This can contain **Next.js API routes**. These are used to create a "Backend-for-Frontend" (BFF), allowing the frontend to have its own serverless API endpoints for tasks like handling webhooks or proxying requests to other services.

-   `src/components/`: Contains reusable React components. For example, you might find `Button.tsx`, `Table.tsx`, or a `CourseCard.tsx` component here. This promotes consistency and avoids code duplication.

-   `src/context/`: Holds React Context providers for global state management. For instance, a `UserContext.tsx` could provide information about the currently logged-in user to any component in the app without needing to pass props down through many levels.

-   `src/hooks/`: Contains custom React hooks (functions starting with `use...`). These are used to encapsulate and reuse stateful logic. An example could be a `useApiData(url)` hook that handles fetching, loading states, and errors for a given API endpoint.

-   `src/lib/`: A crucial directory for utility functions and the API client layer.
    -   `api-client.ts`: A central wrapper for the `fetch` API. It standardizes how API calls are made, including error handling.
    -   `api-interceptor.ts`: Intercepts all outgoing API requests to perform actions like adding the authentication token to the headers.
    -   Other files like `courses-api.ts` and `partners-api.ts` define specific, typed functions for interacting with different backend API endpoints (e.g., `getCourseById(id)`, `updatePartner(data)`).

-   `src/types/`: Contains shared TypeScript type definitions. For example, `type Course = { id: string; title: string; ... }` would be defined here and reused across the application.

## 3. Implemented Functionality

The `cms-frontend` is a Content Management System (CMS) designed for managing educational content. Based on the application's structure, it supports the following features:

-   **Authentication:** Users log in through a dedicated page (`/login`), which supports **Google-based authentication (OAuth)**.

-   **Dashboard:** After logging in, admins land on a central dashboard that provides access to all the CMS modules.

-   **Content Management (CRUD Operations):** The core of the CMS is its ability to manage various content types. This typically involves **CRUD** (Create, Read, Update, Delete) operations for each of the following:
    -   **Courses** (`/dashboard/courses`): Managing the course catalog.
    -   **Course Builder** (`/dashboard/buildercourses`): A more advanced interface, likely for creating or assembling course content and structure using a drag-and-drop interface (powered by `@dnd-kit`).
    -   **Categories** (`/dashboard/categories`): Organizing courses into different categories.
    -   **Partners** (`/dashboard/partners`): Managing information about partner institutions.
    -   **Coupons** (`/dashboard/coupon`): Creating and managing discount coupons.
    -   **Success Stories & Case Studies** (`/dashboard/successstories`, `/dashboard/cases`): Managing testimonials and detailed case studies.
    -   **User Activities** (`/dashboard/activities`): Viewing or tracking user engagement.

-   **User Profile & Settings:**
    -   Users can manage their own profile information via `/dashboard/profile`.
    -   Global application settings can be configured in the `/dashboard/settings` area.

## 4. APIs and Backend Communication

The `cms-frontend` is a client-side application and relies on a backend service for data persistence.

-   **API Client:** A centralized API client in `src/lib/api-client.ts` uses the browser's `fetch` API to make requests to the backend.

-   **Backend Service:** The application communicates with a backend whose address is specified by the `NEXT_PUBLIC_API_BASE_URL` environment variable. Given the monorepo structure, this is likely the `cms-service`.

-   **Authentication (JWT):**
    -   Authentication is based on **JSON Web Tokens (JWT)**. When a user logs in, the backend issues a short-lived `accessToken`.
    -   This `accessToken` is a secure, digitally signed token that proves the user's identity. It must be sent with every subsequent API request to access protected resources.
    -   The application also supports **Google OAuth**, where a successful Google login provides a token that is exchanged with the backend for a JWT.

-   **API Interceptor:** The `api-interceptor.ts` file plays a critical role in authentication. It automatically "intercepts" every outgoing API request and adds the `accessToken` to the HTTP `Authorization` header. This saves developers from having to manually add the token to every API call.

-   **API Endpoints:** The frontend is pre-configured to communicate with a rich set of REST API endpoints to perform its functions. The code is organized by resource, indicating a well-structured backend API for managing:
    -   Courses, Categories, Instructors, Specialities
    -   Partners, Patrons, Pricing
    -   FAQs, Eligibility, Keywords, and more.

-   **Centralized Error Handling:** The `api-client.ts` includes a global error handler. It inspects the HTTP status code of API responses and translates errors into user-friendly **toast notifications** (e.g., "You do not have permission," "Server error, please try again"). This ensures a consistent error-handling experience across the application.
