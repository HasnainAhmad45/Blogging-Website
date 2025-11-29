# Modern Blogging Platform

A comprehensive full-stack blogging application featuring user authentication, CRUD operations for blog posts, image upload functionality with Cloudinary storage, and responsive Material-UI design.

## ✨ Features

### Core Functionality
- **User Authentication**: Secure registration and login with JWT authentication
- **Blog Post Management**: Complete CRUD operations (Create, Read, Update, Delete)
- **Image Upload**: Cloudinary integration for efficient image storage and delivery
- **Rich Content Editor**: Create and edit blog posts with formatted text
- **User Profiles**: Personalized author profiles for each blogger
- **Responsive Design**: Mobile-first Material-UI interface
- **Search & Filter**: Find posts by title, author, or tags

### Technical Features
- ✅ RESTful API architecture
- ✅ JWT token-based authentication
- ✅ Secure password hashing with Bcrypt
- ✅ File upload with Multer middleware
- ✅ Cloud storage with Cloudinary
- ✅ MongoDB database with Mongoose ODM
- ✅ Input validation and sanitization
- ✅ Error handling middleware
- ✅ CORS enabled for cross-origin requests

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Material-UI
- Axios
- React Router

**Backend:**
- Express.js
- Node.js
- REST API

**Database:**
- MySQL

**File Storage:**
- Cloudinary

**Security:**
- JWT Authentication
- Bcrypt
- Multer

## 📁 Project Structure

```
blogging-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service calls
│   │   ├── utils/        # Helper functions
│   │   └── App.js        # Main application component
│   └── package.json
│
├── server/                # Express backend
│   ├── config/           # Configuration files
│   │   ├── database.js   # MySQL connection
│   │   └── cloudinary.js # Cloudinary setup
│   ├── controllers/      # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js       # JWT verification
│   │   └── upload.js     # Multer configuration
│   ├── utils/            # Helper utilities
│   └── server.js         # Express application
│
├── .env                  # Environment variables
├── .gitignore
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MySQL (v5.7 or higher)
- Cloudinary account

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/blogging-platform.git
cd blogging-platform
```

### Step 2: Setup Backend

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=blogging_platform

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### Step 3: Setup Database

```sql
CREATE DATABASE blogging_platform;
USE blogging_platform;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    image_url VARCHAR(255),
    author_id INT NOT NULL,
    status ENUM('draft', 'published') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_author (author_id),
    INDEX idx_status (status)
);

CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Step 4: Setup Frontend

```bash
cd ../client
npm install
```

Create a `.env` file in the client directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 5: Run the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm start
```

The application will open at `http://localhost:3000`

## 📖 API Documentation

### Authentication Endpoints

**Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "full_name": "John Doe"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Blog Post Endpoints

**Get All Posts**
```http
GET /api/posts?page=1&limit=10&status=published
```

**Get Single Post**
```http
GET /api/posts/:id
```

**Create Post**
```http
POST /api/posts
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "title": "My Blog Post",
  "content": "Post content here...",
  "excerpt": "Short description",
  "image": [file],
  "status": "published"
}
```

**Update Post**
```http
PUT /api/posts/:id
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Delete Post**
```http
DELETE /api/posts/:id
Authorization: Bearer {token}
```

## 🎨 Usage Guide

### Creating Your First Post

1. **Register/Login**: Create an account or login to existing account
2. **Navigate to Dashboard**: Click "Create Post" button
3. **Write Content**: 
   - Enter a compelling title
   - Write your blog content
   - Add an excerpt (optional)
   - Upload a featured image
4. **Publish**: Choose "Save as Draft" or "Publish" immediately

### Managing Posts

- **Edit**: Click the edit icon on any of your posts
- **Delete**: Click the delete icon with confirmation
- **View Stats**: See view counts and engagement metrics
- **Change Status**: Toggle between draft and published

### User Profile

- Update your profile information
- Change avatar image
- View all your published posts
- Manage drafts

## 🔒 Security Features

- Passwords hashed with Bcrypt (10 rounds)
- JWT tokens for stateless authentication
- Protected routes requiring authentication
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- XSS protection with content sanitization
- File upload validation (type and size limits)
- CORS configuration for allowed origins

## 🚢 Deployment

### Backend (Heroku/Railway)

```bash
# Build and deploy
npm run build
git push heroku main
```

### Frontend (Vercel/Netlify)

```bash
# Build production bundle
npm run build

# Deploy dist folder
```

### Environment Variables for Production

Update all `.env` files with production values:
- Database connection strings
- Cloudinary credentials
- JWT secrets (use strong, random strings)
- CORS origins
- API URLs

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- Image upload limited to 5MB
- Rich text editor needs formatting toolbar enhancement
- Mobile navigation needs improvement

## 🗺️ Roadmap

- [ ] Add comment system
- [ ] Implement tags and categories
- [ ] Add social sharing buttons
- [ ] Email notifications
- [ ] Advanced search functionality
- [ ] Like/favorite posts
- [ ] Follow other users
- [ ] RSS feed generation

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using React, Express.js, MySQL, and Cloudinary**