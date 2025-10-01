# 🍅 Pomodoro Task Manager

A modern, feature-rich Pomodoro timer application built with React, TypeScript, and Material-UI. This application helps you manage your tasks using the Pomodoro Technique while gamifying the experience with a reward system.

## ✨ Features

### Core Pomodoro Features

- **Task Management**: Add, edit, and delete tasks with customizable Pomodoro counts
- **Timer Functionality**: Focus sessions, short breaks, and long breaks
- **Visual Feedback**: Animated timer display with confetti celebrations
- **Progress Tracking**: Track completed Pomodoros for each task
- **Customizable Settings**: Adjust timer durations, notification preferences

### 🎮 New Gamification Features

#### 1. 🍅 Tomato Points System

- **Earn Points**: Gain 1 tomato point for each completed Pomodoro session
- **Daily Tracking**: Monitor daily earned points and total accumulated points
- **Header Display**: Real-time point counter visible in the application header
- **Persistent Storage**: Points are saved locally and persist across browser sessions

#### 2. � Tomato Store (Productivity Store)

- **Enable/Disable**: Toggle Tomato Store mode in settings
- **Power-up Shopping**: Purchase productivity-enhancing items with tomato points
- **Available Items**:
  - **Break Extender** (25 points): Adds +2 minutes to next 5 breaks
  - **Double Points** (50 points): Earn 2x points for next 10 Pomodoros
  - **Time Bank** (120 points): Store unused break time for later use
  - **Task Templates** (50 points): Pre-made task sets for common workflows
- **Inventory Management**: Track owned items and active effects
- **Smart Integration**: Effects automatically apply during timer sessions

#### 3. �🎰 Fortune Tiger Mode (Casino Slot Machine)

- **Enable/Disable**: Toggle Fortune Tiger mode in settings
- **Slot Machine Game**: Interactive 3-reel slot machine with themed symbols
- **Betting System**: Spend tomato points to try winning more points
- **Payout Structure**:
  - 💎💎💎 = 50x bet (Diamond Jackpot)
  - ⭐⭐⭐ = 20x bet (Star Prize)
  - 🍅🍅🍅 = 10x bet (Tomato Bonus)
  - Other combinations with varying multipliers
- **Realistic Gameplay**: Spinning animations, sound effects, and celebration animations
- **Smart Probabilities**: Balanced win/lose ratios for engaging gameplay

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 🎯 How to Use

### Basic Pomodoro Workflow

1. **Add a Task**: Enter your task description and estimated number of Pomodoros needed
2. **Start Focus Session**: Click the play button to begin a 25-minute focus session
3. **Earn Points**: Complete the session to earn 1 tomato point
4. **Take Breaks**: Use short (5 min) or long (15 min) breaks between sessions
5. **Track Progress**: Watch your tomato points accumulate in the header

### Tomato Store

1. **Enable Store**: Go to Settings and toggle "Tomato Store"
2. **Access Store**: Click the "Store" button in the header
3. **Browse Items**: View Power-ups, Utility items, and your inventory
4. **Purchase Items**: Buy items with earned tomato points
5. **Use Effects**: Active effects automatically enhance your sessions

### Fortune Tiger Mode

1. **Enable Mode**: Go to Settings and toggle "Fortune Tiger Mode"
2. **Access Slot Machine**: Click "Casino" button in header
3. **Place Bets**: Choose how many tomato points to wager (minimum 1 point)
4. **Spin to Win**: Hit the spin button and watch the reels
5. **Collect Winnings**: Winning combinations automatically add points to your total

## ⚙️ Settings Configuration

### Timer Settings

- **Focus Duration**: 1-60 minutes (default: 25 min)
- **Short Break**: 1-30 minutes (default: 5 min)
- **Long Break**: 1-60 minutes (default: 15 min)
- **Cycles for Long Break**: 1-10 cycles (default: 4)

### Notification Settings

- **Sound Notifications**: Enable/disable completion sounds
- **Browser Notifications**: Enable/disable browser notification alerts

### Gamification Settings

- **Tomato Store**: Enable/disable the productivity store feature
- **Fortune Tiger Mode**: Enable/disable the slot machine feature

## 🛠️ Technical Stack

- **Frontend**: React 19.1.1 with TypeScript
- **UI Framework**: Material-UI (MUI) v7
- **Build Tool**: Vite v7
- **Animations**: Canvas Confetti for celebrations
- **State Management**: React Context API with custom hooks
- **Data Persistence**: Local Storage for settings, tasks, and points
- **Icons**: Material-UI Icons

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Animation/         # Tomato throw animations
│   ├── Header/           # App header with points display
│   ├── Settings/         # Settings dialog
│   ├── SlotMachine/      # Fortune Tiger slot machine
│   ├── TaskForm/         # Task creation form
│   ├── TaskItem/         # Individual task component
│   ├── TaskList/         # Task list container
│   └── Timer/           # Timer display and views
├── context/             # React Context for state management
├── hooks/              # Custom hooks for functionality
├── theme/              # Material-UI theme configuration
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main application component
```

## 🎨 Features in Detail

### Tomato Points System

- Points are earned automatically upon Pomodoro completion
- Daily counter resets at midnight
- Total points persist indefinitely
- Visual feedback with confetti animations

### Fortune Tiger Slot Machine

- Professional casino-style interface with golden theme
- Realistic spinning animations with progress indicators
- Weighted probability system for balanced gameplay
- Comprehensive payout table with multiple winning combinations
- Celebration effects for wins with confetti animations

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:

- Desktop computers
- Tablets
- Mobile phones
- Progressive Web App (PWA) ready

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with React and TypeScript
- UI components from Material-UI
- Confetti animations from canvas-confetti
- Inspired by the Pomodoro Technique by Francesco Cirillo
