# React + TypeScript concept lab

A small **React 19 + TypeScript + Vite** app used for hands-on training: routing, auth guards, data fetching (TanStack Query), forms, state, and common UI patterns. The code uses short “concept” comments at the top of many files so you can jump straight to the teaching point.

**Repository:** [github.com/ennpearl/reactConceptLearning](https://github.com/ennpearl/reactConceptLearning)

---

## Who this is for

- Developers who already know JavaScript and want a **guided path into TypeScript with React**.
- Anyone who learns best by **reading real code**, running it locally, and changing things.

---

## How to learn TypeScript (with this project)

Use this order; open the linked files in your editor as you go.

### 1. TypeScript fundamentals (30–60 minutes first)

Work through the official [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html), at least:

- Everyday types (`string`, `number`, `boolean`, arrays, `any` vs avoiding it)
- Objects: `interface` vs `type`
- Unions and narrowing (`if`, `switch`, discriminated unions)
- Generics (functions and types like `Paginated<T>`)
- Utility types (`Partial`, `Pick`, etc.) when you see them in the wild

### 2. Apply types to “domain” data

See how shapes are defined once and reused:

| Topic | File |
|--------|------|
| Domain models, unions, generics | `react-masterclass/src/types/employee.ts` |
| Auth-related types | `react-masterclass/src/types/auth.ts` |

**Exercise:** Add a new optional field to `Employee` and fix every place TypeScript reports an error until the project builds again (`npm run build`).

### 3. React + TypeScript patterns

| Topic | Where to look |
|--------|----------------|
| Children typing | `react-masterclass/src/components/ProtectedRoute.tsx` (`PropsWithChildren`) |
| Router + lazy routes + `Suspense` | `react-masterclass/src/App.tsx` |
| Context | `react-masterclass/src/context/AuthContext.tsx`, `ThemeContext.tsx` |
| Custom hooks | `react-masterclass/src/hooks/` |
| TanStack Query | `react-masterclass/src/services/queryClient.ts`, pages that load data |
| Forms (react-hook-form + Zod) | `react-masterclass/src/pages/EmployeeCreatePage.tsx` (and related) |
| Zustand store | `react-masterclass/src/store/uiStore.ts` |
| Compound components, render props, HOC, container/presenter | `react-masterclass/src/pages/PatternsPage.tsx` and components it imports |

### 4. Deepen with the compiler

- Run **`npm run build`** — TypeScript must pass before Vite builds.
- Run **`npm run lint`** — catches many React/TS issues early.
- In VS Code/Cursor, hover types and use “Go to definition” on imports.

---

## Run the app on your machine

### Prerequisites

- **Node.js** 20 or newer (recommended for current Vite tooling).
- **npm** (comes with Node).

### Steps

1. **Clone** this repository (after you have pushed it, or use your local copy):

   ```bash
   git clone https://github.com/ennpearl/reactConceptLearning.git
   cd reactConceptLearning
   ```

2. **Install dependencies** (from the app folder):

   ```bash
   cd react-masterclass
   npm install
   ```

3. **Start the dev server:**

   ```bash
   npm run dev
   ```

4. Open the URL shown in the terminal (usually `http://localhost:5173`).

### Other useful commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Hot-reload development server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint |

### Using the UI as a study map

- **Log in** from `/login` (demo auth is local; explore `authService` / `AuthContext`).
- Browse **Employees**, **Settings**, **Patterns** — each area ties to different concepts (see table above).

---

## Publish this project to GitHub (public)

Your empty remote is: **https://github.com/ennpearl/reactConceptLearning**

### A. Create the repo on GitHub (if needed)

1. On GitHub, open [github.com/ennpearl/reactConceptLearning](https://github.com/ennpearl/reactConceptLearning).
2. If it is empty, you are ready. Ensure **Settings → General → Danger Zone** does *not* say private (or set **Change repository visibility** to **Public**).

### B. Push from your PC (first time)

From the folder that contains this `README.md` (the repo root):

```bash
git init
git add .
git commit -m "Initial commit: React + TypeScript concept lab"
git branch -M main
git remote add origin https://github.com/ennpearl/reactConceptLearning.git
git push -u origin main
```

- If GitHub asks you to sign in, use a **[Personal Access Token](https://github.com/settings/tokens)** as the password when using HTTPS, or set up **[SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)** and use `git@github.com:ennpearl/reactConceptLearning.git` as `origin`.

### C. Updates after the first push

```bash
git add .
git commit -m "Describe your change"
git push
```

---

## License

You may use this repo for learning and teaching. Add a `LICENSE` file on GitHub if you want a specific open-source license.
