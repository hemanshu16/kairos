# Kairos - Time Visualization & Productivity App

A beautiful React application for visualizing time passage and managing productivity. Built with modern React practices and industry-standard architecture.

## Features

### Time Visualizations
- **Digital Clock**: Real-time clock display
- **Progress Rings**: Visual progress for Day, Week, Month, and Year
- **Life Progress**: Track your life journey (optional, requires birthdate)
- **Dynamic Sky**: Animated starfield background
- **Sun/Moon Orb**: Realistic celestial body that follows time of day

### Productivity Suite
- **Todos**: Organize tasks by categories (work, personal, health, learning)
- **Habits**: Track daily habits with 7-day week view and streak counter
- **Notes**: Create and manage rich text notes
- **Focus Timer**: Pomodoro timer with Focus (25m), Short Break (5m), and Long Break (15m) modes

### User Experience
- **Persistent Data**: All data saved to localStorage
- **Responsive Design**: Works on desktop and mobile devices
- **Beautiful UI**: Glass-morphism design with smooth animations
- **Dark Theme**: Easy on the eyes with golden accents

## Tech Stack

- **React 18**: Latest React with hooks
- **Vite**: Lightning-fast build tool
- **Framer Motion**: Smooth animations
- **date-fns**: Modern date utility library
- **CSS Modules**: Scoped styling

## Project Structure

```
src/
├── components/
│   ├── layout/           # Navigation, Dashboard, Panels
│   │   ├── Dashboard.jsx
│   │   ├── DashboardPanel.jsx
│   │   └── Navigation.jsx
│   ├── time/             # Time visualization components
│   │   ├── Clock.jsx
│   │   └── ProgressRing.jsx
│   ├── productivity/     # Todo, Habit, Notes, Focus
│   │   ├── TodoPanel.jsx
│   │   ├── HabitPanel.jsx
│   │   ├── NotesPanel.jsx
│   │   └── FocusPanel.jsx
│   ├── ui/               # Reusable UI components
│   │   └── NameModal.jsx
│   └── effects/          # Visual effects
│       ├── Starfield.jsx
│       └── SunMoonOrb.jsx
├── hooks/                # Custom React hooks
│   ├── useLocalStorage.js
│   ├── useTime.js
│   ├── useTodos.js
│   ├── useHabits.js
│   └── useNotes.js
├── contexts/             # React Context for global state
│   └── AppContext.jsx
├── utils/                # Helper functions
│   ├── timeUtils.js
│   └── storageKeys.js
├── constants/            # App constants
│   ├── colors.js
│   ├── quotes.js
│   ├── timezones.js
│   └── audio.js
└── styles/               # Global styles
    └── global.css
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

## Key Features Implementation

### Custom Hooks

**useTime**: Provides real-time clock and all time-based calculations
```javascript
const { now, time, date, greeting, day, week, month, year, life } = useTime(birthDate, lifeExpectancy);
```

**useTodos**: Complete todo management
```javascript
const { todos, addTodo, toggleTodo, deleteTodo, getTodosByCategory, getStats } = useTodos();
```

**useHabits**: Habit tracking with streaks
```javascript
const { habits, addHabit, toggleHabitDay, deleteHabit, getWeekDays, getStreak } = useHabits();
```

**useNotes**: Note CRUD operations
```javascript
const { notes, addNote, updateNote, deleteNote, getNote } = useNotes();
```

**useLocalStorage**: Persistent storage with JSON serialization
```javascript
const [value, setValue] = useLocalStorage('key', initialValue);
```

### Context API

The `AppContext` manages global state:
- User data (username, birthdate, life expectancy)
- Preferences (timezone, 24-hour format, theme)
- Premium status
- UI state (active panel, modals)

### Time Calculations

All time calculations are centralized in `utils/timeUtils.js`:
- Progress percentages for different time periods
- Time remaining calculations
- Greeting based on time of day
- Sky color interpolation

### Data Persistence

All user data is automatically saved to localStorage:
- Todos with categories and completion status
- Habits with completion dates and streaks
- Notes with timestamps
- User preferences and settings

## Component Architecture

### Layout Components
- **Dashboard**: Main app container, manages routing between panels
- **Navigation**: Top navigation bar with panel switching
- **DashboardPanel**: Home view with time visualizations

### Time Components
- **Clock**: Digital clock display
- **ProgressRing**: Reusable circular progress indicator with SVG

### Productivity Components
- **TodoPanel**: Full-featured todo list with categories
- **HabitPanel**: Habit tracker with weekly view
- **NotesPanel**: Grid-based notes with modal editor
- **FocusPanel**: Pomodoro timer with progress ring

### Effect Components
- **Starfield**: Canvas-based animated starfield (180 stars)
- **SunMoonOrb**: Animated sun/moon following elliptical orbit

## Styling Approach

- **CSS Modules**: Component-scoped styling
- **CSS Variables**: Consistent theming via `:root` variables
- **Glass-morphism**: Modern UI with `backdrop-filter: blur()`
- **Responsive**: Mobile-first approach with media queries

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Future Enhancements (Phase 2)

- Backend integration for cloud sync
- User authentication
- Social features (share stats)
- Advanced analytics
- Custom themes
- Export/import data
- Timezone support
- Quote customization
- Background music player
- Activity logging
- Premium features

## Development Guidelines

### Adding a New Feature

1. Create component in appropriate folder
2. Create associated CSS module
3. Add custom hook if state management needed
4. Update AppContext if global state required
5. Add constants if needed
6. Test thoroughly

### Code Style

- Use functional components with hooks
- Prefer named exports for utilities
- Use default exports for components
- Keep components small and focused
- Extract business logic to custom hooks
- Use CSS Modules for styling

### State Management

- Local state: `useState` for component-only state
- Shared state: Custom hooks with `useLocalStorage`
- Global state: Context API for app-wide state
- Side effects: `useEffect` with proper cleanup

## License

MIT License - Feel free to use this project as a template!

## Credits

Design inspired by time visualization and productivity apps. Built from scratch with React.
