# Voting App Frontend Documentation

A beautiful, modern React frontend for the Voting Application built with Vite, Tailwind CSS, and Framer Motion.

## 🚀 Quick Start

1. **Start the backend**: Ensure your Spring Boot backend is running on port 8080
2. **Install dependencies**: `npm install`
3. **Start frontend**: `npm run dev`
4. **Open browser**: Visit `http://localhost:5173`

## 🎯 Demo Credentials

- **Admin**: username: `admin`, password: `admin123`
- **User**: username: `user1`, password: `password`

## 📱 Features

### 🔐 Authentication System
- Beautiful login/register forms with animations
- Role-based access (User/Admin)
- Persistent login sessions
- Form validation and error handling

### 🗳️ Voting Dashboard
- View all candidates with vote counts
- One-click voting system
- Real-time results with animated progress bars
- Vote statistics and leading candidate display
- Responsive card-based layout

### 👨‍💼 Admin Panel
- Add new candidates
- Edit existing candidates  
- Delete candidates with confirmation
- Real-time candidate management
- Admin-only access control

### 🎨 Modern UI/UX
- Gradient backgrounds and modern styling
- Smooth page transitions with Framer Motion
- Loading states and spinners
- Error handling with user-friendly messages
- Mobile-responsive navigation
- Custom scrollbars and hover effects

## 🛠️ Tech Stack

- **React 18** with modern hooks
- **Vite** for lightning-fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API calls
- **Lucide React** for icons

## 🔌 API Configuration

Backend URL is configured in `src/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## 📁 Project Structure

```
src/
├── components/
│   ├── AuthPage.jsx           # Login/Register
│   ├── VotingDashboard.jsx    # Main voting interface
│   ├── AdminPanel.jsx         # Admin management
│   ├── Header.jsx             # Navigation
│   ├── LoadingSpinner.jsx     # Loading states
│   └── ErrorBoundary.jsx      # Error handling
├── contexts/
│   └── AuthContext.jsx        # Authentication state
├── api.js                     # API service layer
├── App.jsx                    # Main app component
└── index.css                  # Global styles + Tailwind
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

Built with ❤️ for modern voting systems