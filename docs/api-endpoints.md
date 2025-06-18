# API Endpoints

## Overview

The Barbaros system provides a set of API endpoints for interacting with the database. These endpoints are implemented using Next.js API routes and follow RESTful principles.

## Database API Utilities

The API utilities are organized in the `src/lib/db/api` directory and provide functions for interacting with the database models.

### Client API

Located in `src/lib/db/api/clientApi.ts`, these utilities provide functions for managing clients.

| Function | Description |
|----------|-------------|
| `createClient` | Creates a new client |
| `getClientById` | Gets a client by ID |
| `getClientByClientId` | Gets a client by client ID |
| `getClientByEmail` | Gets a client by email |
| `updateClient` | Updates a client |
| `deleteClient` | Deletes a client |
| `listClients` | Lists all clients with pagination |
| `updateClientVisitCount` | Updates a client's visit count |
| `searchClients` | Searches for clients |

**New fields:**
- `qrCodeId`: Unique identifier for QR code (used for client identification)
- `qrCodeUrl`: API URL to retrieve the QR code image

#### Example: Creating a Client

```typescript
import { createClient } from '@/lib/db/api/clientApi';

const newClient = await createClient({
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '555-123-4567',
  passwordHash: 'hashedPassword',
});
```

#### Example: Generating a Client QR Code

```typescript
// Get the QR code for a client
const response = await fetch(`/api/clients/qrcode/${clientId}`);
const data = await response.json();
console.log(data.qrCode); // Data URL for QR code image
```

### Service API

Located in `src/lib/db/api/serviceApi.ts`, these utilities provide functions for managing services.

| Function | Description |
|----------|-------------|
| `createService` | Creates a new service |
| `getServiceById` | Gets a service by ID |
| `updateService` | Updates a service |
| `deleteService` | Deletes a service |
| `listServices` | Lists all services with pagination |
| `getServicesByCategory` | Gets services by category |
| `updateServicePopularity` | Updates a service's popularity score |

#### Example: Listing Services

```typescript
import { listServices } from '@/lib/db/api/serviceApi';

const { services, pagination } = await listServices(1, 10, { isActive: true });
```

### Visit API

Located in `src/lib/db/api/visitApi.ts`, these utilities provide functions for managing visits.

| Function | Description |
|----------|-------------|
| `createVisit` | Creates a new visit |
| `getVisitById` | Gets a visit by ID |
| `updateVisit` | Updates a visit |
| `deleteVisit` | Deletes a visit |
| `listVisits` | Lists all visits with pagination |
| `getVisitsByClient` | Gets visits by client |
| `getVisitsByDateRange` | Gets visits by date range |

#### Example: Creating a Visit

```typescript
import { createVisit } from '@/lib/db/api/visitApi';

const newVisit = await createVisit({
  clientId: clientId,
  services: [
    {
      serviceId: serviceId,
      name: 'Regular Haircut',
      price: 25,
      duration: 30,
    },
  ],
  barber: 'Mike Johnson',
});
```

## API Endpoints

The API endpoints are implemented as Next.js API routes in the `src/app/api` directory.

### Authentication Endpoints

#### Login (NextAuth)

```
POST /api/auth/[...nextauth]
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "userType": "admin" // or "client"
}
```

Response:
```json
{
  "user": {
    "id": "...",
    "name": "User Name",
    "email": "user@example.com",
    "role": "owner", // or "barber", "receptionist", "client"
    "userType": "admin" // or "client"
  },
  "expires": "2023-07-18T20:30:00.000Z"
}
```

#### Client Registration

```
POST /api/register
```

Request body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "555-123-4567",
  "password": "securePassword123"
}
```

Response:
```json
{
  "success": true,
  "message": "Registration successful",
  "client": {
    "id": "...",
    "clientId": "C12345678",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "555-123-4567",
    "dateCreated": "2023-06-18T18:30:00.000Z"
  }
}
```

Error response (duplicate email):
```json
{
  "success": false,
  "message": "Email already in use"
}
```

#### Database Status Check

```
GET /api/db-status
```

Response:
```json
{
  "success": true,
  "connected": true,
  "data": {
    "status": 1,
    "statusText": "connected",
    "databaseName": "barbaros"
  }
}
```

Error response:
```json
{
  "success": false,
  "connected": false,
  "message": "Failed to check database status: Connection error",
  "error": "Error details..."
}
```

### Admin Endpoints

#### Admin Login

```
POST /api/admin-login
```

Request body:
```json
{
  "email": "admin@barbaros.com",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "admin": {
    "id": "...",
    "username": "admin",
    "name": "Admin User",
    "role": "owner",
    "email": "admin@barbaros.com",
    "active": true,
    "lastLogin": "2023-06-18T18:30:00.000Z"
  }
}
```

### Client Endpoints

#### Create Client

```
POST /api/clients
```

Request body:
```json
{
  "email": "john.doe@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "555-123-4567"
}
```

Response:
```json
{
  "success": true,
  "message": "Client created successfully",
  "client": {
    "id": "...",
    "clientId": "C12345678",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "555-123-4567",
    "qrCodeUrl": "/api/qrcode/C12345678",
    "dateCreated": "2023-06-18T18:30:00.000Z",
    "visitCount": 0,
    "rewardsEarned": 0,
    "rewardsRedeemed": 0,
    "accountActive": true
  }
}
```

#### Get Client

```
GET /api/clients/:id
```

Response:
```json
{
  "success": true,
  "client": {
    "id": "...",
    "clientId": "C12345678",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "555-123-4567",
    "qrCodeUrl": "/api/qrcode/C12345678",
    "dateCreated": "2023-06-18T18:30:00.000Z",
    "visitCount": 0,
    "rewardsEarned": 0,
    "rewardsRedeemed": 0,
    "accountActive": true
  }
}
```

#### List Clients

```
GET /api/clients?page=1&limit=10
```

Response:
```json
{
  "success": true,
  "clients": [
    {
      "id": "...",
      "clientId": "C12345678",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "555-123-4567",
      "visitCount": 0,
      "accountActive": true
    },
    // More clients...
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

### Visit Endpoints

#### Create Visit

```
POST /api/visits
```

Request body:
```json
{
  "clientId": "...",
  "services": [
    {
      "serviceId": "...",
      "name": "Regular Haircut",
      "price": 25,
      "duration": 30
    }
  ],
  "barber": "Mike Johnson"
}
```

Response:
```json
{
  "success": true,
  "message": "Visit created successfully",
  "visit": {
    "id": "...",
    "clientId": "...",
    "visitDate": "2023-06-18T18:30:00.000Z",
    "services": [
      {
        "serviceId": "...",
        "name": "Regular Haircut",
        "price": 25,
        "duration": 30
      }
    ],
    "totalPrice": 25,
    "barber": "Mike Johnson",
    "rewardRedeemed": false,
    "visitNumber": 1
  }
}
```

#### Get Client Visits

```
GET /api/clients/:id/visits?page=1&limit=10
```

Response:
```json
{
  "success": true,
  "visits": [
    {
      "id": "...",
      "visitDate": "2023-06-18T18:30:00.000Z",
      "services": [
        {
          "name": "Regular Haircut",
          "price": 25
        }
      ],
      "totalPrice": 25,
      "barber": "Mike Johnson",
      "visitNumber": 1
    },
    // More visits...
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### Service Endpoints

#### List Services

```
GET /api/services?page=1&limit=10
```

Response:
```json
{
  "success": true,
  "services": [
    {
      "id": "...",
      "name": "Regular Haircut",
      "description": "Standard haircut with scissors",
      "price": 25,
      "durationMinutes": 30,
      "imageUrl": "/images/services/regular-haircut.jpg",
      "categoryId": "...",
      "isActive": true,
      "popularityScore": 10
    },
    // More services...
  ],
  "pagination": {
    "total": 6,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

#### Get Services by Category

```
GET /api/categories/:id/services
```

Response:
```json
{
  "success": true,
  "services": [
    {
      "id": "...",
      "name": "Regular Haircut",
      "description": "Standard haircut with scissors",
      "price": 25,
      "durationMinutes": 30,
      "imageUrl": "/images/services/regular-haircut.jpg",
      "categoryId": "...",
      "isActive": true,
      "popularityScore": 10
    },
    // More services in this category...
  ]
}
```

### Utility Endpoints

#### Seed Database

```
POST /api/seed
```

Request body:
```json
{
  "force": true
}
```

Response:
```json
{
  "success": true,
  "message": "Database seeded successfully",
  "counts": {
    "admins": 3,
    "categories": 4,
    "services": 6,
    "rewards": 3,
    "clients": 10,
    "visits": 30
  }
}
```

#### Clear Database

```
POST /api/seed
```

Request body:
```json
{
  "action": "clear",
  "force": true
}
```

Response:
```json
{
  "success": true,
  "message": "Database cleared successfully"
}
```

### QR Code Endpoints

#### Get Client QR Code

```
GET /api/clients/qrcode/:id
```

Returns a QR code image (as a data URL) for the specified client. If the client does not have a QR code, one is generated and stored.

Response:
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,...",
  "clientId": "C12345678",
  "qrCodeId": "C12345678"
}
```

#### Regenerate Client QR Code (Admin only)

```
POST /api/clients/qrcode/:id
```

Regenerates a new QR code for the client (e.g., if compromised). Only accessible by admin users.

Response:
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,...",
  "clientId": "C12345678",
  "qrCodeId": "C12345678-1718740000000"
}
```

### Client Search Endpoint

#### Search for Client by Email or Phone

```
GET /api/clients/search?email=client@example.com
GET /api/clients/search?phone=555-123-4567
```

Returns the first matching client for the given email or phone number.

Response:
```json
{
  "success": true,
  "client": {
    "id": "...",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "555-123-4567",
    "clientId": "C12345678",
    "visitCount": 5,
    "rewardsEarned": 1,
    "rewardsRedeemed": 0
  }
}
```

Error response:
```json
{
  "message": "No clients found"
}
```

## Error Handling

All API endpoints include proper error handling and return appropriate HTTP status codes:

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Next Steps

For information on authentication and authorization, see the [Authentication](./authentication.md) documentation. 