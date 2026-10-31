# Repository Guidelines

## Project layout
- `frontend/`: React + Vite application.
- `backend/`: Node.js + Express API.
- `database/`: database-related documentation or scripts, if applicable.

## Development commands
- Frontend development: `cd frontend && npm install && npm run dev`
- Frontend production build: `cd frontend && npm run build`
- Backend development: `cd backend && npm install && npm run server`
- Backend start: `cd backend && npm start`

## Safety and configuration
- Never commit `.env` files, credentials, tokens, or production secrets.
- Keep `.env.example` placeholders aligned with the variable names actually read by the source code.
- Validate authentication and authorization on the server for every protected or mutating endpoint.
- Do not trust client-submitted role values when creating or updating users.
- Do not claim Docker support until Docker configuration has been added and tested.

## Before release
- Test the frontend build and backend startup.
- Verify MongoDB Atlas connectivity, CORS, API URL, registration, login, role enforcement, uploads, and payments where applicable.
- Add genuine screenshots and document the actual license.
