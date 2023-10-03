export default class View {
  constructor(model) {
    this.model = model;
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
    this.galleryLink = this.createElement('a');
    this.createLinkButton(this.galleryLink, '/', 'Home');
    this.editingLink = this.createElement('a');
    this.createLinkButton(this.editingLink, '/editing', 'Edit');
    this.loginLink = this.createElement('a');
    this.createLinkButton(this.loginLink, '/login', 'Log In');
    this.signupLink = this.createElement('a');
    this.createLinkButton(this.signupLink, '/signup', 'Sign Up');
    this.logoutLink = this.createElement('a', 'red');
    this.createLinkButton(this.logoutLink, '/', 'Log Out');
    this.settingsLink = this.createElement('a');
    this.createLinkButton(this.settingsLink, '/settings', 'Settings');
  }

  displayHeaderButtons(logged) {
    const headerButtons = this.getElement('#header-buttons');
    if (logged)
      headerButtons.replaceChildren(this.galleryLink, this.editingLink, this.settingsLink, this.logoutLink);
    else
      headerButtons.replaceChildren(this.galleryLink, this.loginLink, this.signupLink);
  }

  createSignupPage() {
    const title = this.createElementInDiv('h1');
    title.firstChild.textContent = 'Create your account';
    this.signupUsername = this.createElementInDiv('input', 'grid-center');
    this.signupUsername.firstChild.placeholder = 'Username';
    this.signupUsername.firstChild.id = 'username';
    this.signupUsername.firstChild.autocomplete = true;
    this.signupEmail = this.createElementInDiv('input', 'grid-center');
    this.signupEmail.firstChild.placeholder = 'Email';
    this.signupEmail.firstChild.id = 'email';
    this.signupEmail.firstChild.autocomplete = true;
    this.signupPassword = this.createElementInDiv('input', 'grid-center');
    this.signupPassword.firstChild.placeholder = 'Password';
    this.signupPassword.firstChild.type = 'password';
    this.signupPassword.firstChild.id = 'password';
    this.signupButton = this.createElement('button', 'submit-button');
    this.signupButton.textContent = 'Create'
    this.signupButton.type = 'submit';
    this.signupErrorArea = this.createElementInDiv('p', 'response-area');
    this.signupErrorArea.style.paddingTop = '20px';
    this.signupForm = this.createElement('form', 'align-form');
    this.signupForm.append(title, this.signupUsername, this.signupEmail, this.signupPassword, this.signupButton, this.signupErrorArea);
  }

  displaySignupPage() {
    this.resetInput([this.signupUsername.firstChild, this.signupEmail.firstChild, this.signupPassword.firstChild]);
    this.signupErrorArea.firstChild.textContent = '';
    this.mainContent.replaceChildren(this.signupForm);
  }

  displaySignupSuccess() {
    const confirm = this.createElementInDiv('h2', 'align-form');
    confirm.firstChild.textContent = 'We sent you an email.';
    const instructions = this.createElement('h3');
    instructions.textContent = 'Please click on the provided link in the email to confirm your account.';
    confirm.appendChild(instructions);
    this.mainContent.replaceChildren(confirm);
  }

  displaySignupError(data) {
    this.signupErrorArea.firstChild.textContent = data.error;
  }

  createLoginPage() {
    const title = this.createElementInDiv('h1');
    title.firstChild.textContent = 'Log In';
    this.loginUsername = this.createElementInDiv('input', 'grid-center');
    this.loginUsername.firstChild.placeholder = 'Username';
    this.loginUsername.firstChild.id = 'username';
    this.loginUsername.firstChild.autocomplete = true;
    this.loginPassword = this.createElementInDiv('input', 'grid-center');
    this.loginPassword.firstChild.placeholder = 'Password';
    this.loginPassword.firstChild.type = 'password';
    this.loginPassword.firstChild.id = 'password';
    this.loginButton = this.createElement('button', 'submit-button');
    this.loginButton.textContent = 'Log In';
    this.loginButton.type = 'submit';
    this.forgotPasswordLink = this.createElement('a', 'link');
    this.forgotPasswordLink.textContent = 'Forgot your password ?';
    this.forgotPasswordLink.addEventListener('click', this.forgotPasswordPage.bind(this));
    this.loginErrorArea = this.createElementInDiv('p', 'response-area');
    this.loginErrorArea.style.paddingTop = '20px';
    this.loginForm = this.createElement('form', 'align-form');
    this.loginForm.append(title, this.loginUsername, this.loginPassword, this.loginButton, this.forgotPasswordLink, this.loginErrorArea);
  }

  displaySettingsPage(user) {
    if (user.success) {
      this.userData = user.data;

      const title = this.createElementInDiv('h1');
      title.firstChild.textContent = 'Settings';
  
      this.settings = this.createElement('div', 'text-center');
    
      this.changeUsername = this.createElementInDiv('input', 'align-flex');
      this.changeUsernameTitle = this.createElement('p', 'settings-title');
      this.changeUsernameTitle.textContent = 'Change your username';
      this.changeUsername.firstChild.id = 'changeUsername'
      this.changeUsername.firstChild.value = this.userData.username;
      this.changeUsernameButton = this.createElement('button');
      this.changeUsernameButton.textContent = 'Send';
      this.changeUsernameError = this.createElementInDiv('p', 'response-area');
      this.changeUsername.append(this.changeUsernameButton);

      this.changeEmail = this.createElementInDiv('input', 'align-flex');
      this.changeEmailTitle = this.createElement('p', 'settings-title');
      this.changeEmailTitle.textContent = 'Change your email';
      this.changeEmail.firstChild.id = 'changeEmail'
      this.changeEmail.firstChild.value = this.userData.email;
      this.changeEmailButton = this.createElement('button');
      this.changeEmailButton.textContent = 'Send';
      this.changeEmailError = this.createElementInDiv('p', 'response-area');
      this.changeEmail.append(this.changeEmailButton);

      this.resetPassword = this.createElementInDiv('button', 'align-flex');
      this.resetPassword.firstChild.textContent = 'Reset your password';
      this.resetPassword.firstChild.classList.add('full-lenght');
      this.resetPasswordError = this.createElementInDiv('p', 'response-area');

      this.notifications = this.createElementInDiv('input', 'align-flex');
      this.notifications.firstChild.setAttribute('type', 'checkbox');
      this.notifications.firstChild.id = 'notifications';
      this.notifications.firstChild.checked = this.userData.notification;
      const notifLabel = 'Email notifications';
      this.notifications.prepend(notifLabel);

      this.settings.append(title);
      this.settings.append(this.changeUsernameTitle, this.changeUsername, this.changeUsernameError);
      this.settings.append(this.changeEmailTitle, this.changeEmail, this.changeEmailError);
      
      this.settings.append(this.resetPassword, this.resetPasswordError, this.notifications);
      this.mainContent.replaceChildren(this.settings);
    }
    else
      this.displayNoAccess();
  }

  forgotPasswordPage() {
    const title = this.createElement('h2');
    title.innerText = 'Forgot your password';
    this.forgotPasswordEmail = this.createElementInDiv('input', 'grid-center');
    this.forgotPasswordEmail.firstChild.placeholder = 'Email';
    this.forgotPasswordEmail.firstChild.id = 'email';
    this.forgotPasswordEmail.firstChild.autocomplete = true;
    this.forgotPasswordSendMail = this.createElement('button', 'submit-button');
    this.forgotPasswordSendMail.innerText = 'Send';
    this.forgotPasswordSendMail.type = 'submit';
    this.forgotPasswordErrorArea = this.createElementInDiv('p', 'response-area');
    this.forgotPasswordErrorArea.style.paddingTop = '20px';
    this.forgotPasswordForm.replaceChildren(title, this.forgotPasswordEmail, this.forgotPasswordSendMail, this.forgotPasswordErrorArea);
    this.mainContent.replaceChildren(this.forgotPasswordForm);
  }

  displayPasswordReset() {
    this.newPasswordForm = this.createElement('form', 'align-form');
    const title = this.createElement('h2');
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
    this.newPasswordErrorArea.style.paddingTop = '20px';
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

  createEditing() {
    this.editing = this.createElement('div', 'editing-container');
    
    this.editingMain = this.createElement('div', 'editing-main');
    this.webcamPreview = this.createElement('div', 'webcam-preview');
    this.editArea = this.createElement('div', 'edit-area');
    this.superposableImages = this.createElement('div', 'superposable-images');
    this.uploadButton.type = 'file';
    
    this.addSuperposableImages(['/assets/images/superposable_1.png', '/assets/images/superposable_2.png', '/assets/images/superposable_3.png']);
    this.editArea.addEventListener('click', this.onEditAreaClick.bind(this));
    
    this.editingButtons = this.createElement('div', 'editing-buttons');
    this.editingButtons.append(this.uploadButton, this.captureButton);
    this.editingMain.append(this.webcamPreview, this.editingButtons, this.superposableImages);
    this.sideSection = this.createElement('div', 'editing-side');
    
    this.webcamPreview.append(this.editArea);
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

  onEditAreaClick(event) {
    if (this.editArea.firstChild && this.editArea.firstChild.tagName === 'P')
      return;

    const selectedImage = this.superposableImages.querySelector('.selected');
    if (!selectedImage)
      return;

    const previous = this.getElement('.pasted-image');
    previous?.remove();
  
    const previewRect = this.editArea.firstChild?.getBoundingClientRect();

    if (!previewRect)
      return;
    
    const imageWidth = selectedImage.naturalWidth / 2;
    const imageHeight = selectedImage.naturalHeight / 2;
    
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
    this.editArea.append(this.pastedImage[this.sid]);
    this.captureButton.disabled = false;
  }    
  
  displayEditingPage(logged) {
    if (logged) {
      if (this.editing === undefined)
        this.createEditing();
      this.mainContent.replaceChildren(this.editing);
    }
    else
      this.displayNoAccess();
  }

  displayNoAccess() {
    const noAccess = this.createElement('h2', 'align-form');
    noAccess.textContent = 'Sorry, you are not allowed to access this page.';
    this.mainContent.replaceChildren(noAccess);
  }

  displayThumbnails(thumbnails) {
    for (const thumbnail of thumbnails) {
      this.sideSection.append(this.createThumbnail(thumbnail.image_data, thumbnail.id));
      this.sideSection.append(this.createElement('hr', 'sep'));
    }
  }

  instantThumbnail(thumbnail) {
    this.sideSection.prepend(this.createElement('hr', 'sep'));
    this.sideSection.prepend(this.createThumbnail(thumbnail.image_data, thumbnail.id));
  }

  createThumbnail(image_data, id) {
    const imageElement = this.createElementInDiv('img', 'thumbnails');
    imageElement.firstChild.src = "data:image/jpeg;base64," + image_data;
    const close = this.createElement('div', 'close-button');
    close.innerText = 'X';
    close.addEventListener('click', () => {
      this.model.deleteImage(id)
      .then((data) => {
        if (data.success) {
          imageElement.remove();
          const sep = document.querySelector('.sep');
          sep.remove();
        }
      })
    });
    imageElement.append(close);
    return imageElement;
  }

  async displayEmptyHomePage() {
    const title = this.createElement('h2', 'align-form');
    title.textContent = 'No feed available.';
    this.mainContent.replaceChildren(title);
  }
  
  createPost(image) {
    const postContainer = this.createElement('div', 'post-container');
    const imageElement = this.createElementInDiv('img', 'img-container');
    imageElement.firstChild.src = "data:image/jpeg;base64," + image.image_data;
    postContainer.append(imageElement);
    return (postContainer);
  }

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