# Camagru

## Project Overview
Camagru is a web application project. The goal is to create a small web app that allows users to make basic photo and video edits using their webcam and predefined images.

## Version
4.0

## Introduction
The web is a vast and rich world that allows you to quickly release data and content globally. This project will help you learn new concepts such as:
- Responsive design
- DOM Manipulation
- SQL Debugging
- Cross-Site Request Forgery (CSRF)
- Cross-Origin Resource Sharing (CORS)

## Objectives
Create a web application that allows users to perform basic photo and video editing using their webcam and predefined images with alpha channels. Users should be able to select an image, take a picture with their webcam, and combine both images. All captured images should be public, likeable, and commentable.

### General Instructions
Your web application must produce no errors or warnings in any console (server-side and client-side).
You can use any language for the server-side application, but ensure that equivalent functions exist in the PHP standard library.
Client-side, use HTML, CSS, and JavaScript.
Utilize up-to-date containerization (e.g., Docker).
Secure your application and handle data privacy.
Use any web server you prefer (e.g., Apache, Nginx).
Ensure compatibility with Firefox (>= 41) and Chrome (>= 46).
Note: Store credentials, API keys, and env variables in a .env file and ignore it in git to avoid security issues.

## Mandatory Part

### Common Features
Structure your application (MVC recommended).
Decent page layout (header, main section, footer).
Mobile-friendly and responsive design.
Secure all forms and site features.
No plain or unencrypted passwords.
Prevent HTML/JavaScript injection.
Secure file uploads and SQL queries.
### User Features
User registration with email, username, and password (with complexity checks).
Email confirmation for account activation.
User login with username and password.
Password reset via email.
User profile updates (username, email, password).
Easy user logout.

### Gallery Features
Public gallery displaying all user-edited images, ordered by creation date.
Logged-in users can like and comment on images.
Notify image authors by email when their image receives a new comment (default setting, can be disabled).
Paginate image list (at least 5 images per page).

### Editing Features
Accessible only to authenticated users.
Main section: webcam preview, list of superposable images, capture button.
Side section: thumbnails of previous images.
Server-side image processing.
Allow image uploads if no webcam is available.
Users can delete their images.
### Constraints and Mandatory Things
Server-side: Any language (limited to PHP standard library).
Client-side: HTML, CSS, JavaScript (native browser APIs).
CSS frameworks are allowed unless they introduce forbidden JavaScript.
Provide a containerized deployment solution (e.g., docker-compose).

## Bonus Part
Live preview of edited images.
Infinite pagination for the gallery.

