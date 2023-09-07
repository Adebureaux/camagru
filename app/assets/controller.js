import page from "/lib/page.mjs";

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.checkLogin().then(logged => {
      this.view.displayHeaderButtons(logged);
    })

    this.view.signupForm.addEventListener('submit', this.registerModel.bind(this));
    this.view.forgotPasswordForm.addEventListener('submit', this.forgotPasswordModel.bind(this));
    this.view.loginForm.addEventListener('submit', this.loginModel.bind(this));
    this.view.logoutLink.addEventListener('click', this.logoutModel.bind(this));
    this.view.uploadButton.addEventListener('click', this.uploadImage.bind(this));
    this.view.captureButton.addEventListener('click', this.captureModel.bind(this));

    this.currentOffset = 0;
    this.thumbnailsFull = false;

    page('/', this.homePage.bind(this));
    page('/signup', this.registerPage.bind(this));
    page('/login', this.loginPage.bind(this));
    page('/activate', this.activateRegisterPage.bind(this));
    page('/password-reset', this.passwordResetPage.bind(this));
    page('/editing', this.editingPage.bind(this));
    page('/settings', this.settingsPage.bind(this));
    page('*', this.notFoundPage.bind(this));
    page.start();
  }

  async checkLogin() {
    const response = await this.model.checkLogin();
    return (response);
  }

  homePage() {
    this.model.getImages(0)
    .then(data => {
      console.log(data);
      this.view.displayHomePage(data.images);
    })
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
    .then(data => this.view.displayDataSuccessPage(data));
  }

  passwordResetPage() {
    this.model.verifyPasswordResetToken()
    .then(data => {
      if (data.success) {
        this.view.displayPasswordReset();
        this.view.newPasswordForm.addEventListener('submit', this.passwordResetModel.bind(this));
      }
      else
        this.view.displayPasswordResetBadToken(data);
      })
    }

  passwordResetModel(event) {
    event.preventDefault();
    if (this.view.newPassword.firstChild.value === this.view.confirmNewPassword.firstChild.value) {
      this.model.forgotPassword(this.view.newPassword.firstChild.value)
      .then(data => {
        if (data.success)
          this.view.displayDataSuccessPage(data);
        else
          this.view.newPasswordErrorArea.firstChild.textContent = data.error;
      })
    }
    else {
      this.view.newPasswordErrorArea.firstChild.textContent = 'Passwords does not match.';
    }
    this.view.newPassword.firstChild.value = '';
    this.view.confirmNewPassword.firstChild.value = '';
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
      this.model.getUserImages(this.currentOffset)
      .then(thumbnails => {
        if (thumbnails?.images) {
          this.view.displayThumbnails(thumbnails.images);
          this.currentOffset += 10;
          this.boundHandleScroll = this.handleScroll.bind(this);
          this.view.sideSection.addEventListener('scroll', this.boundHandleScroll);
        }
      })
      .catch(e => console.log(e));
    });
  }

  settingsPage() {
    this.model.getUserInfo()
    .then(data => {
        this.view.displaySettingsPage(data);
        this.view.changeUsernameButton.addEventListener('click', this.changeUsernameModel.bind(this));
        this.view.changeEmailButton.addEventListener('click', this.changeEmailModel.bind(this));
        this.view.resetPassword.firstChild.addEventListener('click', this.resetPasswordModel.bind(this));
        this.view.notifications.addEventListener('change', this.toggleNotificationsModel.bind(this));
    })
  }

  changeUsernameModel() {
    this.model.changeUsername(this.view.changeUsername.firstChild.value)
    .then(data => {
      if (data.success) {
        this.view.changeUsernameError.firstChild.style.color = 'green';
        this.view.changeUsernameError.firstChild.textContent = 'Username successfully changed.';
        this.view.userData.username = this.view.changeUsername.firstChild.value;
      }
      else {
        this.view.changeUsernameError.firstChild.style.color = 'red';
        this.view.changeUsernameError.firstChild.textContent = data.error;
        this.view.changeUsername.firstChild.value = this.view.userData.username;
        this.view.userData.username = this.view.changeUsername.firstChild.value;
      }
    })
  }

  changeEmailModel() {
    this.model.changeEmail(this.view.changeEmail.firstChild.value)
    .then(data => {
      if (data.success) {
        console.log('success');
        this.view.changeEmailError.firstChild.style.color = 'green';
        this.view.changeEmailError.firstChild.textContent = 'Email successfully changed.';
        this.view.userData.email = this.view.changeEmail.firstChild.value;
      }
      else {
        this.view.changeEmailError.firstChild.style.color = 'red';
        this.view.changeEmailError.firstChild.textContent = data.error;
        this.view.changeEmail.firstChild.value = this.view.userData.email;
      }
    })
  }

  resetPasswordModel() {
    this.model.forgotPassword(this.view.changeEmail.firstChild.value)
    .then(data => {
      if (data.success) {
        this.view.resetPasswordError.firstChild.style.color = 'green';
        this.view.resetPasswordError.firstChild.textContent = 'Email send successfully.';
      }
      else {
        this.view.resetPasswordError.firstChild.style.color = 'red';
        this.view.resetPasswordError.firstChild.textContent = data.error;
      }
    })
  }

  toggleNotificationsModel(event) {
    this.model.toggleNotifications(event.target.checked)
  }
  
  handleScroll(event) {
    const target = event.target;

    if (this.thumbnailsFull) {
      this.view.sideSection.removeEventListener('scroll', this.boundHandleScroll);
      return;
    }
    
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 1) {
      this.model.getUserImages(this.currentOffset)
      .then(thumbnails => {
        if (thumbnails?.images && thumbnails.images.length > 0) {
          this.view.displayThumbnails(thumbnails.images);
          this.currentOffset += 10;
        }
        else
          this.thumbnailsFull = true;
      })
      .catch(() => {});
    }
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

  forgotPasswordModel(event) {
    console.log(this.view.forgotPasswordEmail.firstChild.value)
    event.preventDefault();
    this.model.forgotPassword(this.view.forgotPasswordEmail.firstChild.value)
    .then(data => {
      if (data.success)
        this.view.displayDataSuccessPage(data);
      else
        this.view.displayForgotPasswordError(data);
    })
  }

  logoutModel() {
    this.model.logout()
    .then(() => this.view.displayHeaderButtons(false));
  }

  uploadImage() {
    this.view.uploadButton.addEventListener('change', () => {
      const file = this.view.uploadButton.files[0];
      if (file && isImageFile(file)) {
        if (file.size > 1048576) {
          this.view.webcamPreview.innerHTML = '<p class="error">File size must be less than 1 MB. Please select a smaller file.<p>';
        }
        else {
          const reader = new FileReader();
          reader.onload = () => {
            this.view.webcamPreview.innerHTML = `<img src="${reader.result}" alt="Uploaded Image" class="edit-area">`;
          }
          reader.readAsDataURL(file);
          this.view.webcamPreview.style.maxHeight = '';
        }
      }
      else
        this.view.webcamPreview.innerHTML = '<p class="error">Invalid image file. Please select a GIF, PNG, JPG or JPEG file.</p>';
    });
  
    function isImageFile(file) {
      return file.type === 'image/gif' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg';
    }
  }
  

  captureModel() {
    const pastedImage = this.view.getElement('.pasted-image');
    if (pastedImage) {
      this.view.captureButton.disabled = true;
      this.model.capture(this.view.webcamPreview, this.captureImage(), pastedImage.src, {x: parseFloat(pastedImage.style.left), y: parseFloat(pastedImage.style.top)})
      .then(() => {
        fetch('/php/images/get_current_image.php', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        .then(response => response.json())
        .then(data => {
          this.view.instantThumbnail(data.image);
          this.currentOffset++;
          this.view.captureButton.disabled = false;
        });
      })
    }
  }

  captureImage() {
    const content = this.view.webcamPreview.firstChild;

    if (content.tagName === 'IMG')
      return content.src;
    else if (content.tagName === 'VIDEO') {
      const canvas = document.createElement('canvas');
      canvas.width = content.videoWidth;
      canvas.height = content.videoHeight;

      const context = canvas.getContext('2d');
      context.drawImage(content, 0, 0, content.videoWidth, content.videoHeight);

      return canvas.toDataURL('image/jpeg');
    }
    return null;
  }
}