# Quick Start Guide - Kairos React App

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd kairos-react
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to `http://localhost:5173`

---

## 📁 Project Structure at a Glance

```
kairos-react/
├── src/
│   ├── components/      # All React components
│   ├── hooks/           # Custom hooks (business logic)
│   ├── contexts/        # Global state management
│   ├── utils/           # Helper functions
│   ├── constants/       # App constants
│   └── styles/          # Global styles
├── public/              # Static assets
└── package.json         # Dependencies
```

---

## 🎯 Key Files to Know

### Entry Points
- `src/main.jsx` - App entry point
- `src/App.jsx` - Main app component
- `src/styles/global.css` - Global styles

### State Management
- `src/contexts/AppContext.jsx` - Global state (user, preferences)
- `src/hooks/useLocalStorage.js` - Persistent storage hook

### Business Logic
- `src/hooks/useTime.js` - Time calculations
- `src/hooks/useTodos.js` - Todo management
- `src/hooks/useHabits.js` - Habit tracking
- `src/hooks/useNotes.js` - Note management

### Main Components
- `src/components/layout/Dashboard.jsx` - Main container
- `src/components/layout/Navigation.jsx` - Top nav
- `src/components/productivity/*` - Todo, Habits, Notes, Focus panels

---

## 🛠️ Common Tasks

### Add a New Component
```bash
# Create component file
touch src/components/[folder]/NewComponent.jsx

# Create CSS module
touch src/components/[folder]/NewComponent.module.css
```

### Add a New Hook
```bash
touch src/hooks/useNewFeature.js
```

### Add a New Constant
```bash
# Edit existing or create new file
src/constants/newConstants.js
```

---

## 🎨 Styling

### Using CSS Modules
```jsx
import styles from './Component.module.css';

function Component() {
  return <div className={styles.container}>Hello</div>;
}
```

### CSS Variables (Available Globally)
```css
var(--gold)         /* #f5a623 */
var(--gold-light)   /* #ffc857 */
var(--gold-dim)     /* rgba(245, 166, 35, 0.3) */
var(--surface)      /* rgba(255, 255, 255, 0.06) */
var(--text)         /* #e8e0d0 */
var(--text-dim)     /* rgba(232, 224, 208, 0.5) */
var(--border)       /* rgba(245, 166, 35, 0.15) */
```

---

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🔧 Customization

### Change Color Theme
Edit `src/constants/colors.js`

### Add New Quotes
Edit `src/constants/quotes.js`

### Add New Music Tracks
Edit `src/constants/audio.js`

### Add New Timezones
Edit `src/constants/timezones.js`

---

## 📱 Features Overview

### Dashboard Panel
- Digital clock
- Day/Week/Month/Year progress rings
- Life progress (if birthdate set)
- Animated starfield
- Sun/moon orb

### Todo Panel
- Add/complete/delete todos
- 5 categories: all, work, personal, health, learning
- Category filtering

### Habit Panel
- Track habits daily
- 7-day week view
- Streak counter
- Add/delete habits

### Notes Panel
- Create/edit/delete notes
- Grid layout
- Modal editor
- Timestamps

### Focus Panel
- Pomodoro timer
- 3 modes: Focus (25m), Short break (5m), Long break (15m)
- Start/pause/reset controls

---

## 💾 Data Storage

All data is stored in browser localStorage:
- `tc-username` - User's name
- `tc-todos` - Todo list
- `tc-habits` - Habit tracking data
- `tc-notes` - Notes
- And more...

**Note**: Data is stored locally in your browser. Clear browser data will delete all information.

---

## 🐛 Troubleshooting

### Port 5173 already in use
```bash
# Kill the process or change port
npm run dev -- --port 3000
```

### CSS changes not reflecting
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

### Component not rendering
- Check console for errors
- Verify imports are correct
- Check if component is exported properly

---

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [date-fns Documentation](https://date-fns.org)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

## 🤝 Contributing

1. Make your changes
2. Test thoroughly
3. Follow the existing code style
4. Keep components small and focused
5. Use custom hooks for business logic

---

## ✨ Tips for Development

1. **Hot Module Replacement (HMR)**: Changes reflect instantly, no page reload
2. **React DevTools**: Install browser extension for debugging
3. **Console Logs**: Check browser console for any errors
4. **LocalStorage Inspector**: View stored data in browser DevTools > Application > Local Storage
5. **Component Structure**: Keep components under 200 lines for maintainability

---

## 🎉 You're Ready!

Your Kairos app is now running. Start exploring the code and building amazing features!

For detailed documentation, see `README.md` and `PROJECT_SUMMARY.md`.
