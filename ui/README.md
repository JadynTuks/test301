# MPDB-Studio UI Documentation

This document provides details on the MPDB-Studio web-based UI that interacts with the MPDB backend through the JavaScript client library. The UI offers a graphical interface for authentication, database operations, and data management.

## Table of Contents

1. [Overview](#overview)
2. [Installation & Setup](#installation--setup)
3. [UI Structure](#ui-structure)
   - [Landing Page](#landing-page)
   - [Dashboard Page](#dashboard-page)
   - [Data Page](#data-page)
   - [Query Page](#query-page)
   - [Users Page](#users-page)
4. [Features & Functionality](#features--functionality)
5. [UI Component Architecture](#ui-component-architecture)
6. [API Integration](#api-integration)
7. [Authentication Flow](#authentication-flow)
8. [Usage Examples](#usage-examples)
9. [Development Guide](#development-guide)
10. [Testing](#testing)
11. [Contributing](#contributing)

## Overview

MPDB-Studio is a comprehensive web-based UI for interacting with the MPDB database management system. It provides an intuitive interface for users to manage databases, collections, documents, run queries, and handle user administration.

## Installation & Setup

[Instructions for setting up the development environment, installing dependencies, and running the UI locally]


Installation & Setup Prerequisites:

Ensure you have the following installed on your system:
- Node.js (v16 or later) – Download Here
- npm (comes with Node.js) 
- Git (for cloning the repository)

1. Clone the Repository:
To get started, clone the UI repository:
- git clone https://github.com/COS301-SE-2025/MP6.git
- cd UI

2. Install Dependencies
(Use npm)
- npm install

3. Running the Development Server
Start the development server:
- npm start
  
(This will run the application locally at http://localhost:8888/.)

4. Building for Production
To create a production-ready build, run:
- npm run build
  
(The optimized build files will be available in the build/ directory.)

5. Running Tests
To run the test suite:
- npm test


## UI Structure

The MPDB-Studio UI consists of five main pages:

### Landing Page

The landing page serves as the entry point to the application, featuring:
- Login/registration forms
- Product information and features
- Getting started guides

### Dashboard Page

The dashboard provides an overview of the user's databases and system metrics:
- Database statistics (count, size, bar charts, pie charts, etc.)
- Recent activity
- User stats for standard users and admin users
- System-wide stats for admin users

### Data Page

The data page allows users to:
- Browse databases and collections
- View, create, edit, and delete documents
- Manage database and collection settings

### Query Page

The query page provides tools for:
- Building and executing queries against collections
- Viewing and exporting query results
- Saving and loading queries

### Users Page

The user management page (accessible to administrators) enables:

A.) For standard users:

- Viewing personal account information and settings
- log-option

B.) For Admins

- Viewing all system users
- Creating new users
- Updating user roles
- Deleting users
- log-out option

## Features & Functionality

Detailed description of key features implemented in the UI:
- Authentication (login/registration)
- Database CRUD operations
- Document management
- Query builder and execution
- User administration

## UI Component Architecture

[Description of the component hierarchy, reusable components, and their interactions]
Component Breakdown:

App.js - The main entry point of the UI. Also defines routing between pages

components/ - Contains reusable UI components (e.g. navbar)

pages/ - Houses the five main pages

services/ - Handles API calls to MPDB backend


## API Integration

[Details on how the UI integrates with the MPDB JS Client Library to communicate with the backend]


## Authentication Flow
- User enters credentials on the login page.
- The UI sends the credentials to the authentication API.
- On success, a token is stored in localStorage or sessionStorage.
- All subsequent requests include the token in the Authorization header.


## Usage Examples

[Step-by-step examples showing how to perform common tasks]

## Development Guide

[Instructions for UI developers on code organization, standards, and practices]
- Follow React best practices.
- Keep components modular and reusable.
- Use Prettier for code formatting.
- Follow the Git branching strategy for development.


## Testing

[Information on testing methodologies, running tests, and test coverage]

## Contributing

[Guidelines for contributing to the MPDB-Studio UI codebase]
- Create a separate branch in GitHub and name it your first name.
- Commit your changes with clear messages to your branch.
- Submit a pull request for review.
- Once everything works, push to UI branch.
