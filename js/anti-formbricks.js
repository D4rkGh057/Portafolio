// Anti-Formbricks script - Previene cualquier envío accidental
(function() {
  'use strict';
  
  console.log('🛡️ Anti-Formbricks protection loaded');
  
  // Interceptar todos los envíos de formularios
  document.addEventListener('submit', function(e) {
    const form = e.target;
    
    // Si es nuestro formulario de contacto, permitir que nuestro JS lo maneje
    if (form.id === 'contactForm') {
      console.log('✅ Contact form submission intercepted - handled by our JS');
      return; // Nuestro JavaScript ya maneja preventDefault()
    }
    
    // Para cualquier otro formulario, prevenir envío
    console.warn('🚫 Unknown form submission prevented:', form);
    e.preventDefault();
    e.stopPropagation();
    
  }, true); // true = capture phase
  
  // Verificar que no hay formularios con action de Formbricks
  document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(function(form, index) {
      const action = form.getAttribute('action');
      
      if (action && action.includes('formbricks')) {
        console.error('🚨 FORMBRICKS FORM DETECTED:', form);
        console.error('🚨 Removing action attribute...');
        form.removeAttribute('action');
        form.removeAttribute('method');
      }
      
      console.log(`📋 Form ${index + 1}:`, {
        id: form.id || 'no-id',
        action: action || 'no-action',
        method: form.method || 'get'
      });
    });
  });
  
})();