import page from "//unpkg.com/page@1.11.6/page.mjs";

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.logged = false;

    this.view.signInForm.addEventListener('submit', this.registerModel.bind(this));
    this.view.loginForm.addEventListener('submit', this.loginModel.bind(this));

    page('/', this.homePage.bind(this));
    page('/signin', this.registerPage.bind(this));
    page('/login', this.loginPage.bind(this));
    page('/activate', this.activateRegisterPage.bind(this));
    page('*', this.notFoundPage.bind(this));
    page.start();
  }

  homePage() {
    this.view.displayHomePage();
    this.logged = this.model.checkLogin();
  }

  registerPage() {
    this.view.displaySignInPagePage();
  }

  registerModel(event) {
    event.preventDefault();
    this.model.register(this.view.username.firstChild.value, this.view.email.firstChild.value, this.view.password.firstChild.value);
  }
  
  activateRegisterPage() {
    this.model.verifyRegister();
    this.view.displayActivateRegisterPage();
  }

  loginPage() {
    this.view.displayLoginPage();
  }

  loginModel(event) {
    event.preventDefault();
    this.model.login(this.view.username.firstChild.value, this.view.password.firstChild.value);
  }

  notFoundPage() {
    this.view.displayNotFoundPage();
  }
}