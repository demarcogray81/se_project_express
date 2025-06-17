# WTWR (What to Wear?): Back End

This portion of the project of the project was done using back-end API's.
The web application helps users figure out what clothing would be best depending on the weather using the exact temperature of the actual location.

## Technologies & Tools

- Node.js - Helps make the server side of code more modular.
- MongoDB & Mongoose - This manages the web data with a database.
- ESLint & Prettier - Makes sure the code stays clean and understandable.
- Validator.js - Validates the user input, making sure the user inputs the correct information.
- Nodemon - Makes deploying the app easier and restarts upon changes to the code.

## Features

- Store and manage clothing items in a MongoDB database
- Create and manage user profiles
- Like or unlike clothing items
- Centralized error handling and validation
- Designed for modularity and easy expansion

## Functionality

- User Routes
- GET /users – Fetch all users.
- POST /users – Create a new user (with validated name and avatar).
- GET /users/:userId – Get a user by ID.
- Clothing Items Routes
- GET /items – List all clothing items.
- POST /items – Add a new clothing item.
- DELETE /items/:itemId – Delete a clothing item by ID.
- PUT /items/:itemId/likes – Like a clothing item.
- DELETE /items/:itemId/likes – Unlike a clothing item.

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

### Testing

Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12
