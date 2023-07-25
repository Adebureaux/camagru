export default class Model {
  async register(username, email, password) {
    return fetch('/php/auth/register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password
      })
    })
    .then(response => response.json())
    .then(data => data);
  }

  async verifyRegister() {
    const params = (new URL(document.location)).searchParams;
    const token = params.get('token');
    return fetch(`/php/auth/verify_register.php?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => data);
  }

  async login(username, password) {
    return fetch('/php/auth/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    .then(response => response.json())
    .then(data => data);
  }

  async checkLogin() {
    return fetch('/php/auth/check_login.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => data);
  }

  async logout() {
    return fetch('/php/auth/logout.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async videoStream() {
    return navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => stream)
  }

  async capture(img) {
    fetch('/php/images/save_image.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => data);
  }
}