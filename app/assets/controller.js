import page from "//unpkg.com/page@1.11.6/page.mjs";

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.checkLogin().then(logged => {
      this.view.displayHeaderButtons(logged);
    })

    this.view.signupForm.addEventListener('submit', this.registerModel.bind(this));
    this.view.loginForm.addEventListener('submit', this.loginModel.bind(this));
    this.view.logoutLink.addEventListener('click', this.logoutModel.bind(this));
    this.view.uploadButton.addEventListener('click', this.uploadImage.bind(this));
    this.view.captureButton.addEventListener('click', this.captureModel.bind(this));

    page('/', this.homePage.bind(this));
    page('/signup', this.registerPage.bind(this));
    page('/login', this.loginPage.bind(this));
    page('/activate', this.activateRegisterPage.bind(this));
    page('/editing', this.editingPage.bind(this));
    page('*', this.notFoundPage.bind(this));
    page.start();
  }

  async checkLogin() {
    const response = await this.model.checkLogin();
    return (response);
  }

  homePage() {
    this.view.displayHomePage();
  }

  registerPage() {
    this.checkLogin().then(logged => {
      if (!logged)
        this.view.displaySignupPage();
      else
        page.redirect('/');
    })
  }
  
  activateRegisterPage() {
    this.model.verifyRegister()
    .then(data => this.view.displayActivateRegister(data));
  }

  loginPage() {
    this.checkLogin().then(logged => {
      if (!logged)
        this.view.displayLoginPage();
      else
        page.redirect('/');
    })
  }

  editingPage() {
    this.checkLogin()
    .then(logged => {
      this.view.displayEditingPage(logged);
      this.model.videoStream()
      .then(stream => {
        this.view.webcamPreview.innerHTML = `<video autoplay class='edit-area'></video>`;
        this.view.webcamPreview.firstChild.srcObject = stream;
      })
      .catch(() => {});
      this.model.getUserImages()
      .then(thumbnails => {
        this.view.displayThumbnails(thumbnails.images);
      })
      .catch(e => console.log(e));
    });
  }

  notFoundPage() {
    this.view.displayNotFoundPage();
  }

  registerModel(event) {
    event.preventDefault();
    this.model.register(this.view.signupUsername.firstChild.value, this.view.signupEmail.firstChild.value, this.view.signupPassword.firstChild.value)
    .then(data => {
      if (data.success)
        this.view.displaySignupSuccess();
      else
        this.view.displaySignupError(data);
    })
  }

  loginModel(event) {
    event.preventDefault();
    this.model.login(this.view.loginUsername.firstChild.value, this.view.loginPassword.firstChild.value)
    .then(data => {
      if (data.success) {
        page.redirect('/');
        this.view.displayHeaderButtons(true);
      }
      else
        this.view.displayLoginError(data);
    })
  }

  logoutModel() {
    this.model.logout().then(() => this.view.displayHeaderButtons(false));
  }

  uploadImage() {
    this.view.uploadButton.addEventListener('change', () => {
      const file = this.view.uploadButton.files[0];
      if (file && isImageFile(file)) {
        const reader = new FileReader();
        reader.onload = () => {
          this.view.webcamPreview.innerHTML = `<img src="${reader.result}" alt="Uploaded Image" class="edit-area">`;
        };
        reader.readAsDataURL(file);
      }
      else {
        this.view.webcamPreview.innerHTML = 'Invalid image file. Please select a GIF, PNG, JPG or JPEG file.';
      }
    });
  
    function isImageFile(file) {
      return file.type === 'image/gif' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg';
    }
  }

  captureModel() {
    // console.log(this.captureImage());
    const pastedImage = this.view.getElement('.pasted-image');
    if (pastedImage)
      this.model.capture(this.captureImage(), pastedImage.src, {x: parseFloat(pastedImage.style.left), y: parseFloat(pastedImage.style.top)});
  }

  captureImage() {
    const content = this.view.webcamPreview.firstChild;

    if (content.tagName === 'IMG') {
      return content.src;
    }
    else if (content.tagName === 'VIDEO') {
      const canvas = document.createElement('canvas');
      canvas.width = content.videoWidth;
      canvas.height = content.videoHeight;

      const context = canvas.getContext('2d');
      context.drawImage(content, 0, 0, content.videoWidth, content.videoHeight);

      return canvas.toDataURL('image/png');
    }
    return null;
  }
}