export default class View {
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

  displayNotFoundPage() {
    this.refreshRoot();
    const notFound = this.createElementInDiv('h2');
    notFound.firstChild.textContent = 'Page not found';
    this.loginForm.append(notFound);
    this.app.append(this.loginForm);
  }

  displayActivateRegisterPage() {
    const a = 1
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