export default class Model {
  constructor(view) {
    this.view = view;
  }

  async register(username, email, password) {
    try {
      const response = await fetch('php/auth/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password
        })
      });
      
      const data = await response.json();
      
      if (data.success)
        this.view.displaySignupSuccess(data);
      else
        this.view.displaySignupError(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async verifyRegister() {
    try {
      const params = (new URL(document.location)).searchParams;
      const token = params.get('token');
      
      const response = await fetch(`php/auth/verify_register.php?token=${token}`);
      
      const data = await response.json();
      
      this.view.displayActivateRegister(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async login(username, password) {
    try {
      const response = await fetch('php/auth/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });
      
      const data = await response.json();
      
      if (data.success)
        window.location.href = 'https://localhost/';
      else
        this.view.displayLoginError(data);
      return data.success;
    }
    catch (error) {
      console.error('Error:', error);
    }
  }

  async checkLogin() {
    return fetch('php/auth/check_login.php')
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      return false;
    });
  }

  logout() {
    return fetch('php/auth/logout.php');
  }
}