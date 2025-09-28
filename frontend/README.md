# ProScout Frontend 🎨

Frontend application for the ProScout football scouting platform built with React.js and modern web technologies.

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **React Bootstrap** - UI component library
- **Axios** - HTTP client for API communication
- **Lucide React** - Modern icon library
- **React Hook Form** - Form management and validation

## 📂 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API services and configuration
│   │   ├── services/      # Service modules for different features
│   │   ├── http.js        # Axios configuration
│   │   └── tokenStore.js  # JWT token management
│   ├── auth/              # Authentication context and components
│   ├── components/        # Reusable React components
│   │   ├── actionMenu/    # Action menu components
│   │   ├── dashboard/     # Dashboard layouts
│   │   ├── layout/        # Page layouts
│   │   ├── messages/      # Messaging system
│   │   ├── player/        # Player-related components
│   │   ├── search/        # Search functionality
│   │   ├── scout/         # Scout-related components
│   │   ├── team/          # Team-related components
│   │   └── trials/        # Trial management
│   ├── data/              # Static data and constants
│   ├── hooks/             # Custom React hooks
│   ├── layout/            # Main layout components
│   ├── routes/            # Route definitions and guards
│   ├── styles/            # Global styles and themes
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main App component
│   └── main.jsx           # Application entry point
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v8 or higher)

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code linting

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Optional: Development settings
VITE_DEV_MODE=true
```

### Vite Configuration

The `vite.config.js` is configured with:
- React plugin for JSX support
- Path aliases for cleaner imports
- Development server settings

## 📋 Key Features

### Authentication System
- JWT-based authentication
- Role-based access control (Scout, Team, Player)
- Protected routes and components
- Automatic token refresh

### User Dashboards
- **Scout Dashboard**: Player search, recommendations, messaging
- **Team Dashboard**: Player shortlists, trials, scout communications
- **Player Dashboard**: Profile management, trial applications

### Messaging System
- Real-time messaging between users
- Quick message modals
- Context-aware communication
- Message history and notifications

### Search & Discovery
- Advanced player search with filters
- Real-time search results
- Statistics-based filtering
- Export and sharing capabilities

### AI-Powered Recommendations
- Similar player suggestions
- AI-generated scouting reports
- Team fit analysis
- Performance comparisons

## 🎨 UI/UX Design

### Component Library
- React Bootstrap for consistent UI
- Custom CSS for specific styling
- Responsive design for all screen sizes
- Modern, clean interface

### Navigation
- Intuitive sidebar navigation
- Role-based menu items
- Breadcrumb navigation
- Quick access to key features

### Forms & Validation
- React Hook Form for form management
- Real-time validation feedback
- User-friendly error messages
- Accessible form controls

## 🔌 API Integration

### Service Architecture
- Centralized API service modules
- Axios interceptors for error handling
- Token management and refresh
- Request/response transformation

### Key Services
- `authService` - Authentication and user management
- `playerService` - Player data and statistics
- `messageService` - Messaging functionality
- `searchService` - Search and filtering
- `trialService` - Trial management
- `recommendationService` - AI recommendations

## 🎯 State Management

### Context API
- AuthContext for user authentication state
- Custom hooks for state management
- Local state for component-specific data

### Custom Hooks
- `useAuth` - Authentication state and methods
- `useSearchActions` - Search functionality
- `useMessageModal` - Messaging system
- Form-specific hooks for validation

## 🚦 Routing

### Route Structure
```
/                    # Home/Login page
/scout/dashboard     # Scout dashboard
/team/dashboard      # Team dashboard
/player/dashboard    # Player dashboard
/messages           # Messaging interface
/search             # Search page
/profile/:type/:id  # User profiles
/trial/*            # Trial management
```

### Route Guards
- Authentication required routes
- Role-based access control
- Redirect logic for unauthorized access

## 🔍 Development Guidelines

### Code Structure
- Functional components with hooks
- Component composition patterns
- Custom hooks for reusable logic
- Consistent naming conventions

### Styling Approach
- CSS modules for component styles
- Bootstrap classes for layout
- Responsive design principles
- Consistent color scheme and typography

### Performance Optimization
- Lazy loading for routes
- Memoized components where appropriate
- Efficient API calls and caching
- Image optimization

## 🧪 Testing

### Testing Setup
- Jest configuration for unit tests
- React Testing Library for component tests
- Mock services for API testing

### Running Tests
```bash
npm run test          # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 📱 Responsive Design

- **Mobile-first** approach
- Responsive breakpoints for different screen sizes
- Touch-friendly interface elements
- Optimized performance on mobile devices

## 🔒 Security

- JWT token secure storage
- XSS protection through React
- Input validation and sanitization
- Secure API communication over HTTPS

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options
- Static hosting (Netlify, Vercel)
- CDN deployment
- Docker containerization
- Traditional web server hosting

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Change port in `vite.config.js`
2. **API connection**: Verify VITE_API_BASE_URL in .env
3. **Authentication issues**: Clear localStorage and refresh
4. **Build errors**: Clear node_modules and reinstall

### Development Tools
- React Developer Tools browser extension
- Vite development server with HMR
- ESLint for code quality
- Browser development console

## 📞 Support

For development questions or issues, please refer to:
- React documentation: https://react.dev/
- Vite documentation: https://vitejs.dev/
- React Bootstrap: https://react-bootstrap.netlify.app/

---

*Happy coding! 🚀*
