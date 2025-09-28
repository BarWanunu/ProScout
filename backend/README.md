# ProScout Backend 🛡️

Backend API server for the ProScout football scouting platform built with Node.js, Express.js, and PostgreSQL.

## 🛠️ Technology Stack

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **OpenAI API** - AI-powered scouting reports
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📂 Project Structure

```
backend/
├── controller/            # Route controllers
│   ├── loginController.js        # Authentication logic
│   ├── messageController.js      # Messaging system
│   ├── playerController.js       # Player management
│   ├── recommendationController.js # Scout recommendations
│   ├── searchController.js       # Search functionality
│   ├── scoutController.js        # Scout operations
│   ├── shortlistController.js    # Team shortlists
│   ├── statsController.js        # Statistics handling
│   ├── teamController.js         # Team management
│   ├── trialController.js        # Trial management
│   ├── userController.js         # User operations
│   └── recommendationSystemController.js # AI recommendations
├── middleware/            # Custom middleware
│   ├── auth.js           # JWT authentication
│   └── uploadMedia.js    # File upload handling
├── models/               # Database models
│   ├── messageModel.js          # Message data model
│   ├── playerModel.js           # Player data model
│   ├── scoutModel.js            # Scout data model
│   ├── scoutsRecommendationModel.js # Recommendations model
│   ├── searchModel.js           # Search model
│   ├── shortlistedModel.js      # Shortlist model
│   ├── statsModel.js            # Statistics model
│   ├── teamModel.js             # Team data model
│   ├── trialModels.js           # Trial management model
│   └── userModel.js             # User data model
├── routes/               # API route definitions
│   ├── login.js                 # Authentication routes
│   ├── message.js              # Messaging routes
│   ├── player.js               # Player routes
│   ├── recommendation.js       # Recommendation routes
│   ├── scout.js                # Scout routes
│   ├── search.js               # Search routes
│   ├── shortlist.js            # Shortlist routes
│   ├── team.js                 # Team routes
│   ├── trial.js                # Trial routes
│   ├── user.js                 # User routes
│   └── recommendationsSystem.js # AI system routes
├── startup/              # Application initialization
│   ├── db.js            # Database connection
│   └── routes.js        # Route registration
├── uploads/              # File upload storage
│   ├── players/         # Player images
│   ├── scouts/          # Scout images
│   └── teams/           # Team logos
├── utils/               # Utility functions
│   ├── controllerUtils.js      # Controller helpers
│   ├── existsUtils.js          # Existence validators
│   ├── fetchUserProfile.js     # Profile fetchers
│   ├── imageUtils.js           # Image processing
│   ├── presetStats.js          # Preset statistics
│   ├── roleUtils.js            # Role management
│   ├── token.js                # Token utilities
│   ├── userUtils.js            # User utilities
│   └── validationUtils.js      # Validation helpers
├── validations/          # Input validation
│   ├── playerValidation.js     # Player validation rules
│   ├── scoutValidation.js      # Scout validation rules
│   ├── teamValidation.js       # Team validation rules
│   └── userValidation.js       # User validation rules
├── .env                 # Environment variables
├── index.js             # Application entry point
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **PostgreSQL** (v13 or higher)

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=proscout
   DB_USER=your_username
   DB_PASSWORD=your_password
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   
   # OpenAI Configuration (for AI features)
   OPENAI_API_KEY=your_openai_api_key_here
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:5173
   ```

4. **Set up the database:**
   
   Create a PostgreSQL database and run the required SQL scripts:
   ```sql
   CREATE DATABASE proscout;
   
   -- Run your database schema scripts here
   -- (players, teams, scouts, messages, etc.)
   ```

5. **Start the development server:**
   ```bash
   npm start
   ```
   
   or for development with auto-restart:
   ```bash
   npm run dev  # if nodemon is configured
   ```

6. **Server will be running:**
   The API will be available at `http://localhost:3000`

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon (if configured)
- `npm test` - Run tests (if configured)

## 🗃️ Database Setup

### PostgreSQL Database Schema

The application requires several tables to be set up in your PostgreSQL database:

#### Core Tables
- `users` - User accounts (scouts, teams, players)
- `players` - Player profiles and information
- `teams` - Team profiles and information
- `scouts` - Scout profiles and information
- `messages` - Messaging system
- `trials` - Trial management
- `shortlisted_players` - Team shortlists
- `scouts_recommendations` - Scout recommendations

#### Statistics Tables
- `player_stats` - Player performance statistics
- `proscout_player_stats` - Enhanced player statistics with embeddings
- `proscout_player_stats_raw` - Raw statistics data

### Database Connection

The application uses a connection pool for PostgreSQL:
```javascript
// Database configuration in startup/db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
```

## 🔐 Authentication & Authorization

### JWT Authentication

The application uses JSON Web Tokens for authentication:
- Tokens are generated on successful login
- Tokens include user ID and role information
- Protected routes require valid tokens
- Middleware validates tokens on each request

### Role-Based Access Control

Three user roles are supported:
- **Scout**: Can search players, create recommendations, send messages
- **Team**: Can manage shortlists, organize trials, communicate with scouts
- **Player**: Can manage profile, apply for trials, communicate

### Authentication Middleware

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  // Token validation logic
};
```

## 📡 API Endpoints

### Authentication Routes (`/api/login`)
- `POST /login` - User login
- `POST /register` - User registration
- `POST /refresh` - Token refresh

### User Management (`/api/user`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `POST /upload-image` - Upload profile image

### Player Routes (`/api/player`)
- `GET /` - Get all players
- `GET /:id` - Get specific player
- `PUT /:id` - Update player profile
- `POST /` - Create player profile

### Team Routes (`/api/team`)
- `GET /` - Get all teams
- `GET /:id` - Get specific team
- `PUT /:id` - Update team profile
- `POST /` - Create team profile

### Search Routes (`/api/search`)
- `POST /players` - Search players
- `POST /teams` - Search teams
- `POST /scouts` - Search scouts
- `POST /players/stats` - Search players by statistics

### Messaging Routes (`/api/message`)
- `GET /` - Get user messages
- `POST /` - Send message
- `GET /conversation/:userId` - Get conversation with user
- `PUT /:messageId/read` - Mark message as read

### Trial Routes (`/api/trial`)
- `GET /` - Get user trials
- `POST /` - Create trial invitation
- `PUT /:id/status` - Update trial status
- `DELETE /:id` - Cancel trial

### Recommendation Routes (`/api/recommendation`)
- `GET /` - Get recommendations
- `POST /` - Create recommendation
- `DELETE /:id` - Delete recommendation

### AI System Routes (`/api/recommendations-system`)
- `GET /players` - Get all players for search
- `GET /similar/:playerRk` - Get similar players
- `POST /generate-report` - Generate AI scouting report
- `GET /player-image` - Get player image URL

## 🤖 AI Integration

### OpenAI Integration

The platform uses OpenAI's GPT-3.5-turbo for generating scouting reports:

```javascript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate scouting report
const response = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [/* ... */],
});
```

### Cosine Similarity Algorithm

Player similarity calculations use cosine similarity:

```javascript
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
```

## 📁 File Upload System

### Multer Configuration

File uploads are handled using Multer:
- Player images stored in `uploads/players/`
- Scout images stored in `uploads/scouts/`
- Team logos stored in `uploads/teams/`
- File size limits and type validation
- Automatic file naming with timestamps

### Upload Middleware

```javascript
// middleware/uploadMedia.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Dynamic destination based on user type
  },
  filename: (req, file, cb) => {
    // Generate unique filename
  }
});
```

## 🔍 Search Functionality

### Multi-criteria Search

The search system supports:
- **Text-based search**: Name, nationality, position
- **Statistical filters**: Goals, assists, rating ranges
- **Demographic filters**: Age, position, league
- **Advanced filters**: Team preferences, playing style

### Search Models

```javascript
// models/searchModel.js
class SearchModel {
  static async searchPlayers(criteria) {
    // Complex SQL queries with multiple joins
    // Filter and sort logic
    // Return formatted results
  }
}
```

## 📊 Statistics Integration

### Player Statistics

The system manages comprehensive player statistics:
- **Basic stats**: Goals, assists, appearances
- **Advanced metrics**: xG, xA, pass completion
- **Defensive stats**: Tackles, interceptions, blocks
- **Goalkeeper stats**: Saves, clean sheets, distribution

### Statistics Processing

- Data normalization and validation
- Statistical calculations and derivations
- Performance trend analysis
- Comparative statistics generation

## 🛡️ Security Features

### Input Validation

All inputs are validated using custom validation functions:
```javascript
// validations/userValidation.js
const validateUserInput = (userData) => {
  // Validation logic
  // Return sanitized data
};
```

### SQL Injection Prevention

- Parameterized queries
- Input sanitization
- Prepared statements

### Password Security

```javascript
const bcrypt = require('bcryptjs');

// Hash password
const hashedPassword = await bcrypt.hash(password, 12);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

## 🚀 Deployment

### Production Build

1. **Set production environment variables:**
   ```env
   NODE_ENV=production
   PORT=3000
   # Production database credentials
   # Production JWT secrets
   ```

2. **Install production dependencies:**
   ```bash
   npm ci --only=production
   ```

3. **Start the application:**
   ```bash
   npm start
   ```

### Deployment Options

- **VPS/Cloud Server**: Direct deployment with PM2
- **Docker**: Containerized deployment
- **Heroku**: Platform-as-a-Service deployment
- **AWS/Azure**: Cloud platform deployment

### Process Management (PM2)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start index.js --name proscout-backend

# Monitor processes
pm2 monitor
```

## 🔧 Development Tools

### Database Management

```bash
# Connect to PostgreSQL
psql -h localhost -U username -d proscout

# Run database migrations
npm run migrate  # if configured

# Seed database
npm run seed     # if configured
```

### API Testing

Use tools like Postman or curl to test API endpoints:

```bash
# Test authentication
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test protected route
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer your_jwt_token_here"
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Check PostgreSQL is running
   - Verify connection credentials in .env
   - Ensure database exists

2. **Port Conflicts**:
   - Change PORT in .env file
   - Check if port is already in use: `netstat -an | grep 3000`

3. **JWT Issues**:
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper token format

4. **File Upload Issues**:
   - Check upload directory permissions
   - Verify file size limits
   - Ensure proper file types

### Logging

Add comprehensive logging for debugging:

```javascript
// Add to controllers
console.log('Request received:', req.body);
console.error('Error occurred:', error);

// Use morgan for HTTP request logging
const morgan = require('morgan');
app.use(morgan('combined'));
```

## 📞 Support

For development questions or issues:
- Node.js documentation: https://nodejs.org/docs/
- Express.js documentation: https://expressjs.com/
- PostgreSQL documentation: https://www.postgresql.org/docs/

---

*Keep coding! 🚀*
