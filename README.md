# Camagru

## Project Overview
Camagru is a web application project. The goal is to create a small web app that allows users to make basic photo and video edits using their webcam and predefined images.

## Version
4.0

## Introduction
This project will use some concepts such as:
- Responsive design
- DOM Manipulation
- SQL Debugging
- Cross-Site Request Forgery (CSRF)
- Cross-Origin Resource Sharing (CORS)

## Objectives
Create a web application that allows users to perform basic photo and video editing using their webcam and predefined images with alpha channels. Users should be able to select an image, take a picture with their webcam, and combine both images. All captured images should be public, likeable, and commentable.

## General
- The web application produce no errors or warnings in any console (server-side and client-side)
- The server-side application use exclusively PHP standard library
- Client-side use HTML, CSS, and JavaScript
- Containerization in Docker
- The application and handle data privacy
- Nginx web server
- Compatibility with Firefox (>= 41) and Chrome (>= 46)
- A .env file is necessary to enable the mail system, the file must contains:
SMTP_SERVER="[your.smtp.com]:port" SMTP_ACCESS="your_mail@email.com:yourPassword"

## Features

### Common Features
- MVC structured application
- Page layout (header, main section, footer)
- Mobile-friendly and responsive design
- Secure all forms and site features
- No plain or unencrypted passwords
- Prevent HTML/JavaScript injection
- Secure file uploads and SQL queries

### User Features
- User registration with email, username, and password with complexity checks
- Email confirmation for account activation
- User login with username and password
- Password reset via email
- User profile updates (username, email, password)
- Easy user logout

### Gallery Features
- Public gallery displaying all user-edited images, ordered by creation date
- Logged-in users can like and comment on images
- Notify image authors by email when their image receives a new comment (default setting, can be disabled)
- Paginate image list (at least 5 images per page)

### Editing Features
- Accessible only to authenticated users
- Main section: webcam preview, list of superposable images, capture button
- Side section: thumbnails of previous images
- Server-side image processing
- Allow image uploads if no webcam is available
- Users can delete their images

### Bonus Part
- Live preview of edited images.
- Infinite pagination for the gallery.

