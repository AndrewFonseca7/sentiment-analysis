# Sentiment Analysis API

This project is a Sentiment Analysis API built with NestJS. It utilizes Google Cloud's Natural Language API to analyze the sentiment of given text. The project includes logging with Elasticsearch and Kibana.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Running Tests](#running-tests)
- [Logging and Monitoring](#logging-and-monitoring)

## Features

- RESTful API with NestJS.
- Swagger documentation.
- Unit and end-to-end tests with Jest.
- Google Cloud Natural Language API integration.
- Dockerized app.
- Elasticsearch and Kibana logging.
- Environment-specific configurations.
- MongoDB database.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm (version 10 or higher)
- MongoDB
- Google Cloud account with access to Natural Language API
- Docker (for kibana, elastic search and redis)
- Elasticsearch and Kibana (for logging)

### Installation

1. Clone the repository:

   ```bash
   git clone
   ```

- MongoDB database.
- Sentiment analysis using Google Cloud Natural Language API.
- Validation of input data.
- Logging with Elasticsearch and Kibana.
- Environment-specific database configurations (development, testing, production).

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables. Create .env, .env.development, and .env.test files based on the provided example .env.example:

   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=./path-to-your-gcp-keys-file.json
   MONGODB_URI=mongodb://localhost:27017/sentiment-analysis
   ENV=development
   ELASTICSEARCH_HOST=http://localhost:9200
   PORT=3000
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

### Running the Application

#### Running for development

Before you start the aplication be sure to run the kibana, elestic search and redis instances with docker using this command

```bash
npm run start:docker-instances
```

Then you can proceed to run the app

```bash
npm run start:dev
```

#### Running on docker container

Use this command on the root of the project

```bash
docker-compose up --build
```

### API Documentation

The API is documented using Swagger. Once the application is running, you can access the documentation at http://localhost:3000/api.

### Running Tests

To run unit tests

```bash
npm run test:cov
```

The end to end test are nunned on the test environment, so please be sure to have configured your _.env.test_ file to avoid modifications on the data base due to the tests.

To run end to end tests

```bash
npm run test:e2e
```

### Logging and Monitoring

The application logs important events and errors to Elasticsearch, which can be visualized using Kibana.

#### Example Log Information

- Timestamps
- Endpoint requested
- Input parameters
- Response status codes
- Detailed error messages
- Cache events (hits and misses)
- Queue events (jobs enqueued, processed, failed)
