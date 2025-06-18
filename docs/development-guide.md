# Development Guide

## Getting Started

This guide provides instructions for setting up the development environment and working with the Barbaros barbershop management system.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18.0.0 or later)
- npm (v9.0.0 or later)
- MongoDB (v6.0.0 or later) or MongoDB Atlas account
- Git

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/barbaros.git
cd barbaros/barbaros-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/barbaros

# NextAuth configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here

# Other environment variables
NODE_ENV=development
```

Replace `your_nextauth_secret_key_here` with a strong random string. For production, use a properly generated secret.

## Development Workflow

### Starting the Development Server

```bash
npm run dev
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

### Database Seeding

To seed the database with sample data, you can use the provided API endpoint:

```bash
curl -X POST http://localhost:3000/api/seed -H "Content-Type: application/json" -d '{"force": true}'
```

Or visit [http://localhost:3000/api/seed-test](http://localhost:3000/api/seed-test) in your browser and use the UI.

### Default Admin Credentials

After seeding, you can use the following credentials to log in as an admin:

- **Email**: admin@barbaros.com
- **Password**: admin123

## Project Structure

The project follows a standard Next.js App Router structure with some additional organization:

```
barbaros-app/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (landing)/      # Landing page routes
│   │   ├── (dashboard)/    # Dashboard routes
│   │   │   ├── admin/      # Admin dashboard
│   │   │   └── client/     # Client dashboard
│   │   ├── api/            # API endpoints
│   │   ├── login/          # Authentication pages
│   │   └── register/       # Registration pages
│   ├── components/         # React components
│   │   ├── shared/         # Shared components
│   │   └── ui/             # UI components
│   └── lib/                # Utility libraries
│       ├── auth/           # Authentication utilities
│       ├── db/             # Database utilities
│       │   ├── api/        # Database API utilities
│       │   ├── models/     # MongoDB models
│       │   ├── mongodb.ts  # MongoDB connection
│       │   └── seed.ts     # Database seeding
│       └── utils/          # Utility functions
├── docs/                   # Documentation
├── public/                 # Static assets
└── ...                     # Configuration files
```

## Code Style and Conventions

### TypeScript

- Use TypeScript for all new code
- Define interfaces for all data structures
- Use proper type annotations for function parameters and return types
- Avoid using `any` type when possible

### React Components

- Use functional components with hooks
- Use TypeScript interfaces for component props
- Keep components focused on a single responsibility
- Use the `components/ui` directory for reusable UI components
- Use the `components/shared` directory for shared business logic components

### API Routes

- Implement RESTful API routes in the `app/api` directory
- Use proper HTTP status codes
- Return consistent response formats
- Handle errors gracefully
- Validate input data

### Database Operations

- Use the database API utilities in `lib/db/api` for all database operations
- Follow the established patterns for CRUD operations
- Handle errors and edge cases
- Use proper validation before saving data

## Testing

### Running Tests

```bash
npm test
```

### Writing Tests

- Write unit tests for utility functions
- Write integration tests for API endpoints
- Write component tests for React components
- Use Jest and React Testing Library

## Deployment

### Building for Production

```bash
npm run build
```

### Starting Production Server

```bash
npm start
```

### Environment Variables for Production

For production deployment, ensure the following environment variables are set:

- `MONGODB_URI`: MongoDB connection string
- `NEXTAUTH_URL`: The canonical URL of your site
- `NEXTAUTH_SECRET`: A secure random string for NextAuth.js
- `NODE_ENV`: Set to `production`

## Contributing

### Branching Strategy

- `main`: Production-ready code
- `develop`: Development branch
- Feature branches: `feature/feature-name`
- Bug fix branches: `fix/bug-name`

### Pull Request Process

1. Create a new branch from `develop`
2. Make your changes
3. Run tests
4. Submit a pull request to `develop`
5. Request a code review
6. Address feedback
7. Merge to `develop`

### Code Review Guidelines

- Check for code style compliance
- Verify that tests pass
- Ensure documentation is updated
- Look for potential security issues
- Verify that the code meets requirements

## Troubleshooting

### Common Issues

#### MongoDB Connection Issues

- Verify that MongoDB is running
- Check the connection string in `.env.local`
- Ensure network connectivity to the MongoDB server

#### NextAuth.js Issues

- Verify that `NEXTAUTH_SECRET` is set
- Check that `NEXTAUTH_URL` matches your development URL
- Ensure that the database connection is working

#### Build Errors

- Clear the `.next` directory and rebuild
- Ensure all dependencies are installed
- Check for TypeScript errors

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org/)

## Authentication System

### Overview

The application uses NextAuth.js for authentication. The authentication system supports two user types:

1. **Admin users**: Staff members who can access the admin dashboard
2. **Client users**: Customers who can access the client portal

### Setting Up Authentication

1. Make sure you have the required dependencies:

```bash
npm install next-auth@4.24.11 @next-auth/mongodb-adapter@1.1.3 bcrypt @types/bcrypt mongodb@5.9.2 mongoose@7.6.3
```

2. Configure the NextAuth provider in `src/app/api/auth/[...nextauth]/route.ts`
3. Set up the middleware in `src/middleware.ts` to protect routes
4. Create login and registration pages

### Authentication Flow

#### Admin Authentication
- Admin users log in through the `/login` page
- Select "Admin" user type
- Credentials are verified against the Admin collection
- On successful login, redirected to `/admin` dashboard

#### Client Authentication
- Client users log in through the `/login` page
- Select "Client" user type (default)
- Credentials are verified against the Client collection
- On successful login, redirected to `/client` dashboard

#### Client Registration
- New clients can register through the `/register` page
- Registration form collects:
  - First and last name
  - Email address
  - Phone number
  - Password (with confirmation)
- System validates input and checks for duplicate emails
- On successful registration, client is automatically logged in

### Protected Routes

Routes are protected using both server-side middleware and client-side components:

1. **Middleware**: `src/middleware.ts` protects routes at the request level
2. **AuthCheck Component**: `src/components/shared/AuthCheck.tsx` provides client-side protection

Example usage of AuthCheck:

```tsx
// For admin-only routes
<AuthCheck adminOnly>
  <AdminDashboard />
</AuthCheck>

// For client-only routes
<AuthCheck clientOnly>
  <ClientDashboard />
</AuthCheck>
```

### Environment Variables

Make sure to set up the following environment variables for authentication:

```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=your-mongodb-connection-string
```

## Database Connection

The application uses MongoDB for data storage, with Mongoose as the ODM. The database connection is managed in `src/lib/db/mongodb.ts`.

### Database Status Checking

Both admin and client dashboards include database status checking. The status is fetched from the `/api/db-status` endpoint.

If you encounter database connection issues:

1. Check that your MongoDB connection string is correct in `.env`
2. Ensure MongoDB is running and accessible
3. Check for compatibility issues between MongoDB, Mongoose, and the NextAuth MongoDB adapter
4. Use the `/api/test-db` endpoint for detailed connection diagnostics

## QR Code System

### Overview

The Barbaros system uses QR codes for client identification and loyalty tracking. Each client is assigned a unique QR code, which can be scanned by admins to quickly access client information and record visits.

### QR Code Generation

- When a client is created, a unique `qrCodeId` is generated and stored in the client record.
- The QR code can be retrieved via the API endpoint: `/api/clients/qrcode/:id`.
- The QR code encodes the `qrCodeId` and is optimized for easy scanning.
- The client dashboard displays the QR code using the `QRCodeDisplay` component, allowing clients to download or share their code.

### QR Code Scanning (Admin Dashboard)

- The admin dashboard includes a scanner interface (`/admin/scanner`) using the `QRCodeScanner` component.
- Admins can scan a client's QR code using the device camera (mobile/tablet supported).
- After a successful scan, the client information is displayed using the `ClientInfoCard` component.
- Manual lookup is available as an alternative, allowing search by email or phone.
- Recent scans are listed for quick re-access.

### API Endpoints

- `GET /api/clients/qrcode/:id`: Retrieve or generate a QR code for a client.
- `POST /api/clients/qrcode/:id`: Regenerate a QR code (admin only).
- `GET /api/clients/search?email=...` or `?phone=...`: Search for a client by email or phone.

### Components

- `QRCodeDisplay`: Displays a QR code for a client, with download/share options.
- `QRCodeScanner`: Scans QR codes using the device camera.
- `ClientLookup`: Manual client search by email or phone.
- `ClientInfoCard`: Displays client details after scan or lookup.

### Usage in Development

- To test QR code generation, create a client and visit their dashboard or use the API endpoint.
- To test scanning, use the admin dashboard scanner page on a device with a camera.
- All QR code logic is implemented in `src/lib/utils/qrcode.ts` and related UI components. 