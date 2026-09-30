# Media Database

A modern full-stack application built with an **ASP.NET Core (.NET 10)** backend and a **React** frontend.

---

## 📁 Repository Structure

```text
media-database/
├── api/                  # Backend API (.NET 10 Web API)
│   ├── Properties/       # Launch profiles (launchSettings.json)
│   ├── Program.cs        # Application entrypoint & endpoint routing
│   ├── WeatherForecast.cs# Data models
│   ├── api.csproj        # .NET project configuration
│   ├── api.http          # HTTP requests for testing endpoints
│   └── appsettings.json  # Configuration settings
├── ui/                   # Frontend SPA (React)
│   ├── public/           # Static assets (HTML, favicons, manifest)
│   ├── src/              # React components, styles, and entrypoint
│   ├── package.json      # Frontend dependencies and scripts
│   └── .yarnrc.yml       # Yarn modern configuration
├── .gitignore            # Git ignore rules for .NET and React
└── README.md             # Project documentation
```

---

## 🛠️ Tech Stack

- **Backend**:
  - [.NET 10.0](https://dotnet.microsoft.com/) Web API
  - C# with implicit usings and nullable reference types enabled
  - Built-in OpenAPI document support (`Microsoft.AspNetCore.OpenApi`)
- **Frontend**:
  - [React 19](https://react.dev/)
  - [Yarn 4 (Berry)](https://yarnpkg.com/)
  - Testing with `@testing-library/react` and Jest

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:

1. **[.NET 10 SDK](https://dotnet.microsoft.com/download)**:
   ```bash
   dotnet --version
   ```
2. **[Node.js](https://nodejs.org/)** (v20+ recommended):
   ```bash
   node --version
   ```
3. **Corepack / Yarn**:
   ```bash
   corepack enable
   yarn --version
   ```

---

## 🚀 Quick Start

### 1. Backend (`api`)

Navigate to the `api` directory and run the application:

```bash
cd api
dotnet restore
dotnet run
```

Alternatively, run with hot reload during development:

```bash
dotnet watch
```

- **HTTP**: [http://localhost:5055](http://localhost:5055)
- **HTTPS**: [https://localhost:7226](https://localhost:7226)
- **OpenAPI Document**: [http://localhost:5055/openapi/v1.json](http://localhost:5055/openapi/v1.json) (while in Development mode)

You can also test endpoints directly using the included [`api/api.http`](api/api.http) file with the VS Code REST Client extension or JetBrains Rider HTTP Client.

---

### 2. Frontend (`ui`)

Navigate to the `ui` directory, install dependencies, and start the development server:

```bash
cd ui
yarn install
yarn start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 📜 Available Scripts

### Backend (`/api`)

| Command | Description |
| :--- | :--- |
| `dotnet build` | Compiles the .NET API project. |
| `dotnet run` | Runs the API server. |
| `dotnet watch` | Starts the server with live file watching and hot reload. |
| `dotnet publish -c Release` | Produces a release-ready deployment bundle. |

### Frontend (`/ui`)

| Command | Description |
| :--- | :--- |
| `yarn start` | Runs the frontend development server at `http://localhost:3000`. |
| `yarn build` | Builds the production bundle to the `ui/build` folder. |
| `yarn test` | Runs the interactive test runner. |
| `yarn eject` | Ejects from standard create-react-app scripts (one-way operation). |

---

## ⚙️ Configuration

- **API Settings**: Configured in `api/appsettings.json` and `api/appsettings.Development.json`. Local overrides should be placed in `api/appsettings.*.local.json` (ignored by git).
- **Frontend Environment**: Environment variables can be defined in `ui/.env` or `ui/.env.local`.