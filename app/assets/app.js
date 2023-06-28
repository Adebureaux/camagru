// Model
class Model {
  constructor() {
    // Add properties relevant to the model
  }

  register(username, email, password) {
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
      if (data.success)
        console.log('Registration successful!');
      else
        console.log('Registration failed. Error:', data.error);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
}

// View
class View {
  constructor() {
    this.app = this.getElement('#root');
    this.form = this.createElement('form');
    this.displayHeaderButtons();
  }

  displayHeaderButtons() {
    this.header = this.getElement('#header');
    this.loginButton = this.createElement('button');
    this.loginButton.textContent = 'Login';
    this.signInButton = this.createElement('button');
    this.signInButton.textContent = 'Sign In';
    const headerButtons = this.createElement('div', 'auth-buttons');
    headerButtons.append(this.loginButton, this.signInButton);
    header.append(headerButtons);
  }

  refreshRoot() {
    this.app.innerHTML = '';
  }

  register() {
    this.refreshRoot();
    this.form.innerHTML = '';
    this.username = this.createElementInDiv('input');
    this.username.placeholder = 'Username';
    this.email = this.createElementInDiv('input');
    this.email.placeholder = 'Email';
    this.password = this.createElementInDiv('input');
    this.password.placeholder = 'Password';
    this.password.type = 'password';
    this.submitButton = this.createElement('button');
    this.submitButton.textContent = 'Create'
    this.submitButton.type = 'submit';
    this.form.append(this.username, this.email, this.password, this.submitButton);
    this.app.append(this.form);
  }

  createElement(tag, className) {
    const element = document.createElement(tag);

    if (className)
      element.classList.add(className);

    return element;
  }

  createElementInDiv(tag, className) {
    const div = document.createElement('div');
    const element = document.createElement(tag);
    div.append(element);
    if (className)
      element.classList.add(className);
    return div;
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

    this.view.signInButton.addEventListener('click', this.registerView.bind(this));
    this.view.form.addEventListener('submit', this.registerModel.bind(this));
  }

  registerView() {
    this.view.register();
  }

  registerModel(event) {
    event.preventDefault();
    this.model.register(this.view.username.querySelector('input').value, this.view.email.querySelector('input').value, this.view.password.querySelector('input').value);
  }
}

// Instantiate the model, view, and controller
const model = new Model();
const view = new View();
const controller = new Controller(model, view);