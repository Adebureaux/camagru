import page from "//unpkg.com/page/page.mjs";

// Model
class Model {
  constructor() {
    this.view = view;
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
      if (data.success)
        this.view.displaySignInSuccess(data);
      else
        this.view.displaySignInError(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  login(username, password) {
    fetch('auth/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // this.view.displayHomePage();
        window.location.href = 'https://localhost';
        console.log(data);
      }
      else
        console.log('error: ', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  checkLogin() {
    fetch('auth/check_login.php')
    .then(response => response.json())
    .then(data => {
      if (data.logged) {
        console.log('You are logged in');
        // User is logged in
        // document.querySelector('loginStatus').textContent = 'You are connected';
      } else {
        console.log('You are NOT logged in');
        // User is not logged in
        // document.querySelector('loginStatus').textContent = 'Please log in';
      }
      return data.logged;
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

    this.username = this.createElementInDiv('input', 'grid-center');
    this.username.firstChild.placeholder = 'Username';
    
    this.password = this.createElementInDiv('input', 'grid-center');
    this.password.firstChild.placeholder = 'Password';
    this.password.firstChild.type = 'password';
    
    this.signInForm = this.createElement('form');
    this.loginForm = this.createElement('form');

    this.displayHeaderButtons();
  }

  refreshRoot() {
    this.app.innerHTML = '';
  }

  resetInput() {
    this.username.firstChild.value = '';
    this.password.firstChild.value = '';
  }

  displayHeaderButtons() {
    const header = this.getElement('#header');

    this.loginLink = this.createElement('a');
    const loginButton = this.createElement('button');
    this.loginLink.href = '/login';
    loginButton.textContent = 'Login';
    this.loginLink.appendChild(loginButton);

    const signInLink = this.createElement('a');
    const signInButton = this.createElement('button');    
    signInLink.href = '/signin';
    signInButton.textContent = 'Sign In';
    signInLink.appendChild(signInButton);

    const headerButtons = this.createElement('div', 'auth-buttons');
    headerButtons.append(this.loginLink, signInLink);
    header.append(headerButtons);
  }

  displayHomePage() {
    this.refreshRoot();
    const test = this.createElement('div', 'loginStatus');
    this.app.append(test);
  }

  displaySignInPagePage() {
    this.refreshRoot();
    this.signInForm.innerHTML = '';
    this.resetInput();

    const title = this.createElementInDiv('h3');
    title.firstChild.textContent = 'Create your account';

    this.email = this.createElementInDiv('input', 'grid-center');
    this.email.firstChild.placeholder = 'Email';

    this.submitButton = this.createElement('button', 'submit-btn');
    this.submitButton.textContent = 'Create'
    this.submitButton.type = 'submit';

    this.errorArea = this.createElementInDiv('p', 'response-area');

    this.signInForm.append(title, this.username, this.email, this.password, this.submitButton, this.errorArea);
    this.app.append(this.signInForm);
  }

  displaySignInSuccess() {
    this.refreshRoot();
    this.signInForm.innerHTML = '';

    const confirm = this.createElementInDiv('h3', 'response-area');
    confirm.firstChild.textContent = 'We sent you an email.';
    const instructions = this.createElement('h3');
    instructions.textContent = 'Please click on the provided link in the email to confirm your account.';
    confirm.appendChild(instructions);

    const loginButton = this.duplicateElement(this.loginLink);
    loginButton.firstChild.classList.add('submit-btn');

    this.signInForm.append(confirm, loginButton);
    this.app.append(this.signInForm);
  }

  displaySignInError(data) {
    this.errorArea.firstChild.textContent = data.error;
  }

  displayLoginPage() {
    this.refreshRoot();
    this.loginForm.innerHTML = '';
    this.resetInput();

    const title = this.createElementInDiv('h3');
    title.firstChild.textContent = 'Login';

    this.loginButton = this.createElement('button', 'submit-btn');
    this.loginButton.textContent = 'Login';
    this.loginButton.type = 'submit';

    this.loginForm.append(title, this.username, this.password, this.loginButton);
    this.app.append(this.loginForm);
  }

  createElement(tag, className) {
    const element = document.createElement(tag);

    if (className)
      element.classList.add(className);

    return element;
  }

  duplicateElement(sourceElement, className) {
    const element = sourceElement.cloneNode(true);
  
    if (className) {
      element.classList.add(className);
    }
  
    return element;
  }

  createElementInDiv(tag, className) {
    const div = document.createElement('div');
    const element = document.createElement(tag);
    div.append(element);
    if (className)
      div.classList.add(className);
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
    this.logged = false;

    this.view.signInForm.addEventListener('submit', this.registerModel.bind(this));
    this.view.loginForm.addEventListener('submit', this.loginModel.bind(this));

    page('/', this.homePage.bind(this));
    page('/login', this.loginPage.bind(this));
    page('/signin', this.signInPage.bind(this));
    page.start();
  }

  homePage() {
    this.view.displayHomePage();
    this.logged = this.model.checkLogin();
  }

  signInPage() {
    this.view.displaySignInPagePage();
  }

  loginPage() {
    this.view.displayLoginPage();
  }

  registerModel(event) {
    event.preventDefault();
    this.model.register(this.view.username.firstChild.value, this.view.email.firstChild.value, this.view.password.firstChild.value);
  }

  loginModel(event) {
    event.preventDefault();
    this.model.login(this.view.username.firstChild.value, this.view.password.firstChild.value);
  }
}

// Instantiate the model, view, and controller
const view = new View();
const model = new Model(view);
const controller = new Controller(model, view);