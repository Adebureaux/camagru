export default class View {
  constructor() {
    this.app = this.getElement('#root');

    this.username = this.createElementInDiv('input', 'grid-center');
    this.username.firstChild.placeholder = 'Username';
    
    this.password = this.createElementInDiv('input', 'grid-center');
    this.password.firstChild.placeholder = 'Password';
    this.password.firstChild.type = 'password';
    
    this.signupForm = this.createElement('form');
    this.loginForm = this.createElement('form');

    this.logoutLink = this.createElement('a', 'red');

    this.headerButtons = this.createElement('div', 'auth-buttons');

    this.mainArea = this.createElement('div', 'main');
    this.app.append(this.mainArea);
  }

  refreshMain() {
    this.mainArea.innerHTML = '';
  }

  resetInput() {
    this.username.firstChild.value = '';
    this.password.firstChild.value = '';
  }

  displayHeaderButtons(logged) {
    const header = this.getElement('#header');
    if (!logged) {
      this.headerButtons.innerHTML = '';
      const loginLink = this.createElement('a');
      this.createLinkButton(loginLink, '/login', 'Log In');
      const signupLink = this.createElement('a');
      this.createLinkButton(signupLink, '/signup', 'Sign Up');
      this.headerButtons.append(loginLink, signupLink);
    }
    else {
      this.createLinkButton(this.logoutLink, '/', 'Log Out');
      this.headerButtons.append(this.logoutLink);
    }
    header.append(this.headerButtons);
  }

  displayHomePage() {
    this.refreshMain();
    const test = this.createElement('div', 'loginStatus');
    this.mainArea.append(test);
  }

  displaySignupPagePage() {
    this.refreshMain();
    this.signupForm.innerHTML = '';
    this.resetInput();

    const title = this.createElementInDiv('h3');
    title.firstChild.textContent = 'Create your account';

    this.email = this.createElementInDiv('input', 'grid-center');
    this.email.firstChild.placeholder = 'Email';

    this.submitButton = this.createElement('button', 'submit-btn');
    this.submitButton.textContent = 'Create'
    this.submitButton.type = 'submit';

    this.signupErrorArea = this.createElementInDiv('p', 'response-area');

    this.signupForm.append(title, this.username, this.email, this.password, this.submitButton, this.signupErrorArea);
    this.mainArea.append(this.signupForm);
  }

  displaySignupSuccess() {
    this.refreshMain();
    this.signupForm.innerHTML = '';

    const confirm = this.createElementInDiv('h3', 'response-area');
    confirm.firstChild.textContent = 'We sent you an email.';
    const instructions = this.createElement('h3');
    instructions.textContent = 'Please click on the provided link in the email to confirm your account.';
    confirm.appendChild(instructions);

    this.signupForm.append(confirm);
    this.mainArea.append(this.signupForm);
  }

  displaySignupError(data) {
    this.signupErrorArea.firstChild.textContent = data.error;
  }

  displayLoginPage() {
    this.refreshMain();
    this.loginForm.innerHTML = '';
    this.resetInput();

    const title = this.createElementInDiv('h3');
    title.firstChild.textContent = 'Log In';

    this.loginButton = this.createElement('button', 'submit-btn');
    this.loginButton.textContent = 'Log In';
    this.loginButton.type = 'submit';

    this.logInErrorErrorArea = this.createElementInDiv('p', 'response-area');

    this.loginForm.append(title, this.username, this.password, this.loginButton, this.logInErrorErrorArea);
    this.mainArea.append(this.loginForm);
  }

  displayLogInError(data) {
    this.logInErrorErrorArea.firstChild.textContent = data.error;
  }

  displayNotFoundPage() {
    this.refreshMain();
    const notFound = this.createElement('h2');
    notFound.textContent = 'Error 404 : Page not found ...';
    this.mainArea.append(notFound);
  }

  displayActivateRegister(data) {
    this.refreshMain();
    const response = this.createElement('h2');
    response.textContent = data.message;

    const loginLink = this.createElement('a');
    this.createLinkButton(loginLink, '/login', 'Log In');
    loginLink.firstChild.classList.add('submit-btn');

    this.mainArea.append(response);
    if (data.success)
      this.mainArea.append(loginLink);
  }

  createLinkButton(link, href, text) {
    const button = this.createElement('button');
    link.href = href;
    button.textContent = text;
    link.appendChild(button);
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
      div.classList.add(className);
    return div;
  }

  getElement(selector) {
    const element = document.querySelector(selector);

    return element;
  }
}