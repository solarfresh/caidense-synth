# caidense-synth

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](link-to-ci)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

## Project Description

This project is a backend API built with NestJS and TypeScript, designed to provide a robust and systematic platform for managing, templating, testing, and evaluating Large Language Model (LLM) prompts. It aims to bring engineering rigor to the prompt development lifecycle, facilitating better collaboration, version control, testing, and optimization of prompts used in LLM-powered applications.

The API is designed to integrate with LLM frameworks like LangChain.js for executing prompts against various models and gathering evaluation data.

## Features

* **Prompt Management:** Create, read, update, delete, and version control prompt templates. Organize prompts using categories or tags.
* **Advanced Templating:** Support for flexible prompt templating beyond simple variable substitution, potentially including conditional logic and reusable components (details TBD during development).
* **Prompt Evaluation Framework:** Define test cases (inputs), execute prompts against different LLMs, collect outputs, and apply automated evaluation metrics.
* **Batch Testing:** Run tests with multiple inputs or against multiple models efficiently.
* **Test Result Storage:** Persist test runs, LLM outputs, and evaluation results for analysis and comparison.
* **Prompt Utilities:** Helper functions for common tasks like estimating token count for prompts.
* **LLM Integration:** Seamless integration with LangChain.js for connecting to various LLM providers.
* **RESTful API:** Provides a clear and structured API for interacting with the prompt engineering features.
* **Built with NestJS & TypeScript:** Leverages the power of NestJS for a scalable and maintainable architecture, and TypeScript for type safety.

## Architecture Overview

The project is structured using NestJS's modular approach, promoting separation of concerns and maintainability. Key modules include:

* **`AppModule`**: The root module orchestrating the application.
* **`ConfigModule`**: Handles application configuration loading and management.
* **`DatabaseModule`**: Manages the database connection and exposes repositories for data access (Prompts, Test Results, etc.).
* **`LLMModule`**: Encapsulates interaction logic with LLM frameworks like LangChain.js via an `LLMService`.
* **`PromptModule`**: Manages the lifecycle of prompt templates (CRUD, versioning) via `PromptController`, `PromptService`, and `PromptRepository`.
* **`PromptTemplateModule` (Optional)**: If advanced templating logic is complex, this module handles the rendering of prompts from templates via `PromptTemplateService`.
* **`PromptEvaluationModule`**: Orchestrates the prompt testing and evaluation process via `PromptEvaluationController`, `PromptEvaluationService`, `EvaluationMetricService`, and `TestResultRepository`.
* **`PromptUtilitiesModule` (Optional)**: Contains general prompt-related helper functions.

This structure ensures a clear separation between API handling (Controllers), business logic (Services), data access (Repositories), and external integrations (LLMService).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (v18 or later recommended)
* npm, yarn, or pnpm
* A database (e.g., PostgreSQL, MongoDB)
* API keys for the LLM providers you intend to use (e.g., OpenAI, Anthropic)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url> // Replace with your repo URL
    cd prompt-engineering-api // Or your project folder name
    ```
2.  Install dependencies:
    ```bash
    npm install # or yarn install or pnpm install
    ```

### Configuration

1.  Create a `.env` file in the project root directory based on the `.env.example` (you'll need to create this example file too).
2.  Fill in your database credentials, LLM API keys, and any other necessary configuration variables.

    ```env
    DATABASE_URL=...
    LLM_OPENAI_API_KEY=...
    LLM_ANTHROPIC_API_KEY=...
    # Add other configurations as needed
    ```

### Database Setup

Run database migrations or schema synchronization based on the ORM you integrate with (e.g., TypeORM, Mongoose).

```bash
# Example using TypeORM migrations
npm run typeorm migration:run
