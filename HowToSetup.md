# Hospital Management System --- Setup Guide

This guide covers local development, VPS deployment, Docker deployment,
MongoDB Atlas configuration, first-user setup, and basic branding
customization.

> **Important:** This guide is based on the supplied frontend and
> backend `package.json` files and the project details provided. Confirm
> the exact environment-variable names, API routes, admin-role rules,
> and upload/payment configuration in your source code before deploying.
> Do not publish real secrets.

## 1. Technology Stack

-   **Frontend:** React 19, Vite 8, Tailwind CSS 4, React Router, Axios
-   **Backend:** Node.js, Express 5, Mongoose
-   **Database:** MongoDB Atlas
-   **Authentication:** JWT and bcrypt
-   **Media uploads:** Cloudinary and Multer
-   **Payments:** Razorpay (if enabled in the application)

## 2. Requirements

Install the following on your development machine:

-   A Node.js version compatible with the installed Vite and backend
    dependencies
-   npm
-   Git
-   A MongoDB Atlas account
-   A Cloudinary account if image uploads are used
-   Razorpay credentials if payment features are enabled

The project has separate frontend and backend folders. The commands
below assume this structure:

``` text
project/
├── frontend/
│   ├── package.json
│   └── ...
└── backend/
    ├── package.json
    ├── server.js
    └── ...
```

If your actual folder names differ, adjust the commands accordingly.

## 3. Configure MongoDB Atlas

1.  Create a cluster in MongoDB Atlas.
2.  Create a database user with a strong password.
3.  In Atlas Network Access, allow connections only from the IP
    addresses that need database access. For a VPS, add the VPS public
    IP; avoid opening access to everyone unless you understand the
    security implications.
4.  Choose **Connect → Drivers** and copy the MongoDB connection string.
5.  Put the connection string in the backend environment file using the
    exact variable name expected by your code (commonly `MONGODB_URI` or
    `MONGO_URI`).
6.  Replace the placeholder username, password, and database name.
    URL-encode special characters in the database password when
    required.
7.  Keep the connection string private. Never commit it to Git or expose
    it in frontend variables.

Example only --- use the variable name your code actually reads:

``` env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
```

## 4. Environment Variables

Create a `.env` file in the backend directory if your application uses
`dotenv`. Check `server.js` and the related configuration files for the
exact required variable names.

Your backend may need values for:

``` env
PORT=4000
MONGODB_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<long-random-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
```

These are examples, not a confirmed list of the project's actual
variable names. Only add variables that the source code reads. Use a
different, strong secret for production. Do not place private secrets in
frontend environment variables.

For Vite, frontend variables exposed to browser code generally use the
`VITE_` prefix. If the project uses a variable such as
`VITE_BACKEND_URL`, set it to the backend API base URL and confirm the
exact name in the source code.

## 5. Run Locally

### Backend

``` bash
cd backend
npm install
npm run server
```

The `server` script runs `nodemon server.js`. For a production-style
local start, use:

``` bash
npm start
```

Confirm the port and startup output from `server.js`.

### Frontend

Open a second terminal:

``` bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal. Make sure the
frontend's API base URL points to the running backend and that the
backend CORS configuration allows the frontend origin.

### Production build check

``` bash
cd frontend
npm run build
```

This creates a production build, usually in `frontend/dist`. The
`npm run preview` command is useful for previewing a build locally; it
is not a substitute for a production web server.

## 6. First Admin Login

The supplied project details say that registration is available through
the Register page. However, **a public registration page does not
automatically mean the first registered user becomes an administrator**.

1.  Start the backend and frontend.
2.  Open the application and register a test account.
3.  Sign in and verify the available features.
4.  Check the backend registration controller/model to confirm how roles
    are assigned.
5.  If the app requires an administrator, use the project's existing
    documented admin-creation process or implement a secure
    admin-seeding process. Do not grant admin privileges based solely on
    a public form or user-editable request data.
6.  Verify admin access with a test account before production use.

Do not document a default admin email or password unless the project
explicitly defines one. Never ship a hard-coded production admin
password.

## 7. VPS Deployment

The following is a general deployment outline; exact commands depend on
the VPS operating system and web-server configuration.

1.  Provision a supported Linux VPS and secure SSH access.
2.  Install a compatible Node.js release, npm, and Git.
3.  Deploy the code using Git or a secure file transfer method.
4.  Configure the backend `.env` file on the server. Restrict file
    permissions and keep secrets out of the repository.
5.  Add the VPS public IP to MongoDB Atlas Network Access.
6.  Install backend dependencies and test the backend with `npm ci` if a
    committed lockfile is available; otherwise use `npm install`.
7.  Run the backend with a process manager such as systemd or PM2, or
    use a container. Configure automatic restart and logs.
8.  Build the frontend with `npm run build`.
9.  Serve the frontend build through a web server such as Nginx, and
    configure the API URL to point to the deployed backend.
10. Configure HTTPS using a trusted TLS certificate.
11. Configure the backend CORS allowlist for the production frontend
    domain.
12. Test registration, login, doctor listings, appointment booking,
    image uploads, and payment flows if those features are enabled.

Do not expose the backend's environment file, database credentials, or
internal service ports publicly.

## 8. Docker Deployment

Docker configuration has **not yet been confirmed** in this project. If
`Dockerfile` and `docker-compose.yml` files do not exist, they must be
created and tested before Docker deployment can be considered supported.

A typical Docker setup would include: - A frontend build stage that runs
`npm ci` and `npm run build`, then serves the static build. - A backend
image that installs production dependencies and runs `npm start`. -
Environment variables supplied at runtime rather than copied into
images. - A reverse proxy or routing configuration for frontend and API
traffic. - MongoDB Atlas as the external database; a separate MongoDB
container is not required when using Atlas.

Before release, add health checks, persistent/logging strategy where
appropriate, non-root containers where practical, and a documented
upgrade/rollback procedure. Do not claim Docker support until the
configuration has been built and tested.

## 9. Branding Customization

1.  Locate the app title and logo in the frontend source and public
    assets.
2.  Replace the logo with your own licensed image asset and update the
    relevant component or asset path.
3.  Update the page title and metadata in `frontend/index.html`.
4.  Adjust colors, typography, and spacing in the Tailwind CSS classes
    or stylesheet configuration used by the project.
5.  Update any visible product name, footer text, favicon, and contact
    details.
6.  Verify the design at desktop, tablet, and mobile sizes.
7.  Rebuild the frontend after changes.

Search the frontend source for the current app name, logo filename, and
color classes to find the correct locations. Avoid changing branding in
third-party assets without permission.

## 10. Pre-Deployment Checklist

-   [ ] Frontend production build completes successfully.
-   [ ] Backend starts successfully and connects to MongoDB Atlas.
-   [ ] All required environment variables are documented without
    revealing secret values.
-   [ ] Atlas network access is restricted to trusted IP addresses.
-   [ ] Registration, login, authorization, and logout are tested.
-   [ ] Admin permissions are assigned securely and verified.
-   [ ] Frontend API URL and backend CORS settings match the deployment
    domains.
-   [ ] HTTPS is enabled.
-   [ ] Uploads and payment integrations are tested if enabled.
-   [ ] Docker files are tested before claiming Docker support.
-   [ ] No `.env` files, credentials, or production secrets are
    committed to Git.

## 11. Troubleshooting

-   **Database connection fails:** Check the Atlas connection string,
    database-user credentials, IP access list, and URL encoding of
    special characters.
-   **Frontend cannot reach the API:** Check the frontend API base URL,
    backend port, CORS settings, and browser network console.
-   **Login fails:** Check backend logs, token configuration, password
    hashing, and the authentication API response.
-   **Images do not upload:** Check the Cloudinary environment values,
    upload route, and Multer configuration.
-   **Payment fails:** Verify Razorpay credentials and confirm that
    test/live credentials match the environment.

## Project-Specific Items to Confirm Before Publishing

-   Exact backend environment-variable names
-   Actual API port and route prefixes
-   Whether registration assigns a role, and how the first administrator
    is created
-   Whether the repository already includes Docker files
-   Production domain, frontend hosting method, and API URL
-   Which Cloudinary and Razorpay features are active
