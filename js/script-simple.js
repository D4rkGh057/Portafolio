(function($) {
    "use strict";

    $(document).ready(function() {
      
      // Inicializar AOS
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: true
      });
      
      // Navegación suave
      $('nav a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        
        var target = $(this.getAttribute('href'));
        if(target.length) {
          $('html, body').stop().animate({
            scrollTop: target.offset().top - 80
          }, 1000);
        }
      });
      
      // masonoary //
      initIsotope();

      // lightbox
      if (typeof lightbox !== 'undefined') {
        lightbox.option({
          'resizeDuration': 200,
          'wrapAround': true,
          'fitImagesInViewport': true
        });
      }
      
      /* swiper */
      if (typeof Swiper !== 'undefined') {
        var testimonialSwiper = new Swiper(".testimonial-swiper", {
          spaceBetween: 20,
          pagination: {
              el: ".testimonial-swiper-pagination",
              clickable: true,
            },
          breakpoints: {
            0: {
              slidesPerView: 1,
            },
            800: {
              slidesPerView: 3,
            },
            1400: {
              slidesPerView: 3,
            }
          },
        });
      }

    }); // End of document ready

  // init Isotope
  var initIsotope = function() {
    
    $('.grid').each(function(){

      // $('.grid').imagesLoaded( function() {
        // images have loaded
        var $buttonGroup = $( '.button-group' );
        var $checked = $buttonGroup.find('.is-checked');
        var filterValue = $checked.attr('data-filter');
  
        var $grid = $('.grid').isotope({
          itemSelector: '.portfolio-item',
          // layoutMode: 'fitRows',
          filter: filterValue
        });
    
        // bind filter button click
        $('.button-group').on( 'click', 'a', function(e) {
          e.preventDefault();
          filterValue = $( this ).attr('data-filter');
          $grid.isotope({ filter: filterValue });
        });
    
        // change is-checked class on buttons
        $('.button-group').each( function( i, buttonGroup ) {
          $buttonGroup.on( 'click', 'a', function() {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $( this ).addClass('is-checked');
          });
        });
      // });

    });
  }

})(jQuery);