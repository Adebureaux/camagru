// Model
class Model {
  constructor() {
    // Add properties relevant to the model
  }

  registerUser(username, email, password) {
    console.log(username, email, password);
    fetch('auth/register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Handle the response from the server
      if (data.success) {
        // Registration successful
        console.log('Registration successful!');
      } 
      else {
        // Registration failed
        console.log('Registration failed. Error:', data.error);
      }
    })
    .catch(error => {
      // Handle any errors that occurred during the request
      console.error('Error:', error);
    });
  }
}

// View
class View {
  constructor() {
    this.app = this.getElement('#root');
    this.displayHeader();
    this.displayMain();
  }

  displayHeader() {
    const header = this.createElement('header');

    const h1 = this.createElement('h1');
    h1.textContent = 'Camagru';

    const title = this.createElement('div');
    title.append(h1);

    this.loginButton = this.createElement('button');
    this.loginButton.textContent = 'Login';

    this.signInButton = this.createElement('button');
    this.signInButton.textContent = 'Sign In';

    const headerButtons = this.createElement('div', 'auth-buttons');
    headerButtons.append(this.loginButton, this.signInButton);

    header.append(title);
    header.append(headerButtons);

    this.app.append(header);
  }

  displayMain() {
    return null;
  }

  createElement(tag, className) {
    const element = document.createElement(tag);

    if (className)
      element.classList.add(className);

    return element;
  }

  getElement(selector) {
    const element = document.querySelector(selector);

    return element;
  }
}

// Controller
class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.signInButton.addEventListener('click', this.register.bind(this));
  }

  register() {
    const username = prompt('Enter your desired username:');
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');

    // Request the model to handle the registration
    this.model.registerUser(username, email, password);
  }
}

// Instantiate the model, view, and controller
const model = new Model();
const view = new View();
const controller = new Controller(model, view);