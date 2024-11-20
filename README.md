# Registration and Authentication System

## Overview

This project is a comprehensive registration and authentication system built using modern web technologies. It is designed to provide a secure and user-friendly interface for users to sign up, log in, and manage their accounts. The system includes features such as user registration, login, account blocking/unblocking, and deletion, with robust error handling and visual feedback using toast notifications.

## Features

* User Registration: Users can register by providing a username, email, and password. The system ensures that email addresses are unique and securely stores passwords using bcrypt.
* User Login: Registered users can log in using their email and password. The system verifies the credentials and generates a JWT token for authenticated sessions.
* Account Management: Admins can block, unblock, and delete user accounts. Blocked users cannot log in until their account is unblocked.
* Error Handling: Comprehensive error handling for various scenarios, including duplicate email registration, invalid credentials, and network errors, with feedback provided through toast notifications.
* Responsive Design: The UI is built using React and Bootstrap, ensuring responsiveness and a seamless user experience across different devices.

## Technologies Used

* Frontend: React, Bootstrap, React-Router-Dom, React-Toastify
* Backend: Koa, Koa-Router, Koa-Bodyparser, Koa-Cors, bcrypt, jsonwebtoken, MySQL
* Build Tools: Vite, TypeScript