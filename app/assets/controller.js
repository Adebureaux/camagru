import page from "//unpkg.com/page@1.11.6/page.mjs";

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.model.checkLogin()
    .then(data => {
      console.log('model constructor, is logged ?', data);
      this.logged = data;
      this.view.displayHeaderButtons(this.logged);
    })

    this.view.signupForm.addEventListener('submit', this.registerModel.bind(this));
    this.view.loginForm.addEventListener('submit', this.loginModel.bind(this));
    this.view.logoutLink.addEventListener('click', this.logoutModel.bind(this));

    page('/', this.homePage.bind(this));
    page('/signup', this.registerPage.bind(this));
    page('/login', this.loginPage.bind(this));
    page('/activate', this.activateRegisterPage.bind(this));
    page('*', this.notFoundPage.bind(this));
    page.start();
  }

  homePage() {
    this.view.displayHomePage();
  }

  registerPage() {
    if (!this.logged)
      this.view.displaySignupPagePage();
  }

  registerModel(event) {
    event.preventDefault();
    this.model.register(this.view.username.firstChild.value, this.view.email.firstChild.value, this.view.password.firstChild.value);
  }
  
  activateRegisterPage() {
    this.model.verifyRegister();
  }

  loginPage() {
    if (!this.logged)
      this.view.displayLoginPage();
    else
      this.view.displayHomePage();
  }

  loginModel(event) {
    event.preventDefault();
    this.model.login(this.view.username.firstChild.value, this.view.password.firstChild.value);
  }

  logoutModel() {
    this.model.logout()
    .then(() => this.view.displayHeaderButtons());
  }

  notFoundPage() {
    this.view.displayNotFoundPage();
  }
}