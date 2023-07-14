import Model from "./model.js";
import View from "./view.js";
import Controller from "./controller.js";

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const imagePreview = document.getElementById('imagePreview');

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file && isImageFile(file)) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageURL = reader.result;
        imagePreview.innerHTML = `<img src="${imageURL}" alt="Uploaded Image">`;
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.innerHTML = 'Invalid image file. Please select a GIF or PNG file.';
    }
  });

  function isImageFile(file) {
    const fileType = file.type;
    return fileType === 'image/gif' || fileType === 'image/png';
  }
});

const view = new View();
const model = new Model(view);
const controller = new Controller(model, view);