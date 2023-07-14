export default class View {
  constructor() {
    this.app = this.getElement('#root');

    this.username = this.createElementInDiv('input', 'grid-center');
    this.username.firstChild.placeholder = 'Username';
    
    this.password = this.createElementInDiv('input', 'grid-center');
    this.password.firstChild.placeholder = 'Password';
    this.password.firstChild.type = 'password';
    
    this.signupForm = this.createElement('form', 'regular-margin');
    this.loginForm = this.createElement('form', 'regular-margin');

    this.uploadForm = this.createElement('form', 'upload-form');

    this.logoutLink = this.createElement('a', 'red');

    this.headerButtons = this.createElement('div', 'buttons');

    this.uploadButton = this.createElement('button');
    this.createNavigationButtons();
    this.createGallery();
    this.createNoAccess();

    this.mainArea = this.createElement('div', 'main');
    this.app.append(this.mainArea);
  }

  refreshMain(newView) {
    this.mainArea.innerHTML = '';
    this.mainArea.append(newView);
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
      this.headerButtons.append(this.galleryLink, loginLink, signupLink);
    }
    else {
      this.createLinkButton(this.logoutLink, '/', 'Log Out');
      this.headerButtons.append(this.galleryLink, this.editingLink, this.logoutLink);
    }
    header.append(this.headerButtons);
  }

  createNavigationButtons() {
    this.galleryLink = this.createElement('a', 'green');
    this.createLinkButton(this.galleryLink, '/', 'Home');
    this.editingLink = this.createElement('a', 'green');
    this.createLinkButton(this.editingLink, '/editing', 'Editing');
  }

  displayHomePage() {
    this.refreshMain(this.gallery);
  }

  createGallery() {
    this.gallery = this.createElement('div', 'gallery-container');
    const p = this.createElement('p');
    p.textContent = 'Home';
    this.gallery.append(p);
  }

  createEditing() {
    this.editing = this.createElement('div', 'editing-container');
    this.mainSection = this.createElement('div', 'editing-main');
    this.webcamPreview = this.createElement('div', 'webcam-preview');
    const superposableImages = this.createElement('div', 'superposable-images');
    this.uploadButton.textContent = 'Upload';
    const captureButton = this.createElement('button');
    captureButton.textContent = 'Capture';
    this.mainSection.append(this.webcamPreview, superposableImages, this.uploadButton, captureButton);
    const sideSection = this.createElement('div', 'editing-side');
    const thumbnailContainer = this.createElement('div', 'thumbnail-container');
    sideSection.append(thumbnailContainer);
    this.editing.append(this.mainSection, sideSection);
  }

  createNoAccess() {
    this.editing = this.createElement('h2', 'regular-margin');
    this.editing.textContent = 'You must be connected to access this page.';
  }

  displayEditingPage() {
     this.refreshMain(this.editing)
  }

  displayUpload() {
    const title = this.createElement('p');
    title.textContent = 'Upload an image';
    this.mainSection.replaceWith(title);
    // this.editing.replaceChildren(title);
    // this.editing.replaceWith(title);
  }


  displaySignupPagePage() {
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
    this.refreshMain(this.signupForm);
  }

  displaySignupSuccess() {
    this.signupForm.innerHTML = '';
    const confirm = this.createElementInDiv('h3', 'response-area');
    confirm.firstChild.textContent = 'We sent you an email.';
    const instructions = this.createElement('h3');
    instructions.textContent = 'Please click on the provided link in the email to confirm your account.';
    confirm.appendChild(instructions);

    this.signupForm.append(confirm);
    this.refreshMain(this.signupForm);
  }

  displaySignupError(data) {
    this.signupErrorArea.firstChild.textContent = data.error;
  }

  displayLoginPage() {
    this.loginForm.innerHTML = '';
    this.resetInput();

    const title = this.createElementInDiv('h3');
    title.firstChild.textContent = 'Log In';

    this.loginButton = this.createElement('button', 'submit-btn');
    this.loginButton.textContent = 'Log In';
    this.loginButton.type = 'submit';

    this.loginErrorErrorArea = this.createElementInDiv('p', 'response-area');

    this.loginForm.append(title, this.username, this.password, this.loginButton, this.loginErrorErrorArea);
    this.refreshMain(this.loginForm);
  }

  displayLoginError(data) {
    this.loginErrorErrorArea.firstChild.textContent = data.error;
  }

  displayNotFoundPage() {
    const notFound = this.createElement('h2', 'regular-margin');
    notFound.textContent = 'Page not found.';
    this.refreshMain(notFound);
  }

  displayActivateRegister(data) {
    const response = this.createElement('h2', 'regular-margin');
    response.textContent = data.message;

    const loginLink = this.createElement('a');
    this.createLinkButton(loginLink, '/login', 'Log In');
    loginLink.firstChild.classList.add('submit-btn');

    this.refreshMain(response);
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