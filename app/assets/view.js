export default class View {
  constructor() {
    this.app = this.getElement('#root');
    this.createHeaderButtons();
    this.createSignupPage();
    this.createLoginPage();
    this.forgotPasswordForm = this.createElement('form', 'align-form');
    this.uploadButton = this.createElement('input');
    this.captureButton = this.createElement('button', 'capture-button');
    this.captureButton.disabled = true;
    this.mainContent = this.createElement('div', 'content');
    this.headerHeight = document.querySelector('header').offsetHeight + 20;
    this.footerHeight = document.querySelector('footer').offsetHeight + 20;
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
    const confirm = this.createElementInDiv('h3');
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
    this.forgotPasswordLink = this.createElement('a', 'forgot-password');
    this.forgotPasswordLink.textContent = 'Forgot your password ?';
    this.forgotPasswordLink.addEventListener('click', this.forgotPasswordPage.bind(this));
    this.loginErrorArea = this.createElementInDiv('p', 'response-area');
    this.loginForm = this.createElement('form', 'align-form');
    this.loginForm.append(title, this.loginUsername, this.loginPassword, this.loginButton, this.forgotPasswordLink, this.loginErrorArea);
  }

  forgotPasswordPage() {
    const title = this.createElement('h3');
    title.innerText = 'Forgot your password';
    this.forgotPasswordEmail = this.createElementInDiv('input', 'grid-center');
    this.forgotPasswordEmail.firstChild.placeholder = 'Email';
    this.forgotPasswordSendMail = this.createElement('button', 'submit-button');
    this.forgotPasswordSendMail.innerText = 'Send';
    this.forgotPasswordSendMail.type = 'submit';
    this.forgotPasswordErrorArea = this.createElementInDiv('p', 'response-area');
    this.forgotPasswordForm.replaceChildren(title, this.forgotPasswordEmail, this.forgotPasswordSendMail, this.forgotPasswordErrorArea);
    this.mainContent.replaceChildren(this.forgotPasswordForm);
  }

  displayPasswordReset() {
    this.newPasswordForm = this.createElement('form', 'align-form');
    const title = this.createElement('h3');
    title.innerText = 'Reset your password';
    this.newPassword = this.createElementInDiv('input', 'grid-center');
    this.newPassword.firstChild.placeholder = 'New password';
    this.newPassword.firstChild.type = 'password';
    this.confirmNewPassword = this.createElementInDiv('input', 'grid-center');
    this.confirmNewPassword.firstChild.placeholder = 'Confirm new password';
    this.confirmNewPassword.firstChild.type = 'password';
    this.newPasswordButton = this.createElement('button', 'submit-button');
    this.newPasswordButton.innerText = 'Send';
    this.newPasswordButton.type = 'submit';
    this.newPasswordErrorArea = this.createElementInDiv('p', 'response-area');
    this.newPasswordForm.replaceChildren(title, this.newPassword, this.confirmNewPassword, this.newPasswordButton, this.newPasswordErrorArea);
    this.mainContent.replaceChildren(this.newPasswordForm);
  }

  displayForgotPasswordError(data) {
    this.forgotPasswordEmail.firstChild.value = '';
    this.forgotPasswordErrorArea.firstChild.textContent = data.error;
  }

  displayPasswordResetBadToken(data) {
    const response = this.createElement('h2', 'align-form');
    response.textContent = data.error;
    const homeLink = this.createElement('a');
    this.createLinkButton(homeLink, '/', 'Home');
    homeLink.firstChild.classList.add('submit-button');
    homeLink.firstChild.style.color = 'green';
    this.mainContent.replaceChildren(response);
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
    const notFound = this.createElement('p', 'align-form');
    notFound.textContent = 'Page not found';
    notFound.style.fontSize = '36px';
    this.mainContent.replaceChildren(notFound);
  }

  displayDataSuccessPage(data) {
    const response = this.createElement('h2', 'align-form');
    response.textContent = data.message;
    const loginLink = this.createElement('a');
    this.createLinkButton(loginLink, '/login', 'Log In');
    loginLink.firstChild.classList.add('submit-button');
    this.mainContent.replaceChildren(response);
    if (data.success)
      this.mainContent.append(loginLink);
  }

  editingContainerSizing() {
    if (window.innerWidth < 778)
      this.editing.style.height = 'auto';
    else
      this.editing.style.height = `calc(100vh - ${this.headerHeight}px - ${this.footerHeight}px)`;
  }

  createEditing() {
    this.editing = this.createElement('div', 'editing-container');

    this.editingContainerSizing();

    window.addEventListener('resize', this.editingContainerSizing());

    this.editingMain = this.createElement('div', 'editing-main');
    this.webcamPreview = this.createElement('div', 'webcam-preview');
    this.superposableImages = this.createElement('div', 'superposable-images');
    this.uploadButton.type = 'file';

    this.addSuperposableImages(['/assets/images/superposable_1.png', '/assets/images/superposable_2.png', '/assets/images/superposable_3.png']);
    this.webcamPreview.addEventListener('click', this.onWebcamPreviewClick.bind(this));

    this.editingButtons = this.createElement('div', 'editing-buttons');
    this.editingButtons.append(this.captureButton, this.uploadButton);
    this.editingMain.append(this.webcamPreview, this.superposableImages, this.editingButtons);
    this.sideSection = this.createElement('div', 'editing-side');
  
  
    this.editing.append(this.editingMain, this.sideSection);
  }

  addSuperposableImages(images) {
    let i = 0;
    this.sid = 0;
    this.pastedImage = []
    for (const image of images) {
      const imgElement = this.createImg(image);
      imgElement.src = image;
      imgElement.addEventListener('click', this.onSuperposableImageClick.bind(this));
      imgElement.id = i;
      this.superposableImages.appendChild(imgElement); 
      this.pastedImage[i] = this.createImg(image);
      this.pastedImage[i].src = image;
      this.pastedImage[i].classList.add('pasted-image');
      this.pastedImage[i].id = i++;
    }
    this.superposableImages.firstChild.classList.add('selected');
  }

  onSuperposableImageClick(event) {
    const selectedImages = this.superposableImages.querySelectorAll('.selected');
    selectedImages.forEach((image) => {
      image.classList.remove('selected');
    });
    const selectedImage = event.target;
    selectedImage.classList.add('selected');
    this.sid = selectedImage.id;
  }

  onWebcamPreviewClick(event) {
    if (this.webcamPreview.firstChild && this.webcamPreview.firstChild.tagName === 'P')
      return;

    const selectedImage = this.superposableImages.querySelector('.selected');
    if (!selectedImage)
      return;

    const previous = this.getElement('.pasted-image');
    previous?.remove();
  
    const previewRect = this.webcamPreview.firstChild?.getBoundingClientRect();

    console.log(previewRect);
    if (!previewRect)
      return;
    
    const imageWidth = selectedImage.naturalWidth / 2;
    const imageHeight = selectedImage.naturalHeight / 2;

    console.log(imageWidth, imageHeight);
    
    const cursorXPercent = (event.clientX - previewRect.left) / previewRect.width * 100;
    const cursorYPercent = (event.clientY - previewRect.top) / previewRect.height * 100;
    
    const imageWidthPercent = (imageWidth / previewRect.width) * 100;
    const imageHeightPercent = (imageHeight / previewRect.height) * 100;

    const offsetX = imageWidthPercent * 0.50;
    const offsetY = imageHeightPercent * 0.50;
    
    const centerX = cursorXPercent - imageWidthPercent / 2 - offsetX;
    const centerY = cursorYPercent - imageHeightPercent / 2 - offsetY;

    this.pastedImage[this.sid].style.position = 'absolute';
    this.pastedImage[this.sid].style.left = `${centerX}%`;
    this.pastedImage[this.sid].style.top = `${centerY}%`;
    this.webcamPreview.appendChild(this.pastedImage[this.sid]);
    this.captureButton.disabled = false;
  }
  
  displayEditingPage(logged) {
    if (logged) {
      if (this.editing === undefined)
        this.createEditing();
      this.mainContent.replaceChildren(this.editing);
    }
    else {
      const noAccess = this.createElement('h2', 'align-form');
      noAccess.textContent = 'Sorry, you are not allowed to access this page.';
      this.mainContent.replaceChildren(noAccess);
    }
  }

  displayThumbnails(thumbnails) {
    for (const thumbnail of thumbnails) {
      this.sideSection.append(this.createThumbnail(thumbnail.image_data));
      this.sideSection.append(this.createElement('hr', 'sep'));
    }
  }

  instantThumbnail(thumbnail) {
    this.sideSection.prepend(this.createElement('hr', 'sep'));
    this.sideSection.prepend(this.createThumbnail(thumbnail.image_data));
  }

  createThumbnail(image_data) {
    const imageElement = document.createElement('img');
    imageElement.classList.add('thumbnails');
    imageElement.src = "data:image/png;base64," + image_data;
    return imageElement;
  }

  displayHomePage() {
    const title = this.createElement('h2', 'align-form');
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

  createImg(src, className) {
    const img = this.createElement('img');
    img.src = src;
    if (className)
      img.classList.add(className);
    return img;
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