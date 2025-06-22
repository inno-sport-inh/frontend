# Sport Booking System

A modern React frontend for sports event booking system built with TypeScript, Vite, and TailwindCSS.

## Features

- 📅 **Schedule Management** - View and book sports activities with calendar interface
- 📊 **Training History** - Track your fitness progress and completed sessions
- ❓ **FAQ Section** - Get answers to frequently asked questions
- 🏆 **Sports Clubs** - Discover and join various sports clubs
- 📱 **Responsive Design** - Optimized for mobile and desktop devices
- 🎨 **InnoNoHassle Design** - Clean dark theme with purple accents

## Tech Stack

- **React 18** - Modern React with functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd sport-frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── TopBar.tsx      # Navigation bar
│   └── CheckoutModal.tsx # Booking cancellation modal
├── pages/              # Page components
│   ├── SchedulePage.tsx # Main schedule with calendar
│   ├── HistoryPage.tsx  # Training history and stats
│   ├── FAQPage.tsx      # FAQ with accordion
│   └── ClubsPage.tsx    # Sports clubs listing
├── store/              # State management
│   └── useAppStore.ts   # Zustand store
├── data/               # Mock data
│   └── mockData.ts      # Sample data for development
├── types/              # TypeScript type definitions
│   └── index.ts         # Common interfaces
└── App.tsx             # Main app component
```

## Features Overview

### Schedule Page
- Weekly calendar view with swipe navigation
- View available time slots for Table Tennis
- Book free slots or cancel existing bookings
- Real-time status updates (Free/Booked)

### History Page  
- Fitness test status and results
- Exercise progress tracking (Push-ups, Crunches, etc.)
- Training hours completion
- Recent activity timeline

### FAQ Page
- Expandable accordion interface
- Common questions about booking and sports
- Contact support section

### Clubs Page
- Sports club listings with descriptions
- Club details (members, location, schedule)
- Join club functionality
- Featured activities section

## Mock Data

The application uses mock data instead of real API calls for development:

- **Activities**: Sample Table Tennis schedule with different time slots
- **User Stats**: Fitness test results and exercise progress
- **FAQ**: Common questions and answers
- **Clubs**: List of available sports clubs

All API calls are simulated with `setTimeout` to mimic real loading states.

## Styling

The application follows the InnoNoHassle design system:

- **Colors**: Dark theme with gray tones and purple accents (#9747FF, #B379FF)
- **Typography**: Clean, modern fonts with proper hierarchy
- **Components**: Consistent spacing, borders, and hover effects
- **Responsive**: Mobile-first design with breakpoints

## State Management

Uses Zustand for simple and efficient state management:

- Activity booking/cancellation
- Loading states
- User data persistence

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.