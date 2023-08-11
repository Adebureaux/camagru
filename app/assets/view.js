export default class View {
  constructor() {
    this.app = this.getElement('#root');
    this.createHeaderButtons();
    this.createSignupPage();
    this.createLoginPage();
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

    this.editing.style.height = `calc(100vh - ${this.headerHeight}px - ${this.footerHeight}px)`;

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
      this.pastedImage[i] = imgElement.cloneNode(false);
      this.pastedImage[i].classList.add('pasted-image');
      imgElement.id = i++;
      this.superposableImages.appendChild(imgElement);
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
  
    const previewRect = this.webcamPreview?.firstChild.getBoundingClientRect();
    if (!previewRect)
      return;
      
    const cursorX = (event.clientX - previewRect.left) / previewRect.width * 100;
    const cursorY = (event.clientY - previewRect.top) / previewRect.height * 100;
    
    const imageWidth = selectedImage.width;
    const imageHeight = selectedImage.height;
    const centerX = cursorX - (imageWidth / previewRect.width) * 100;
    const centerY = cursorY - (imageHeight / previewRect.height) * 100;

    this.pastedImage[this.sid].style.position = 'absolute';
    this.pastedImage[this.sid].style.left = `${centerX}%`;
    this.pastedImage[this.sid].style.top = `${centerY}%`;
    this.webcamPreview.append(this.pastedImage[this.sid]);
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
      const imageElement = document.createElement('img');
      imageElement.classList.add('thumbnails');
      imageElement.src = "data:image/png;base64," + thumbnail.image_data;
      this.sideSection.append(imageElement);
    }
  }

  instantThumbnail(thumbnail) {
    console.log(thumbnail);
    const imageElement = document.createElement('img');
    imageElement.classList.add('thumbnails');
    imageElement.src = "data:image/png;base64," + thumbnail.image_data;
    this.sideSection.prepend(imageElement);
  }

  async displayNoWebcamDefault() {
    if (this.webcamPreview) {
      const response = await fetch("/assets/images/default.jpg");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const defaultImageBlob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        this.webcamPreview.innerHTML = `<img src="${reader.result}" alt="Default Image" class="edit-area">`;
      };
      reader.readAsDataURL(defaultImageBlob);
    }
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