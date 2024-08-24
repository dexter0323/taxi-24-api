# Taxi24 API

## Project setup

This project follows the Clean Architecture pattern, promoting separation of concerns and scalability. It uses **Nest.js** for building server-side applications, **TypeScript** for enhanced code quality, **TypeORM** for database interactions, **Swagger** for API documentation, **Postgres** as the database, and Docker for containerization.

### Install `nvm` and Node.js

Node.js is required to run the application. It is recommended to use `nvm` (Node Version Manager) to manage Node.js versions. Follow the steps below to install `nvm` and Node.js:

1. **Install `nvm`**:

- Run the following command to install `nvm`:

  ```sh
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
  ```

- Alternatively, you can follow the instructions on the [nvm GitHub page](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating).

### Install Docker

Docker is required to run the application in a containerized environment. Follow the steps below to install Docker:

1. **Download Docker Desktop**:
   - Go to the [Docker Desktop download page](https://www.docker.com/products/docker-desktop) and download the installer for your operating system.

2. **Install Docker Desktop**:
   - Run the downloaded installer and follow the on-screen instructions to complete the installation.

3. **Verify Docker Installation**:
   - After installation, open a terminal and run the following command to verify that Docker is installed correctly:

   ```sh
    docker --version
   ```

## Start API (Docker)

```sh
npm run docker:build
```

After starting the API, you can access the Swagger API documentation to test the endpoints by navigating to: <http://localhost:3000/api>

The application includes seed data to test each endpoint as part of typeorm migration.

## Local setup

This ensures you have right node.js version isntalled.

```sh
nvm use && npm install
```

Start postgree DB

```sh
npm run docker:db
```

Run typeorm migrations

```sh
npm run typeorm:run
```

## Run the project

```sh
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

After starting the API, you can access the Swagger API documentation to test the endpoints by navigating to: <http://localhost:3000/api>

The application includes seed data to test each endpoint as part of typeorm migration.

## Run tests

```sh
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
