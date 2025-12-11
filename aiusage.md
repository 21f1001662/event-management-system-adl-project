# AI Usage Quantification Guidelines for App Dev Lab Project

## Introduction
This document outlines the extent of AI or LLM assistance used in the development of this full-stack project. The project primarily relied on manual coding, with AI tools used strictly for productivity enhancements such as autocompletion, minor bug fixes, and generating initial boilerplate code for UI components.

## AI Usage Quantification Table

### Frontend (React - 40%)
*Covers UI, navigation, API integration, and state management*

| Component / Module | Description / Scope | Weight (%) | Actual AI Contribution | Example of AI Use |
| :--- | :--- | :--- | :--- | :--- |
| **Components** (`/components`) | Reusable UI pieces | 10% | 25% | Boilerplate UI JSX generation (Copilot, ChatGPT) |
| **Pages** (`/pages`) | Core screens | 15% | 20% | Autocompletion for imports/structure |
| **Services** (`/services/api.js`) | API interaction layer | 5% | 0.5% | Autocompletion for fetch syntax |
| **Context / Hooks** | State and logic sharing | 5% | 0.5% | Bug fix suggestions (ChatGPT) |
| **Main setup** | Routing, app bootstrap | 5% | 0% | Manual setup |

### Backend (Express + TypeORM - 50%)
*Handles API, business logic, database, and middleware*

| Component / Module | Description / Scope | Weight (%) | Actual AI Contribution | Example of AI Use |
| :--- | :--- | :--- | :--- | :--- |
| **Entities** (`/entities`) | Database models | 10% | 1% | Autocompletion for type definitions |
| **Controllers** (`/controllers`) | API endpoints | 15% | 2% | Logic debugging (Gemini) |
| **Services** (`/services`) | Business logic | 10% | 1% | Refactoring suggestions |
| **Routes** (`/routes`) | Route definitions | 5% | 0.5% | Autocompletion |
| **Middlewares** | Auth, validation | 5% | 0% | Manual implementation |
| **Utils** (`/utils`) | Helper functions | 5% | 0.5% | Regex generation for validation |

### Infrastructure / Optional (10%)
*Supporting setup and optimizations*

| Component / Module | Description / Scope | Weight (%) | Actual AI Contribution | Example of AI Use |
| :--- | :--- | :--- | :--- | :--- |
| **Config** (DB, Redis) | Setup configuration | 10% | 1% | Checking syntax for config options |

## Calculating Total AI Usage

The total AI usage is calculated by summing the weighted contributions of AI to each component.

*   **Frontend Contribution**: ~4%
*   **Backend Contribution**: ~5%
*   **Infrastructure Contribution**: ~1%

**Total AI Usage: ~10%**

## Declaration Note

I declare that the AI contribution to this project is **minimal (approx. 10%)**.

**Tools Used:**
*   **GitHub Copilot**: Primarily for tab-autocompletion and minor code suggestions.
*   **Gemini / ChatGPT**: Used occasionally for debugging specific errors and generating boilerplate code for UI components.

The core logic, architecture, and implementation were performed manually to ensure a deep understanding of the full-stack development process.
