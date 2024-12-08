# Visa Navigator Server

This is the backend server for the Visa Navigator application, which facilitates managing visa-related data and user applications.

## Features

- **CRUD Operations**: Supports Create, Read, Update, and Delete operations for visa data.
- **API Endpoints**:
  - Fetch all visa data.
  - Fetch the latest 6 visa entries.
  - Fetch visa data by ID.
  - Fetch visa data by user email.
  - Update specific visa entries.
  - Delete specific visa entries.
- **Middleware**: Implements CORS and JSON parsing for secure and efficient API communication.
- **MongoDB Integration**: Utilizes MongoDB for database storage with collections for `allVisa` and `myVisa` data.
- **Environment Variables**: Sensitive credentials (e.g., MongoDB URI, user credentials) are securely stored in environment variables using `dotenv`.
- **Timestamps**: Automatically adds `createdAt` timestamps to new data entries.
