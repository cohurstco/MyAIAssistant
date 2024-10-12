# MyToDoApp Backend

This is the backend server for the MyToDoApp, a simple note-taking application built with Node.js, Express, and MongoDB.

## Table of Contents

- [MyToDoApp Backend](#mytodoapp-backend)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
    - [Notes](#notes)
  - [Environment Variables](#environment-variables)
  - [Project Structure](#project-structure)
  - [Dependencies](#dependencies)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

1. Clone the repository:

   ```BASH
   git clone https://github.com/yourusername/MyToDoApp.git
   ```

2. Navigate to the backend directory:

   ```BASH
   cd MyToDoApp/backend
   ```

3. Install the dependencies:

   ```BASH
   npm install
   ```

4. Set up your environment variables in a `.env` file (see [Environment Variables](#environment-variables) section).

## Usage

To start the server in development mode, run the following command in the backend directory:

```BASH
npm run dev
```

The server will start running on `http://localhost:5000` by default.

## API Endpoints

The server provides the following endpoints:

### Notes

- `GET /api/notes/`: Fetch all notes
- `POST /api/notes/`: Create a new note
  - Required fields in request body: `title`, `content`, `author`
- `GET /api/notes/:id`: Fetch a specific note by ID
- `PUT /api/notes/:id`: Update a specific note by ID
  - Fields that can be updated in request body: `title`, `content`, `author`
- `DELETE /api/notes/:id`: Delete a specific note by ID

All endpoints now include input validation. Invalid requests will return appropriate error messages.

## Environment Variables

Create a `.env` file in the backend directory and add the following variables:

- `ATLAS_URI`: Your MongoDB connection string
- `PORT`: The port number for the server (default is 5000)

Example:

```TEXT
ATLAS_URI=mongodb+srv://yourusername:yourpassword@cluster0.mongodb.net/mytodoapp
PORT=5000
```

## Project Structure

The backend follows a modular structure:

- `src/server.ts`: Main application file
- `src/routes/`: Contains route definitions
- `src/controllers/`: Contains controller logic for handling requests
- `src/models/`: Contains Mongoose models

## Dependencies

Main dependencies include:

- express
- mongoose
- cors
- dotenv
- express-validator (for input validation)

For a full list of dependencies, please refer to the `package.json` file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
