export default class View {
  constructor() {
    this.app = this.getElement('#root');
    this.createHeaderButtons();
    this.createSignupPage();
    this.createLoginPage();
    this.uploadButton = this.createElement('input');
    this.mainContent = this.createElement('div', 'content');
    this.app.append(this.mainContent);
  }

  createHeaderButtons() {
    this.galleryLink = this.createElement('a', 'green');
    this.createLinkButton(this.galleryLink, '/', 'Home');
    this.editingLink = this.createElement('a', 'green');
    this.createLinkButton(this.editingLink, '/editing', 'Editing');
    this.loginLink = this.createElement('a');
    this.createLinkButton(this.loginLink, '/login', 'Log In');
    this.signupLink = this.createElement('a');
    this.createLinkButton(this.signupLink, '/signup', 'Sign Up');
    this.logoutLink = this.createElement('a', 'red');
    this.createLinkButton(this.logoutLink, '/', 'Log Out');
  }

  displayHeaderButtons(logged) {
    const headerButtons = this.getElement('#header-buttons');
    if (logged)
      headerButtons.replaceChildren(this.galleryLink, this.editingLink, this.logoutLink);
    else
      headerButtons.replaceChildren(this.galleryLink, this.loginLink, this.signupLink);
  }

  createSignupPage() {
    const title = this.createElementInDiv('h3');
    title.firstChild.textContent = 'Create your account';
    this.signupUsername = this.createElementInDiv('input', 'grid-center');
    this.signupUsername.firstChild.placeholder = 'Username';
    this.signupEmail = this.createElementInDiv('input', 'grid-center');
    this.signupEmail.firstChild.placeholder = 'Email';
    this.signupPassword = this.createElementInDiv('input', 'grid-center');
    this.signupPassword.firstChild.placeholder = 'Password';
    this.signupPassword.firstChild.type = 'password';
    this.signupButton = this.createElement('button', 'submit-button');
    this.signupButton.textContent = 'Create'
    this.signupButton.type = 'submit';
    this.signupErrorArea = this.createElementInDiv('p', 'response-area');
    this.signupForm = this.createElement('form', 'align-form');
    this.signupForm.append(title, this.signupUsername, this.signupEmail, this.signupPassword, this.signupButton, this.signupErrorArea);
  }

  displaySignupPage() {
    this.resetInput([this.signupUsername.firstChild, this.signupEmail.firstChild, this.signupPassword.firstChild]);
    this.signupErrorArea.firstChild.textContent = '';
    this.mainContent.replaceChildren(this.signupForm);
  }

  displaySignupSuccess() {
    const confirm = this.createElementInDiv('h3', 'response-area');
    confirm.firstChild.textContent = 'We sent you an email.';
    const instructions = this.createElement('h3');
    instructions.textContent = 'Please click on the provided link in the email to confirm your account.';
    confirm.appendChild(instructions);
    this.signupForm.replaceChildren(confirm);
    this.mainContent.replaceChildren(this.signupForm);
  }

  displaySignupError(data) {
    this.signupErrorArea.firstChild.textContent = data.error;
  }

  createLoginPage() {
    const title = this.createElementInDiv('h3');
    title.firstChild.textContent = 'Log In';
    this.loginUsername = this.createElementInDiv('input', 'grid-center');
    this.loginUsername.firstChild.placeholder = 'Username';
    this.loginPassword = this.createElementInDiv('input', 'grid-center');
    this.loginPassword.firstChild.placeholder = 'Password';
    this.loginPassword.firstChild.type = 'password';
    this.loginButton = this.createElement('button', 'submit-button');
    this.loginButton.textContent = 'Log In';
    this.loginButton.type = 'submit';
    this.loginErrorArea = this.createElementInDiv('p', 'response-area');
    this.loginForm = this.createElement('form', 'align-form');
    this.loginForm.append(title, this.loginUsername, this.loginPassword, this.loginButton, this.loginErrorArea);
  }

  displayLoginPage() {
    this.resetInput([this.loginUsername.firstChild, this.loginPassword.firstChild]);
    this.loginErrorArea.firstChild.textContent = '';
    this.mainContent.replaceChildren(this.loginForm);
  }

  displayLoginError(data) {
    this.loginErrorArea.firstChild.textContent = data.error;
  }

  displayNotFoundPage() {
    const notFound = this.createElement('h2');
    notFound.textContent = 'Page not found.';
    this.mainContent.replaceChildren(notFound);
  }

  displayActivateRegister(data) {
    const response = this.createElement('h2');
    response.textContent = data.message;
    const loginLink = this.createElement('a');
    this.createLinkButton(loginLink, '/login', 'Log In');
    loginLink.firstChild.classList.add('submit-button');
    this.mainContent.replaceChildren(response);
    if (data.success)
      this.mainContent.append(loginLink);
  }

  createEditing() {
    this.editing = this.createElement('div', 'editing-container');
    this.mainSection = this.createElement('div', 'editing-main');
    this.webcamPreview = this.createElement('div', 'webcam-preview');
    this.superposableImages = this.createElement('div', 'superposable-images');
    this.uploadButton.type = 'file';
    this.captureButton = this.createElement('button', 'capture-button');
    this.mainSection.append(this.webcamPreview, this.superposableImages, this.uploadButton, this.captureButton);
    this.sideSection = this.createElement('div', 'editing-side');
    this.thumbnailContainer = this.createElement('div', 'thumbnail-container');
    this.sideSection.append(this.thumbnailContainer);
    this.editing.append(this.mainSection, this.sideSection);
  }

  displayEditingPage(logged) {
    if (logged) {
      if (this.editing === undefined)
        this.createEditing();
      this.mainContent.replaceChildren(this.editing);
    }
    else {
      const noAccess = this.createElement('h2');
      noAccess.textContent = 'You must be connected to access this page.';
      this.mainContent.replaceChildren(noAccess);
    }
  }

  displayHomePage() {
    const title = this.createElement('h2');
    title.textContent = 'Home Page';
    this.mainContent.replaceChildren(title);
  }

  // Utils functions
  resetInput(inputs) {
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = '';
    }
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