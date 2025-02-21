// Modal Functions
function openModal(type) {
  try {
    const modal = document.getElementById('modal-' + type);
    if (!modal) {
      console.error(`Modal with ID 'modal-${type}' not found`);
      return;
    }
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  } catch (error) {
    console.error('Error opening modal:', error);
  }
}

function closeModal(type) {
  try {
    const modal = document.getElementById('modal-' + type);
    if (!modal) {
      console.error(`Modal with ID 'modal-${type}' not found`);
      return;
    }
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  } catch (error) {
    console.error('Error closing modal:', error);
  }
}

// Close modal when clicking outside
window.onclick = function (event) {
  try {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  } catch (error) {
    console.error('Error in modal click handler:', error);
  }
};

// Store uploaded files
let uploadedFiles = new Set();

// Before/After Slider Functionality
function initializeBeforeAfterSliders() {
  try {
    const sliders = document.querySelectorAll('.comparison-slider');
    console.log('Found sliders:', sliders.length);

    sliders.forEach((slider, index) => {
      const beforeImage = slider.querySelector('.before-image');
      const handle = slider.querySelector('.handle');

      if (!beforeImage || !handle) {
        console.error(`Missing required elements for slider ${index}`);
        return;
      }

      let isResizing = false;

      function updateSliderPosition(x) {
        try {
          const sliderRect = slider.getBoundingClientRect();
          let position = (x - sliderRect.left) / sliderRect.width;
          position = Math.max(0, Math.min(1, position));
          const percentage = position * 100;

          handle.style.left = `${percentage}%`;
          beforeImage.style.width = `${percentage}%`;
        } catch (error) {
          console.error('Error updating slider position:', error);
        }
      }

      // Mouse Events
      handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        updateSliderPosition(e.pageX);
      });

      document.addEventListener('mouseup', () => {
        isResizing = false;
      });

      // Touch Events
      handle.addEventListener('touchstart', (e) => {
        isResizing = true;
        e.preventDefault();
      });

      document.addEventListener('touchmove', (e) => {
        if (!isResizing) return;
        updateSliderPosition(e.touches[0].pageX);
      });

      document.addEventListener('touchend', () => {
        isResizing = false;
      });

      // Set initial position (50%)
      handle.style.left = '50%';
      beforeImage.style.width = '50%';
    });
  } catch (error) {
    console.error('Error initializing before/after sliders:', error);
  }
}

// Image upload handler
function handleFileSelect(event) {
  try {
    const files = event.target.files;
    const previewContainer = document.getElementById('imagePreviewContainer');

    if (!previewContainer) {
      console.error('Preview container not found');
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        console.warn(`Skipping non-image file: ${file.name}`);
        return;
      }

      if (
        Array.from(uploadedFiles).some(
          (f) => f.name === file.name && f.size === file.size
        )
      ) {
        console.log(`File already uploaded: ${file.name}`);
        return;
      }

      uploadedFiles.add(file);
      createImagePreview(file, previewContainer);
    });
  } catch (error) {
    console.error('Error handling file select:', error);
  }
}

// Create image preview
function createImagePreview(file, container) {
  try {
    const reader = new FileReader();
    const previewDiv = document.createElement('div');
    previewDiv.className = 'image-preview fade-in';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-image';
    removeBtn.innerHTML = '×';
    removeBtn.onclick = function () {
      uploadedFiles.delete(file);
      previewDiv.classList.add('fade-out');
      setTimeout(() => previewDiv.remove(), 300);
    };

    reader.onload = function (e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      previewDiv.appendChild(img);
      previewDiv.appendChild(removeBtn);
    };

    reader.onerror = function (error) {
      console.error('Error reading file:', error);
    };

    reader.readAsDataURL(file);
    container.appendChild(previewDiv);
  } catch (error) {
    console.error('Error creating image preview:', error);
  }
}

// Form submission handler
function handleSubmit(event) {
  try {
    event.preventDefault();

    const formData = new FormData(event.target);
    uploadedFiles.forEach((file) => {
      formData.append('images[]', file);
    });

    console.log('Form submission:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const successMessage = document.createElement('div');
    successMessage.className = 'success-message scale-in';
    successMessage.textContent =
      'Thank you for your inquiry. We will contact you soon!';
    document.body.appendChild(successMessage);

    setTimeout(() => {
      successMessage.classList.add('fade-out');
      setTimeout(() => successMessage.remove(), 300);
    }, 3000);

    const previewContainer = document.getElementById('imagePreviewContainer');
    if (previewContainer) {
      previewContainer.innerHTML = '';
    }
    uploadedFiles.clear();
    event.target.reset();

    return false;
  } catch (error) {
    console.error('Error handling form submission:', error);
    return false;
  }
}

// Category filter functionality
function filterGallery(category) {
  try {
    const items = document.querySelectorAll('.comparison-item');
    const buttons = document.querySelectorAll('.category-btn');

    buttons.forEach((btn) => {
      btn.classList.remove('active');
      if (btn.dataset.category === category) {
        btn.classList.add('active');
      }
    });

    items.forEach((item) => {
      item.classList.remove('fade-in');
      if (category === 'all' || item.dataset.category === category) {
        item.style.display = 'block';
        setTimeout(() => item.classList.add('fade-in'), 10);
      } else {
        item.style.display = 'none';
      }
    });
  } catch (error) {
    console.error('Error filtering gallery:', error);
  }
}

// Lazy loading for images
function lazyLoadImages() {
  try {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    } else {
      images.forEach((img) => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  } catch (error) {
    console.error('Error in lazy loading images:', error);
  }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    initializeDragAndDrop();
    initializeBeforeAfterSliders();

    const fileInput = document.getElementById('jobPhotos');
    if (fileInput) {
      fileInput.addEventListener('change', handleFileSelect);
    }

    // Initialize category filters
    const filterButtons = document.querySelectorAll('.category-btn');
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        filterGallery(button.dataset.category);
      });
    });

    lazyLoadImages();
  } catch (error) {
    console.error('Error in DOMContentLoaded initialization:', error);
  }
});
