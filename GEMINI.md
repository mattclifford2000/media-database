# GEMINI.md

This document provides context, architectural guidelines, and development rules for AI assistants (Antigravity / Gemini) and developers working on the **media-database** repository.

---

## Project Overview

`media-database` is a full-stack media management application composed of two primary sub-projects:
- **`api/`**: Backend REST API built on **ASP.NET Core (.NET 10.0)**.
- **`ui/`**: Frontend Single Page Application built on **React 19** with **Yarn 4**.

---

## Repository Layout

```text
media-database/
├── api/                       # .NET 10 Backend Web API
│   ├── Properties/
│   │   └── launchSettings.json# Launch profiles (HTTP 5055, HTTPS 7226)
│   ├── Program.cs             # Application configuration, DI, and routes
│   ├── WeatherForecast.cs     # Models
│   ├── api.csproj             # .NET 10 project definition
│   ├── api.http               # REST Client file for endpoint testing
│   ├── appsettings.json       # App configuration
│   └── appsettings.Development.json
├── ui/                        # React Frontend
│   ├── public/                # Static assets & HTML template
│   ├── src/                   # React components, styles, tests
│   │   ├── App.js             # Root component
│   │   ├── index.js           # DOM entrypoint
│   │   └── App.css            # Styles
│   ├── package.json           # React 19 dependencies & scripts
│   ├── .yarnrc.yml            # Yarn Modern configuration
│   └── .yarn/releases/        # Yarn 4 release binary
├── .gitignore                 # Consolidated repository gitignore
├── GEMINI.md                  # Assistant guidelines and project instructions
└── README.md                  # Project documentation & onboarding
```

---

## Development Workflows & Commands

### Backend (.NET 10)
Execute commands within the `api/` directory (or use `--project api` from the root):

- **Build project**:
  ```bash
  dotnet build api/api.csproj
  ```
- **Run API (Hot Reload)**:
  ```bash
  dotnet watch --project api
  ```
- **Run API (Standard)**:
  ```bash
  dotnet run --project api
  ```
- **Run Tests**:
  ```bash
  dotnet test
  ```
- **Default Endpoints**:
  - HTTP: `http://localhost:5055`
  - HTTPS: `https://localhost:7226`
  - OpenAPI Spec: `http://localhost:5055/openapi/v1.json` (in Development)
  - Endpoint requests can be tested using `api/api.http`.

### Frontend (React 19)
Execute commands within the `ui/` directory:

- **Install dependencies**:
  ```bash
  yarn install
  ```
  *(Always use Yarn 4 via the checked-in release or corepack; avoid running `npm install` to prevent lockfile conflicts).*
- **Start Development Server**:
  ```bash
  yarn start
  ```
  Runs at `http://localhost:3000`.
- **Run Tests**:
  ```bash
  yarn test --watchAll=false
  ```
- **Production Build**:
  ```bash
  yarn build
  ```

---

## Coding Standards & Architectural Guidelines

### 1. Backend (.NET 10 / C#)
- **Target Framework**: .NET 10 (`net10.0`).
- **Language Features**: Nullable reference types are enabled (`<Nullable>enable</Nullable>`) and Implicit Usings are enabled (`<ImplicitUsings>enable</ImplicitUsings>`).
- **Endpoint Design**: Use ASP.NET Core Minimal APIs for lightweight routes or modular controllers as the API expands.
- **Dependency Injection**: Register services through `builder.Services` with appropriate lifetimes (`AddScoped`, `AddSingleton`, `AddTransient`).
- **Configuration & Secrets**:
  - Place shared configs in `appsettings.json` / `appsettings.Development.json`.
  - Machine-specific or secret configs belong in `appsettings.*.local.json` or .NET User Secrets (`dotnet user-secrets`), never committed to git.
- **Error Handling**: Return standard HTTP status codes with structured problem details (`Results.Problem()`, `TypedResults`).

### 2. Frontend (React 19)
- **Component Pattern**: Use functional components with standard React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`).
- **Tooling**: Package management is handled by **Yarn 4**. Maintain `yarn.lock` and do not introduce `package-lock.json`.
- **Styling**: Standard CSS / CSS modules. Ensure responsive design and clean UI aesthetics.
- **API Integration**: Keep HTTP calls organized in dedicated service or utility modules (e.g. `src/services/api.js`).

---

## Safety & Git Practices

- **Ignore Rules**: Ensure build artifacts (`bin/`, `obj/`, `node_modules/`, `dist/`, `build/`), IDE user state (`.vs/`, `.idea/`), and local secrets are excluded.
- **No Force Operations**: Never drop databases or force-push to main branches without explicit user confirmation.
- **File Integrity**: Preserve existing formatting, comments, and project conventions when introducing modifications.
