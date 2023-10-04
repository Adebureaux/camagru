import page from "/lib/page.mjs";

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.checkLogin().then(logged => this.view.displayHeaderButtons(logged));

    this.view.signupForm.addEventListener('submit', this.registerModel.bind(this));
    this.view.forgotPasswordForm.addEventListener('submit', this.forgotPasswordModel.bind(this));
    this.view.loginForm.addEventListener('submit', this.loginModel.bind(this));
    this.view.logoutLink.addEventListener('click', this.logoutModel.bind(this));
    this.view.uploadButton.addEventListener('click', this.uploadImage.bind(this));
    this.view.captureButton.addEventListener('click', this.captureModel.bind(this));

    this.currentOffset = 0;
    this.thumbnailsFull = false;
    this.stream = null;

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
    return (await this.model.checkLogin());
  }

  displayHomePage(data, pageSlider) {
    const homeContainer = this.view.createElement('div', 'home-container');
    data.images.forEach(image => {
      const postContainer = this.view.createPost(image);

      const username = this.view.createElementInDiv('p', 'post-username');
      username.firstChild.innerText = image.username;
      postContainer.prepend(username);

      const interactSection = this.view.createElement('div', 'interact-container');
      const likeSection = this.view.createElement('div', 'like-section');
      const likeButton = this.view.createElementInDiv('img', 'like-button');
      const unlikeButton = this.view.createElementInDiv('img', 'like-button');
      likeButton.firstChild.src = '/assets/images/like.svg';
      likeButton.firstChild.alt = 'Like Icon';
      unlikeButton.firstChild.src = '/assets/images/unlike.svg';
      unlikeButton.firstChild.alt = 'Unlike Icon';

      const commentSection = this.view.createElementInDiv('form', 'comment-section');
      const commentInput = this.view.createElement('input');
      commentInput.placeholder = 'Add a comment';
      commentInput.id = 'addComment'
      const sendComment = this.view.createElement('button');
      sendComment.textContent = 'Send';
      const commentDisplay = this.view.createElement('div');

      let commentSize = image.comments.length;
      const openComment = this.view.createElement('a', 'link');
      openComment.classList.add('ml-md');
      if (commentSize) {
        openComment.innerText = `View ${commentSize > 1 ? 'all' : ''} ${commentSize} comment${commentSize > 1 ? 's' : ''}`;
        commentSection.append(openComment, commentDisplay);
      }
      
      let commentOpened = false;
      
      commentSection.firstChild.addEventListener('submit', (event) => {
        event.preventDefault();
        this.model.commentImage(image.id, commentInput.value)
        .then((data) => {
          if (data.success) {
            if (commentOpened) {
              const comment = this.view.createElement('p', 'ml-md');
              const username = this.view.createElement('span', 'bold');
              username.innerText = data.username;
              comment.innerText = ' : ' + commentInput.value;
              comment.prepend(username);
              commentDisplay.prepend(comment);
            }
            image.comments.push({comment_text: commentInput.value, username: data.username});
            commentInput.value = '';
            commentSize++;
            openComment.innerText = `View ${commentSize > 1 ? 'all' : ''} ${commentSize} comment${commentSize > 1 ? 's' : ''}`;
            if (commentSize === 1)
              commentSection.append(openComment, commentDisplay);
          }
        })
      })

      openComment.addEventListener('click', () => {
        commentOpened = !commentOpened;
        if (commentOpened) {
          for (let i = 0; i < image.comments.length; i++) {
            const comment = this.view.createElement('p', 'ml-md');
            const username = this.view.createElement('span', 'bold');
            username.innerText = image.comments[i].username;
            comment.innerText = ' : ' + image.comments[i].comment_text;
            comment.prepend(username);
            commentDisplay.prepend(comment);
          }
        }
        else
          commentDisplay.innerHTML = '';
      })


      commentSection.firstChild.append(commentInput, sendComment);
  
      let likes = image.like_count;
  
      const likesCounter = this.view.createElement('p');
      likesCounter.innerText = `${likes} like${likes > 1 ? 's' : ''}`;
  
      likeSection.append(image.liked_by_user ? unlikeButton : likeButton, likesCounter);
  
      interactSection.append(likeSection, commentSection);
      likeButton.addEventListener('click', () => {
        this.model.likeImage(image.id)
        .then((data) => {
          if (data.success) {
            likesCounter.innerText = `${++likes} like${likes > 1 ? 's' : ''}`;
            likeSection.firstChild.replaceWith(unlikeButton);
          }
        })
      })
      unlikeButton.addEventListener('click', () => {
        this.model.likeImage(image.id)
        .then((data) => {
          if (data.success) {
            likeSection.firstChild.replaceWith(likeButton);
            likesCounter.innerText = `${--likes} like${likes > 1 ? 's' : ''}`;
          }
        })
      })
      postContainer.append(interactSection);
      homeContainer.append(postContainer);
    });
    homeContainer.append(pageSlider);
    this.view.mainContent.replaceChildren(homeContainer);
  }

  homePage() {
    this.stopVideo();
    let offset = 0;
    this.model.getImagesNumber()
    .then(res => {
      if (!res.count)
        this.view.displayEmptyHomePage();
      else {
        const btnSlider = this.view.createElement('div', 'btn-slider');
        for (let i = 1; i < res.count / 5; i++) {
          const pageBtn = this.view.createElement('button', i === 1 ? 'selected' : '');
          pageBtn.innerText = i;
          pageBtn.addEventListener('click', (event) => {
            window.scrollTo(0, 0);
            const selected = document.querySelector('.selected');
            selected.classList.remove('selected');
            pageBtn.classList.toggle('selected');
            this.model.getImages((event.target.innerText - 1) * 5)
            .then(data => this.displayHomePage(data, btnSlider));
          })
          btnSlider.append(pageBtn);
        }
        this.model.getImages(offset)
        .then(data => this.displayHomePage(data, btnSlider))
      }
    })
  }

  registerPage() {
    this.stopVideo();
    this.checkLogin()
    .then(logged => {
      if (!logged)
        this.view.displaySignupPage();
      else
        page.redirect('/');
    })
  }
  
  activateRegisterPage() {
    this.stopVideo();
    this.model.verifyRegister()
    .then(data => this.view.displayDataSuccessPage(data));
  }

  passwordResetPage() {
    this.stopVideo();
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
      this.model.passwordReset(this.view.newPassword.firstChild.value)
      .then(data => {
        if (data.success)
          this.view.displayDataSuccessPage(data);
        else
          this.view.newPasswordErrorArea.firstChild.textContent = data.error;
      })
    }
    else
      this.view.newPasswordErrorArea.firstChild.textContent = 'Passwords does not match.';
    this.view.newPassword.firstChild.value = '';
    this.view.confirmNewPassword.firstChild.value = '';
  }


  loginPage() {
    this.stopVideo();
    this.checkLogin()
    .then(logged => {
      if (!logged)
        this.view.displayLoginPage();
      else
        page.redirect('/');
    })
  }

  toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  editingPage() {
    this.checkLogin()
    .then(logged => {
      this.view.displayEditingPage(logged);
      if (!this.stream) {
        this.model.startVideo()
        .then(stream => {
          this.view.editArea.innerHTML = `<video autoplay></video>`;
          this.view.editArea.firstChild.srcObject = stream;
          this.stream = stream;
        })
        .catch(() => {
          if (logged) {
            this.toDataURL('assets/images/default_image.jpg', function(dataUrl) {
              this.view.editArea.innerHTML = `<img src="${dataUrl}" alt="Uploaded Image">`;
            }.bind(this));
          }
        })
      }
      this.model.getUserImages(this.currentOffset)
      .then(thumbnails => {
        if (thumbnails?.images) {
          this.view.displayThumbnails(thumbnails.images);
          this.currentOffset += 10;
          this.boundHandleScroll = this.handleScroll.bind(this);
          this.view.sideSection.addEventListener('scroll', this.boundHandleScroll);
        }
      })
    });
  }

  settingsPage() {
    this.stopVideo();
    this.model.getUserInfo()
    .then(data => {
      this.view.displaySettingsPage(data);
      if (data.success) {
        this.view.changeUsernameButton.addEventListener('click', this.changeUsernameModel.bind(this));
        this.view.changeEmailButton.addEventListener('click', this.changeEmailModel.bind(this));
        this.view.resetPassword.firstChild.addEventListener('click', this.resetPasswordModel.bind(this));
        this.view.notifications.addEventListener('change', this.toggleNotificationsModel.bind(this));
      }
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
    .catch(() => {})
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
    this.stopVideo();
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
    .then(() => {
      this.view.displayHeaderButtons(false);
    });
  }

  uploadImage() {
    this.view.uploadButton.addEventListener('change', () => {
      const file = this.view.uploadButton.files[0];
      if (file && isImageFile(file)) {
        if (file.size > 1048576) {
          this.view.editArea.innerHTML = '<p class="error">File size must be less than 1 MB. Please select a smaller file.<p>';
        }
        else {
          const reader = new FileReader();
          reader.onload = () => {
            this.stopVideo();
            this.view.editArea.innerHTML = `<img src="${reader.result}" alt="Uploaded Image">`
          }
          reader.readAsDataURL(file);
        }
      }
      else
        this.view.editArea.innerHTML = '<p class="error">Invalid image file. Please select a GIF, PNG, JPG or JPEG file.</p>';
    });
  
    function isImageFile(file) {
      return file.type === 'image/gif' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg';
    }
  }

  captureModel() {
    const pastedImage = this.view.getElement('.pasted-image');
    if (pastedImage) {
      this.view.captureButton.disabled = true;
      this.model.capture(this.view.editArea, this.captureImage(), pastedImage.src, {x: parseFloat(pastedImage.style.left), y: parseFloat(pastedImage.style.top)})
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
    const content = this.view.editArea.firstChild;

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

  stopVideo() {
    if (this.stream) {
      const tracks = this.stream.getTracks();
      tracks.forEach(track => track.stop());
      this.stream = null;
    }
  }
}