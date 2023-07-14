import page from "//unpkg.com/page@1.11.6/page.mjs";

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.logged = false;

    this.initialize();

    this.view.signupForm.addEventListener('submit', this.registerModel.bind(this));
    this.view.loginForm.addEventListener('submit', this.loginModel.bind(this));
    this.view.logoutLink.addEventListener('click', this.logoutModel.bind(this));
    this.view.uploadButton.addEventListener('click', this.displayUpload.bind(this));
    // this.view.uploadForm.addEventListener('submit', this.displayUpload.bind(this));

    page('/', this.homePage.bind(this));
    page('/signup', this.registerPage.bind(this));
    page('/login', this.loginPage.bind(this));
    page('/activate', this.activateRegisterPage.bind(this));
    page('/editing', this.editingPage.bind(this));
    page('*', this.notFoundPage.bind(this));
    page.start();
  }

  async initialize() {
    this.logged = await this.model.checkLogin();
    this.view.displayHeaderButtons(this.logged);
    if (this.logged) {
      this.view.createEditing();
      if (page.current === '/editing')
        this.view.displayEditingPage();
    }
  }

  homePage() {
    this.view.displayHomePage();
  }

  registerPage() {
    this.view.displaySignupPagePage();
  }
  
  activateRegisterPage() {
    this.model.verifyRegister();
  }

  loginPage() {
    this.view.displayLoginPage();
  }

  editingPage() {
    this.view.displayEditingPage();
  }

  notFoundPage() {
    this.view.displayNotFoundPage();
  }

  registerModel(event) {
    event.preventDefault();
    this.model.register(this.view.username.firstChild.value, this.view.email.firstChild.value, this.view.password.firstChild.value);
  }

  loginModel(event) {
    event.preventDefault();
    this.model.login(this.view.username.firstChild.value, this.view.password.firstChild.value);
  }

  logoutModel() {
    this.model.logout()
    .then(() => location.reload());
  }

  displayUpload() {
   this.view.displayUpload(); 
  }
}