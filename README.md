
# PEA Complaint System (Vite Version)

This is a web application for submitting and managing customer complaints for the Provincial Electricity Authority (PEA), built with React, Vite, and Tailwind CSS.

## Getting Started

Follow these steps to get the development environment running.

### 1. Prerequisites

- Node.js (v18 or later)
- npm or yarn

### 2. Installation

First, install the project dependencies:

```bash
npm install
```

### 3. Environment Variables

This project requires a Google Gemini API key to function correctly.

1.  Create a new file named `.env.local` in the root of the project.
2.  Add your API key to this file, prefixed with `VITE_`:

    ```
    VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```

    Replace `YOUR_GEMINI_API_KEY_HERE` with your actual key from Google AI Studio.

### 4. Running the Development Server

Once the installation is complete and the environment variable is set, you can run the application:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or whatever port Vite assigns) with your browser to see the result.

### 5. Deployment on Vercel

This application is ready to be deployed on Vercel. 
1. Push your code to a Git repository (GitHub, GitLab, etc.).
2. Connect your repository to Vercel. Vercel will automatically detect that it's a Vite project.
3. In your Vercel project's settings, go to "Environment Variables" and add your Gemini API key with the name `VITE_API_KEY`.
4. Deploy. Vercel will handle the build process for you.
