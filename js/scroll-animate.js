// Animación de aparición al hacer scroll
(function() {
  function revealOnScroll() {
    var reveals = document.querySelectorAll('.reveal-on-scroll');
    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var elementTop = reveals[i].getBoundingClientRect().top;
      var elementVisible = 80;
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add('active');
      } else {
        reveals[i].classList.remove('active');
      }
    }
  }
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('DOMContentLoaded', revealOnScroll);
})();
