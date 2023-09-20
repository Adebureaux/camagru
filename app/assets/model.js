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

  async forgotPassword(email) {
    return fetch('/php/auth/password_reset_send_mail.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email
      })
    })
    .then(response => response.json())
    .then(data => data);
  }

  async passwordReset(newPassword) {
    const params = (new URL(document.location)).searchParams;
    const token = params.get('token');
    return fetch(`/php/auth/password_reset.php?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: newPassword
      })
    })
    .then(response => response.json())
    .then(data => data);
  }

  async verifyPasswordResetToken() {
    const params = (new URL(document.location)).searchParams;
    const token = params.get('token');
    return fetch(`/php/auth/verify_password_reset.php?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
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

  async changeUsername(newUsername) {
    return fetch('/php/auth/change_username.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: newUsername
      })
    })
    .then(response => response.json())
    .then(data => data);
  }

  async changeEmail(newEmail) {
    return fetch('/php/auth/change_email.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: newEmail
      })
    })
    .then(response => response.json())
    .then(data => data);
  }

  async toggleNotifications(state) {
    return fetch('/php/auth/toggle_notifications.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        state: state
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

  async getUserInfo() {
    return fetch('/php/auth/get_user_info.php', {
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

  async startVideo() {
    return navigator.mediaDevices.getUserMedia({ video: true });
  }

  async capture(imgElement, imgData, superposableImg, position) {
    // Create a FormData object
    const formData = new FormData();

    const imgWidth = imgElement.offsetWidth;
    const imgHeight = imgElement.offsetHeight;
    const originalDimensions = {
        width: imgWidth,
        height: imgHeight
    };

    // Convert Base64 image to blob
    const byteString = atob(imgData.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });

    // Append the image blob and the superposable image
    formData.append('webcamImage', blob);

    const response = await fetch(superposableImg);
    if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
    const superposableImageBlob = await response.blob();
    formData.append('superposableImage', superposableImageBlob);

    formData.append('position', JSON.stringify(position));
    formData.append('originalDimensions', JSON.stringify(originalDimensions));

    // Send the request
    return fetch('/php/images/save_image.php', {
        method: 'POST',
        body: formData,
    })
    .then(response => response)
    .catch(() => {});
  }

  async getUserImages(currentOffset) {
    return fetch(`/php/images/get_user_images.php?offset=${currentOffset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => data);
  }

  async getImages(currentOffset) {
    return fetch(`/php/images/get_images.php?offset=${currentOffset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => data);
  }

  async likeImage(imageId) {
    return fetch('/php/images/like.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image_id: imageId })
    })
    .then(response => response.json())
    .then(data => data);
  }


  async commentImage(imageId, comment) {
    return fetch('/php/images/comment.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image_id: imageId, comment: comment })
    })
    .then(response => response.json())
    .then(data => data);
  }
}