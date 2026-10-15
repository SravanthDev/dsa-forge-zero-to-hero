# DSA Forge — Zero to Hero

A guided DSA curriculum website with **MongoDB-backed progress tracking**.

## Features

- 143-lesson DSA curriculum (Foundations → Core Patterns → Advanced → Transfer)
- Spaced repetition review scheduling
- Per-lesson notes, independence scores, and mastery tracking
- Focus timer
- Progress synced to **MongoDB Atlas** — works across devices

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Vanilla HTML/CSS/JS (single file) |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net
PORT=3001
DB_NAME=dsa_forge
COLLECTION_NAME=progress
```

### 3. Start the server

```bash
npm start
```

Then open **http://localhost:3001** in your browser.

> ⚠️ Always open the site via `http://localhost:3001`, not by double-clicking the HTML file — the API calls require the server to be running.

## Project Structure

```
dsa-webstie/
├── dsa_forge_zero_to_hero.html   # Full frontend (curriculum + UI)
├── server.js                     # Express API server (GET/PUT /progress)
├── package.json
├── .env                          # ← NOT committed (add your own)
└── .gitignore
```
