// Contact form handler - English version
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const submitLoader = document.getElementById('submitLoader');
  const formMessages = document.getElementById('formMessages');

  // Backend URL (automatically adjusts for local or production)
  const BACKEND_URL = window.location.origin;

  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = {
      nombre: formData.get('nombre'),
      email: formData.get('email'),
      mensaje: formData.get('mensaje')
    };

    // Basic validation
    if (!data.nombre || !data.email || !data.mensaje) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    // Change button state
    setButtonState('loading');
    hideMessage();

    try {
      // Send data to backend
      const response = await fetch(`${BACKEND_URL}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success
        showMessage('Message sent successfully! I\'ll contact you soon.', 'success');
        contactForm.reset();
      } else {
        // Server error
        const errorMsg = result.error || 'Error sending message';
        const details = result.details || [];
        
        let fullMessage = errorMsg;
        if (details.length > 0) {
          fullMessage += ': ' + details.join(', ');
        }
        
        showMessage(fullMessage, 'error');
      }

    } catch (error) {
      console.error('Error sending form:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showMessage('Cannot connect to server. Please verify that the backend is running.', 'error');
      } else {
        showMessage('Connection error. Please try again later.', 'error');
      }
    } finally {
      setButtonState('normal');
    }
  }

  function setButtonState(state) {
    switch (state) {
      case 'loading':
        submitBtn.disabled = true;
        submitText.classList.add('d-none');
        submitLoader.classList.remove('d-none');
        break;
      case 'normal':
      default:
        submitBtn.disabled = false;
        submitText.classList.remove('d-none');
        submitLoader.classList.add('d-none');
        break;
    }
  }

  function showMessage(message, type) {
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    const iconClass = type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle';
    
    formMessages.innerHTML = `
      <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
        <i class="${iconClass} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    
    // Auto-hide success message after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        const alert = formMessages.querySelector('.alert');
        if (alert) {
          alert.classList.remove('show');
          setTimeout(() => hideMessage(), 150);
        }
      }, 5000);
    }
  }

  function hideMessage() {
    formMessages.innerHTML = '';
  }
});

// CSS for loading animation
const spinAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .spin-animation {
    animation: spin 1s linear infinite;
  }
`;

// Add styles to head
const style = document.createElement('style');
style.textContent = spinAnimation;
document.head.appendChild(style);