# MyToDoApp Frontend

This is the frontend for the MyToDoApp, a simple note-taking application built with React.

## Table of Contents

- [MyToDoApp Frontend](#mytodoapp-frontend)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
  - [Available Scripts](#available-scripts)
    - [`npm start`](#npm-start)
    - [`npm test`](#npm-test)
    - [`npm run build`](#npm-run-build)
  - [Components](#components)
  - [Dependencies](#dependencies)
  - [Contributing](#contributing)
  - [License](#license)
  - [Learn More](#learn-more)

## Installation

1. Clone the repository:

   ```BASH
   git clone https://github.com/yourusername/MyToDoApp.git
   ```

2. Navigate to the frontend directory:

   ```BASH
   cd MyToDoApp/frontend
   ```

3. Install the dependencies:

   ```BASH
   npm install
   ```

## Usage

To start the development server, run:

```BASH
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## API Endpoints

The frontend interacts with the backend API running on `http://localhost:5000`. Here are the endpoints used:

- `GET http://localhost:5000/api/notes/`: Fetch all notes
- `POST http://localhost:5000/api/notes/`: Create a new note
- `GET http://localhost:5000/api/notes/:id`: Fetch a specific note by ID
- `PUT http://localhost:5000/api/notes/:id`: Update a specific note by ID
- `DELETE http://localhost:5000/api/notes/:id`: Delete a specific note by ID

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Components

- `NotesList`: Displays all notes and handles note deletion
- `CreateNote`: Handles creation of new notes
- `EditNote`: Handles editing of existing notes

## Dependencies

Main dependencies include:

- react
- react-router-dom
- axios
- @mui/material

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

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
