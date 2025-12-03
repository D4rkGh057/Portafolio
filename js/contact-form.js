// Manejo del formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const submitLoader = document.getElementById('submitLoader');
  const formMessages = document.getElementById('formMessages');

  // URL del backend (se ajusta automáticamente para local o producción)
  const BACKEND_URL = window.location.origin;

  console.log('🚀 Contact form initialized - Using backend:', BACKEND_URL + '/api/send-email');

  if (contactForm) {
    // Prevenir envío tradicional del formulario
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Backup: prevenir cualquier envío accidental
    contactForm.setAttribute('onsubmit', 'return false;');
    
    console.log('✅ Form event listeners attached');
  } else {
    console.error('❌ Contact form not found!');
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('📧 Form submitted - preventing default behavior');

    // Obtener datos del formulario
    const formData = new FormData(contactForm);
    const data = {
      nombre: formData.get('nombre'),
      email: formData.get('email'),
      mensaje: formData.get('mensaje')
    };

    // Validar datos básicos
    if (!data.nombre || !data.email || !data.mensaje) {
      showMessage('Por favor completa todos los campos', 'error');
      return;
    }

    // Cambiar estado del botón
    setButtonState('loading');
    hideMessage();

    try {
      console.log('📤 Sending to:', `${BACKEND_URL}/api/send-email`);
      console.log('📊 Data:', data);
      
      // Enviar datos al backend
      const response = await fetch(`${BACKEND_URL}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Éxito
        showMessage('¡Mensaje enviado correctamente! Te contactaré pronto.', 'success');
        contactForm.reset();
      } else {
        // Error del servidor
        const errorMsg = result.error || 'Error al enviar el mensaje';
        const details = result.details || [];
        
        let fullMessage = errorMsg;
        if (details.length > 0) {
          fullMessage += ': ' + details.join(', ');
        }
        
        showMessage(fullMessage, 'error');
      }

    } catch (error) {
      console.error('Error al enviar formulario:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showMessage('No se puede conectar con el servidor. Verifica que el backend esté corriendo.', 'error');
      } else {
        showMessage('Error de conexión. Inténtalo de nuevo más tarde.', 'error');
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
    
    // Auto-ocultar mensaje de éxito después de 5 segundos
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

// CSS para animación de carga
const spinAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .spin-animation {
    animation: spin 1s linear infinite;
  }
`;

// Agregar estilos al head
const style = document.createElement('style');
style.textContent = spinAnimation;
document.head.appendChild(style);