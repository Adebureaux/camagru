import page from "//unpkg.com/page@1.11.6/page.mjs";

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.model.checkLogin().then(logged => this.view.displayHeaderButtons(logged))

    this.view.signupForm.addEventListener('submit', this.registerModel.bind(this));
    this.view.loginForm.addEventListener('submit', this.loginModel.bind(this));
    this.view.logoutLink.addEventListener('click', this.logoutModel.bind(this));
    this.view.uploadButton.addEventListener('click', this.uploadModel.bind(this));

    page('/', this.homePage.bind(this));
    page('/signup', this.registerPage.bind(this));
    page('/login', this.loginPage.bind(this));
    page('/activate', this.activateRegisterPage.bind(this));
    page('/editing', this.editingPage.bind(this));
    page('*', this.notFoundPage.bind(this));
    page.start();
  }

  homePage() {
    this.view.displayHomePage();
  }

  registerPage() {
    this.view.displaySignupPage();
  }
  
  activateRegisterPage() {
    this.model.verifyRegister()
    .then(data => this.view.displayActivateRegister(data));
  }

  loginPage() {
    this.view.displayLoginPage();
  }

  editingPage() {
    this.model.checkLogin()
    .then(logged => this.view.displayEditingPage(logged));
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
        this.view.displaySignupError();
    })
  }

  loginModel(event) {
    event.preventDefault();
    this.model.login(this.view.loginUsername.firstChild.value, this.view.loginPassword.firstChild.value)
    .then(data => {
      if (data.success)
        window.location.href = 'https://localhost/editing';
      else
        this.view.displayLoginError(data);
    })
  }

  logoutModel() {
    this.model.logout().then(() => this.view.displayHeaderButtons(false));
  }

  uploadModel() {
    this.view.uploadButton.addEventListener('change', () => {
      const file = this.view.uploadButton.files[0];
      if (file && isImageFile(file)) {
        const reader = new FileReader();
        reader.onload = () => {
          this.view.webcamPreview.innerHTML = `<img src="${reader.result}" alt="Uploaded Image">`;
        };
        reader.readAsDataURL(file);
      } else {
        this.view.webcamPreview.innerHTML = 'Invalid image file. Please select a GIF or PNG file.';
      }
    });
  
    function isImageFile(file) {
      const fileType = file.type;
      return fileType === 'image/gif' || fileType === 'image/png';
    }
  }
}