import page from "//unpkg.com/page/page.mjs";

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
    this.signInForm = this.createElement('form');
    this.displayHeaderButtons();
  }

  displayHeaderButtons() {
    const header = this.getElement('#header');

    const loginLink = this.createElement('a');
    const loginButton = this.createElement('button');
    loginLink.href = '/login';
    loginButton.textContent = 'Login';
    loginLink.appendChild(loginButton);

    const signInLink = this.createElement('a');
    const signInButton = this.createElement('button');    
    signInLink.href = '/signin';
    signInButton.textContent = 'Sign In';
    signInLink.appendChild(signInButton);

    const headerButtons = this.createElement('div', 'auth-buttons');
    headerButtons.append(loginLink, signInLink);
    header.append(headerButtons);
  }

  refreshRoot() {
    this.app.innerHTML = '';
  }

  displaySignInPagePage() {
    this.refreshRoot();
    this.signInForm.innerHTML = '';

    const title = this.createElementInDiv('h3');
    title.firstChild.textContent = 'Create your account';

    this.username = this.createElementInDiv('input');
    this.username.firstChild.placeholder = 'Username';
    this.email = this.createElementInDiv('input');
    this.email.firstChild.placeholder = 'Email';
    this.password = this.createElementInDiv('input');
    this.password.firstChild.placeholder = 'Password';
    this.password.type = 'password';
    this.submitButton = this.createElement('button', 'sign-in-submit-btn');
    this.submitButton.textContent = 'Create'
    this.submitButton.type = 'submit';
    this.signInForm.append(title, this.username, this.email, this.password, this.submitButton);
    this.app.append(this.signInForm);
  }

    displayHomePage() {
      this.refreshRoot();
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

    this.view.signInForm.addEventListener('submit', this.registerModel.bind(this));

    page('/', this.homePage.bind(this));
    page('/login', this.homePage.bind(this));
    page('/signin', this.signInPage.bind(this));
    page.start();
  }

  homePage() {
    this.view.displayHomePage();
  }

  signInPage() {
    this.view.displaySignInPagePage();
  }

  registerModel(event) {
    event.preventDefault();
    this.model.register(this.view.username.firstChild.value, this.view.email.firstChild.value, this.view.password.firstChild.value);
  }
}

// Instantiate the model, view, and controller
const model = new Model();
const view = new View();
const controller = new Controller(model, view);