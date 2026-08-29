# MediaFetch

MediaFetch is a modern web application designed to search, track, and sync your reading/watching lists for Anime, Manga, and Web Novels. It implements a robust, secure backend that handles web scraping and API aggregation, paired with a sleek React-based client dashboard.

---

## 🏗️ Architectural Design

1. **Hybrid Database Strategy**: The application avoids caching entire catalogs (such as WebNovel's database). Instead, search queries are executed dynamically via scraping (using Microsoft Playwright) or public APIs. Novel/Show metadata is only persisted to the PostgreSQL database when a user actively adds a title to their tracking list.
2. **Decoupled Scraper Architecture**: Scraping actions are completely isolated on the backend. This shields the frontend application from layout updates or design shifts on the third-party providers.
3. **Automated Tracking Engine**: A background `@Scheduled` scheduler runs periodically in the Spring Boot backend to fetch the latest chapters of all tracked novels. If an increment is detected, it generates user-facing in-app notifications.

---

## 🛠️ Technology Stack

* **Frontend**: React (v19), TypeScript, Vite, Tailwind CSS, React Router
* **Backend**: Spring Boot (v4), Java 25, Playwright Java (for headless Chromium scraping), WebClient (for AniList/GraphQL API requests), JPA/Hibernate
* **Database**: PostgreSQL (v18)
* **Proxy**: Nginx (for React SPA routing fallback in container deployment)

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory. You can use the values from `.env.example` as a starting template:

```ini
DB_USERNAME = postgres
DB_PASSWORD = your_db_password
DB_NAME = mediafetch
JWT_SECRET = YOUR_SECURE_JWT_HEX_STRING_HERE
JWT_EXPIRATION = 86400000
FRONTEND_URL = http://localhost:5173
```

---

## 🚀 Local Development

### 1. Database
Make sure you have a PostgreSQL server running locally, and create a database named `mediafetch`.

### 2. Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Build and run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *Note: Playwright will automatically download the Chromium binary to your local cache folder on the first startup.*

### 3. Frontend
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🐳 Docker Deployment (Production)

The application is containerized and configured for quick deployment using Docker Compose.

### Docker Optimizations
* **SPA Routing Fallback**: The frontend Docker stage serves the React build using Nginx. A custom `nginx.conf` handles history fallback (`try_files`) to prevent 404 errors when pages like `/Home` or `/Notification` are refreshed.
* **Playwright Dependencies**: The backend Dockerfile JRE image compiles and installs system-level dependencies (`libnss3`, `libatk`, etc.) so that the headless Chromium instance can run smoothly without crashing.

### Run with Docker Compose
Simply run the following command in the root folder containing `compose.yaml`:

```bash
docker compose up --build
```
This launches three containers:
* **db**: PostgreSQL database exposed on port `5432` (with volume mapping for persistence).
* **backend**: Spring Boot application on port `8080`.
* **frontend**: Nginx server on port `80` serving the client interface.
