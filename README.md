# Barbaros - Barber Shop Management System

A modern barber shop management system for appointments and client management.

## Features

- **User Authentication**: Secure login and registration for clients, barbers, and admins
- **Appointment Scheduling**: Easy booking and management of appointments
- **QR Code Integration**: Quick check-in and verification
- **Client Management**: Track client history and preferences
- **Admin Dashboard**: Comprehensive overview of business operations
- **Responsive Design**: Works seamlessly on mobile and desktop

## Tech Stack

- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Form Handling**: React Hook Form with Zod validation
- **Utilities**: QR code generation/scanning, date formatting with dayjs

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/barbaros.git
   cd barbaros-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with:
   ```
   MONGODB_URI=mongodb://localhost:27017/barbaros
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_key_here
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
barbaros-app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (landing)/       # Landing page routes
│   │   ├── (dashboard)/     # Dashboard routes (admin, barber, client)
│   │   ├── api/             # API routes
│   │   └── auth/            # Authentication routes
│   ├── components/          # React components
│   │   ├── ui/              # UI components
│   │   └── shared/          # Shared components
│   └── lib/                 # Utility functions and modules
│       ├── auth/            # Authentication utilities
│       ├── db/              # Database models and connection
│       └── utils/           # Helper functions
├── public/                  # Static files
└── ...
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [NextAuth.js](https://next-auth.js.org/)
