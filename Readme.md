# Event Management System

## About the project
The Event Management System is a comprehensive platform designed to streamline the organization and discovery of events. It serves three distinct user roles: **Admins**, **Event Organizers**, and **Attendees**. The platform empowers organizers to manage their events efficiently while providing attendees with a seamless experience to discover, book, and review events.

This Project is part of a course work of Application Development Lab in IIT Madras BS Degree Programme.

## Functionality
- ✅ **Admin Dashboard**: Manage users, approve organizer registrations, and handle reported events to ensure platform integrity.
- ✅ **Event Organizer Dashboard**: Create, edit, and manage events. View attendee lists and configure dynamic ticketing options.
- ✅ **Attendee Experience**: Register, login, browse upcoming events, book tickets, and view booking history.
- ✅ **Authentication**: Secure login and registration using JWT (with refresh tokens) and Google OAuth.
- ✅ **Event Discovery**: Search and filtering by keyword, category, location, date.
- ✅ **Ticketing System**: Support for waitlist tickets.
- ✅ **Reviews & Ratings**: Attendees can leave feedback and ratings for events they have attended.
- ✅ **Media Support**: Integration with AWS S3 for uploading event banners and teaser videos.
- ✅ **Profile Management**: Users can update their profiles, including bio and profile pictures.
- ✅ **Responsive Design**: The platform is designed to be responsive and accessible on all devices.


## How to run the project (Development)

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL
- AWS S3 Bucket (for media uploads)
- Google Cloud Console Project (for OAuth)

### 1. Clone the repository
```bash
git clone <repository_url>
cd event-management-system-adl-project
```

### 2. Backend Setup
Navigate to the server directory:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_NAME=event_management_db
JWT_SECRET=your_super_secret_jwt_key
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ADMIN_EMAIL=admin@example.com
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name
CLIENT_URL=http://localhost:5173
```

Start the development server:
```bash
npm run dev
```

### 3. Frontend Setup
Navigate to the client directory:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory (optional, defaults are usually set in code or vite config, but good for custom overrides):
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:3000/api
```

Start the client application:
```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

## Features

### Authentication & Security
- **Role-Based Access Control (RBAC)**: Distinct permissions for Admins, Organizers, and Attendees.
- **JWT Authentication With Token Rotation**: Secure stateless authentication with short-lived access tokens and secure refresh token rotation.
- **Google OAuth**: Seamless social login integration.

### Frontend Architecture
- **React**: Built with React 19 for a modern, component-based UI.
- **Vite**: Fast build tool and development server.
- **React Query (@tanstack/react-query)**: Powerful asynchronous state management for caching and synchronizing server state.
- **Redux Toolkit**: Global state management for user sessions and UI states.
- **CSS3**: Custom styling for a modern and responsive design.
- **React Router**: Client-side routing.
- **Lucide React**: Modern and clean icon set.

### Backend Architecture
- **Node.js & Express**: Robust and scalable server-side framework.
- **TypeORM**: TypeScript ORM for interacting with the PostgreSQL database using entities and relationships.
- **PostgreSQL**: Reliable relational database system.
- **AWS S3 Integration**: Secure and scalable storage for user-uploaded content (images, videos).
