export default class Model {
  constructor(view) {
    this.view = view;
  }

  register(username, email, password) {
    fetch('auth/register.php', {
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
    .then(data => {
      if (data.success)
        this.view.displaySignInSuccess(data);
      else
        this.view.displaySignInError(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  verifyRegister() {
    let params = (new URL(document.location)).searchParams;
    let token = params.get('token');
    fetch(`auth/verify_register.php?token=${token}`)
    .then(response => response.json())
    .then(data => {
      // Traitez la réponse de la validation du compte
      if (data.success) {
        // Compte validé avec succès
        console.log('Account validation successful!');
      } else {
        // Validation du compte échouée
        console.log('Failed to validate account. Error:', data.error);
      }
    })
    .catch(error => {
      // Gérez les éventuelles erreurs survenues lors de la requête
      console.error('Error:', error);
    });
  }

  login(username, password) {
    fetch('auth/login.php', {
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
    .then(data => {
      if (data.success) {
        // this.view.displayHomePage();
        window.location.href = 'https://localhost';
        console.log(data);
      }
      else
        console.log('error: ', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  checkLogin() {
    fetch('auth/check_login.php')
    .then(response => response.json())
    .then(data => {
      if (data.logged) {
        console.log('You are logged in');
        // User is logged in
        // document.querySelector('loginStatus').textContent = 'You are connected';
      } else {
        console.log('You are NOT logged in');
        // User is not logged in
        // document.querySelector('loginStatus').textContent = 'Please log in';
      }
      return data.logged;
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
}