# caidense-synth

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](link-to-ci)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

## Project Description

This project is a backend API built with NestJS and TypeScript, designed to provide a robust and systematic platform for building, managing, testing, and evaluating AI workflows and Large Language Model (LLM) prompts. It aims to bring engineering rigor to the AI application development lifecycle, facilitating better collaboration, version control, testing, and optimization of prompts and automated processes.

The API is designed to integrate with LLM frameworks like LangChain.js for executing prompts against various models and provides a visual workflow editor for orchestrating complex AI-powered applications.

## Features

* **Workflow Automation:**
    * Visual Workflow Editor for building and managing AI workflows.
    * Supports various node types including Script Node, Dynamic Switch Node, Switch Node, Condition Node, LLM Call Node, and Start/End Event Nodes.
    * Dynamic input/output management for nodes.
    * Integrated workflow testing capabilities.
* **Prompt Management:** Create, read, update, delete, and version control prompt templates (now referred to as Prompt Texts). Organize prompts using categories or repositories.
    * Advanced templating features for prompt creation.
    * Link prompts to specific repositories for better organization.
    * Duplicate functionality for existing prompts.
* **Prompt Evaluation Framework:** Define test cases (inputs), execute prompts against different LLMs, collect outputs, and apply automated evaluation metrics (GenAI-powered evaluation integrated).
* **Batch Testing:** Run tests with multiple inputs or against multiple models efficiently.
* **Test Result Storage:** Persist test runs, LLM outputs, and evaluation results for analysis and comparison.
* **LLM Integration:** Seamless integration with various LLM providers.
* **Block Library:** Reusable components (blocks) that can be used within workflows.
    * Ability to create, read, update, and delete blocks via the API and frontend.
* **RESTful API:** Provides a clear and structured API for interacting with the prompt engineering and workflow automation features.
* **Built with NestJS & TypeScript:** Leverages the power of NestJS for a scalable and maintainable architecture, and TypeScript for type safety.

## Architecture Overview

The project is structured using a multi-service architecture built with NestJS's modular approach, promoting separation of concerns and maintainability. Key services and modules include:

* **`ApiService`**: The main API service built with NestJS, handling HTTP requests and orchestrating other services.
* **`WorkerService`**: A dedicated worker service (built with NestJS) responsible for executing workflows and other background tasks.
* **`ReasoningService`**: A shared library (`libs/caidense-reasoning`) containing core reasoning logic, node definitions, DTOs, and execution context management.
* **`AppModule`**: The root module orchestrating the API application.
* **`ConfigModule`**: Handles application configuration loading and management.
* **`DatabaseModule`**: Manages the database connection (using Mongoose) and exposes repositories for data access (Workflows, Prompts, Blocks, etc.).
* **`LLMModule`**: Encapsulates interaction logic with LLM providers.
* **`PromptModule`**: Manages the lifecycle of prompt templates (Prompt Texts) and Prompt Sets via `PromptController`, `PromptService`, and related repositories.
* **`WorkflowModule`**: Handles the creation, management, testing, and execution of workflows via `WorkflowController`, `WorkflowService`, and related repositories.
* **`ExecutionModule`**: Manages the execution of workflow graphs and individual nodes within the worker service.
* **`BlockModule`**: Manages the creation, retrieval, and modification of reusable blocks used in workflows.
* **`RepositoryModule`**: Handles the management of prompt repositories.

This multi-service structure ensures a clear separation between API handling, background processing, and core reasoning logic, improving scalability and maintainability.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (v18 or later recommended)
* npm, yarn, or pnpm
* Docker and Docker Compose (for local setup)
* API keys for the LLM providers you intend to use (e.g., OpenAI, Anthropic)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url> // Replace with your repo URL
    cd caidense-synth
    ```
2.  Install dependencies:
    ```bash
    npm install # or yarn install or pnpm install
    ```

### Running the Application

The project utilizes Docker Compose to manage the different services locally. Ensure you have Docker and Docker Compose installed on your system.

1.  Navigate to the project root directory in your terminal.

2.  Create a `.env` file in the project root. This file will contain environment variables used by the different services. Refer to the `.env.example` file for the required variables for the API, worker, MongoDB, and RabbitMQ.

3.  Start the Docker containers using Docker Compose:
    ```bash
    docker-compose up -d
    ```
    This command will build the Docker images (if they haven't been built before) and start the containers for the frontend, API, worker, MongoDB, and RabbitMQ in detached mode.

4.  **Accessing the applications:**
    * **Frontend:** The frontend application will be accessible at `http://localhost:5174`.
    * **API:** The backend API will be accessible at `http://localhost:3001`.
    * **MongoDB:** The MongoDB database will be running on `localhost:27018`. You can use a MongoDB client to connect to it.
    * **RabbitMQ Management UI:** The RabbitMQ management interface will be accessible at `http://localhost:15672`. The default username and password are often `guest/guest`, but you should configure these in your `.env` file.

5.  To stop the Docker containers:
    ```bash
    docker-compose down
    ```

**Note:**

* The `docker-var.env` file mentioned in the `docker-compose.yml` is used to store environment variables. Make sure you have this file in the project root directory and it contains all the necessary configurations for your environment (database connection strings, API keys, RabbitMQ credentials, etc.).
* The MongoDB data is persisted using a named volume `caidense-mongo-volume`. This ensures that your database data is not lost when you stop or remove the containers. You might need to create this volume initially using `docker volume create caidense-mongo-volume` if it doesn't exist.
* The `depends_on` directive in the `docker-compose.yml` ensures that the API service starts after the MongoDB service and the worker service starts after the RabbitMQ service. This manages the dependencies between the services.

### Configuration

1.  Create a `.env` file in the project root directory. This file will contain environment variables used by the different services.

2.  Populate the `.env` file with the following configurations. These variables are specifically used within the Docker environment as defined in the `docker-var.env` file:

    ```env
    # Environment variables for the API service
    NODE_ENV=development
    PORT=3000
    # Configuration of Swagger
    HOST_PORT=3000
    # Configuration of CORS
    FRONTEND_PORTS=5173,5174
    # Configuration of MongoDB
    MONGODB_URI=mongodb://mongo:27017/caidense-synth
    # Configuration of RabbitMQ
    RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
    RABBITMQ_EXECUTE_QUEUE_NAME=caidense-execution
    RABBITMQ_WORKER_QUEUE_NAME=caidense-worker
    RABBITMQ_RPC_TIMEOUT=60000
    # Configuration of VM (a module of NodeJS)
    VM_TIMEOUT=1000
    # Max number of nodes in a graph
    MAX_LOOP_ITERATIONS=100
    # Add other variables your API needs
    ```

    **Explanation of the variables:**

    * `NODE_ENV`: Specifies the environment the application is running in (e.g., `development`, `production`).
    * `PORT`: Defines the port on which the API service will listen (inside the Docker container).
    * `HOST_PORT`: Specifies the port used by Swagger UI to access the API documentation.
    * `FRONTEND_PORTS`: A comma-separated list of ports where the frontend application(s) are running. This is used for configuring Cross-Origin Resource Sharing (CORS).
    * `MONGODB_URI`: The connection string for the MongoDB database. It specifies the hostname (`mongo`, which resolves to the MongoDB container within the Docker network), the port (`27017`), and the database name (`caidense-synth`).
    * `RABBITMQ_URL`: The connection URL for the RabbitMQ message broker. It specifies the username (`guest`), password (`guest`), hostname (`rabbitmq`), and port (`5672`).
    * `RABBITMQ_EXECUTE_QUEUE_NAME`: The name of the RabbitMQ queue used for submitting workflow execution requests.
    * `RABBITMQ_WORKER_QUEUE_NAME`: The name of the RabbitMQ queue where the worker service listens for tasks.
    * `RABBITMQ_RPC_TIMEOUT`: The timeout (in milliseconds) for Remote Procedure Call (RPC) communications with RabbitMQ.
    * `VM_TIMEOUT`: The timeout (in milliseconds) for the Node.js Virtual Machine (VM) used for script execution.
    * `MAX_LOOP_ITERATIONS`: The maximum number of iterations allowed in a workflow graph to prevent infinite loops.
    * You can add any other environment variables that your API or other services might require to this file.

**Note:** The `docker-var.env` file is loaded by the Docker Compose setup to provide these environment variables to the respective containers. Ensure this file exists in the project root directory.