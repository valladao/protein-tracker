# Protein Tracker

A minimalist, open-source web app to track your daily protein intake.
**Live demo:** _coming soon_
**Status:** In active use and open to contributions
**Author:** [@valladao](https://github.com/valladao)

![screenshot](./screenshot.png)

---

## ✨ Purpose

**Protein Tracker** is a mobile-friendly web app I built to help monitor and optimize daily protein intake. It was born out of a personal need: I wanted a simple and accessible way to track how much protein I was consuming every day, directly from my phone.

Rather than relying on third-party apps that were often bloated or required subscriptions, I decided to create a minimalist and focused application that anyone could use and improve upon.

It is now available as an open-source tool, so anyone can use it, improve it, or extend it.

---

## 🔄 Features

- ✅ Track daily protein intake
- ⭐ Mark entries as favorites to reuse easily
- ➕ Add new entries with timestamp
- ❌ Delete entries or favorites
- 🔢 Percentage bar for daily goal progress
- 📅 History of last 5 days with stats
- 👩‍💼 Clean, mobile-optimized UI with accessible buttons

---

## 🚀 Tech Stack

| Layer          | Technologies Used                                       |
| -------------- | ------------------------------------------------------- |
| Frontend       | React + TypeScript + Tailwind CSS + Vite + React Router |
| Backend (DB)   | Firebase Realtime Database                              |
| Hosting        | Firebase Hosting and Vercel (planned)                   |
| State Handling | React Hooks                                             |

- **Vite** for fast frontend development.
- **React + TypeScript** for building UI with type safety.
- **React Router** for client-side routing and route params.
- **Tailwind CSS** for styling.
- **Firebase Realtime Database** for storing user data.

## 🧩 Components

The app is organized with reusable components:

- `Header`: Displays user's nickname, goal and summary.
- `ProgressBar`: Shows daily consumption visually.
- `EntryForm`: Add new food/protein entries.
- `FavoriteFoods`: List of reusable foods with quick add/delete.
- `EntryList`: Today’s entries with star (favorite) and delete.
- `HistoryList`: Last 5 days of consumption.

## 📁 Folder Structure

```
src/
├── components/
│   ├── EntryForm.tsx            # Modular, reusable components (Header, EntryList, etc.)
│   ├── EntryList.tsx
│   ├── FavoriteFoods.tsx
│   ├── Header.tsx
│   ├── HistoryList.tsx
│   └── ProgressBar.tsx
├── lib/                         # Firebase setup
│   └── firebase.ts
├── pages/                       # Main user page (User.tsx, etc.)
│   ├── Home.tsx
│   └── User.tsx
├── App.tsx
├── main.tsx
└── index.css
```

Firebase database follows this structure:

```json
users/{nick}/
  meta: 140
  foods: { id: { name, protein } }
  entries/{YYYY-MM-DD}/: { id: { name, protein, timestamp } }
```

---

## 🧪 How to Run Locally

```bash
git clone https://github.com/valladao/protein-tracker.git
cd protein-tracker
npm install
npm run dev
```

## 🔒 Environment Variables

You'll need a Firebase Realtime Database. Create a project and add the credentials in `.env`:

```bash
VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="..."
VITE_FIREBASE_DATABASE_URL="..."
VITE_FIREBASE_PROJECT_ID="..."
VITE_FIREBASE_STORAGE_BUCKET="..."
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."
```

> You'll need to create a Firebase Realtime Database instance with public read/write permissions (for now).

---

## ✊ Contributing

Contributions are welcome!
I use this app daily, but I believe it could benefit a wider audience. Since the core is simple and extensible, this project is open to:

- Suggest a feature via issue
- Improve UI/UX
- Refactor or optimize code
- Add localization (i18n)
- Help turn it into a PWA
- Feedback and suggestions

To contribute:

1. Fork the repo
2. Create a branch
3. Submit a PR with a clear description

---

## 🛠️ Future Ideas

- Add Authentication.
- Weekly/monthly analytics.
- PWA (installable on mobile).
- Export to CSV.

---

## 😊 License

MIT License.

> This project is for educational and personal use. Use it freely, improve it openly.

---

## 📅 Maintainer's Note

> I created this to solve a real daily problem for myself. If it helps others too, that's even better. Thanks for visiting, and feel free to use or build upon it.
>
> Stay healthy!

Made with 💪 by [Manoel Valladão](https://github.com/valladao)
