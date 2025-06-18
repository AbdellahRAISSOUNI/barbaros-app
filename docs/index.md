# Barbaros App Documentation

## Overview

Barbaros is a barbershop loyalty application built with Next.js and MongoDB. The application provides features for both barbershop staff and clients.

## Features

### Admin Features
- Client management
- Service management
- Visit tracking
- Reward management
- Dashboard with analytics

### Client Features
- Self-registration and login
- Appointment booking
- Visit history
- Reward tracking
- QR code for quick check-in

## Authentication

The application uses NextAuth.js for authentication and supports two user types:

1. **Admin users**: Staff members who can access the admin dashboard
2. **Client users**: Customers who can access the client portal

For detailed information about authentication, see [Authentication](./authentication.md).

## API Endpoints

The application provides a set of API endpoints for interacting with the database. For detailed information about API endpoints, see [API Endpoints](./api-endpoints.md).

## Data Models

The application uses MongoDB as its database, with Mongoose as the ODM library. For detailed information about data models, see [Data Models](./data-models.md).

## Development

For information on development setup and guidelines, see [Development Guide](./development-guide.md).

## Database

For information on database setup, see [Database Setup](./database-setup.md).

For information on database seeding, see [Database Seeding](./database-seeding.md). 