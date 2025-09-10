document.addEventListener('DOMContentLoaded', function() {
  // Find all slideshows on the page
  const slideshows = document.querySelectorAll('slideshow-component');
  
  slideshows.forEach(function(slideshowElement) {
    const slider = slideshowElement.querySelector('[id^="Slider-"]');
    const slides = slideshowElement.querySelectorAll('.slideshow__slide');
    const prevButton = slideshowElement.querySelector('button[name="previous"]');
    const nextButton = slideshowElement.querySelector('button[name="next"]');
    const currentCounter = slideshowElement.querySelector('.slider-counter--current');
    const totalCounter = slideshowElement.querySelector('.slider-counter--total');
    const dotButtons = slideshowElement.querySelectorAll('.slider-counter__link');
    const autoplayButton = slideshowElement.querySelector('.slideshow__autoplay');
    
    // Don't initialize if there's only one slide or no slides
    if (!slider || slides.length <= 1) {
      console.log('Slideshow: Not enough slides to initialize');
      return;
    }
    
    console.log('Initializing slideshow with', slides.length, 'slides');
    
    // Slideshow state
    let currentSlide = 0;
    let autoplayInterval = null;
    let isAutoplayEnabled = slider.dataset.autoplay === 'true';
    const autoplaySpeed = parseInt(slider.dataset.speed) * 1000 || 5000;
    
    // Initialize slideshow
    function initSlideshow() {
      // Set up initial state
      showSlide(0);
      updateControls();
      
      // Update total counter with proper number
      if (totalCounter) {
        totalCounter.textContent = slides.length.toString();
      }
      
      // Update current counter with proper number
      if (currentCounter) {
        currentCounter.textContent = "1";
      }
      
      // Start autoplay if enabled
      if (isAutoplayEnabled) {
        startAutoplay();
      }
      
      console.log('Slideshow initialized successfully');
    }
    
    // Show specific slide
    function showSlide(index) {
      // Ensure index is valid
      if (index < 0) index = 0;
      if (index >= slides.length) index = slides.length - 1;
      
      // Hide all slides
      slides.forEach(function(slide, i) {
        slide.classList.remove('active');
      });
      
      // Show current slide
      if (slides[index]) {
        slides[index].classList.add('active');
        currentSlide = index;
      }
      
      // Update current counter with proper numbers
      if (currentCounter) {
        currentCounter.textContent = (currentSlide + 1).toString();
      }
      
      console.log('Showing slide', currentSlide + 1);
    }
    
    // Go to next slide
    function nextSlide() {
      const nextIndex = currentSlide + 1 >= slides.length ? 0 : currentSlide + 1;
      showSlide(nextIndex);
      updateControls();
    }
    
    // Go to previous slide
    function prevSlide() {
      const prevIndex = currentSlide - 1 < 0 ? slides.length - 1 : currentSlide - 1;
      showSlide(prevIndex);
      updateControls();
    }
    
    // Go to specific slide
    function goToSlide(index) {
      if (index >= 0 && index < slides.length) {
        showSlide(index);
        updateControls();
      }
    }
    
    // Update control button states
    function updateControls() {
      // Update dot/number navigation
      dotButtons.forEach(function(button, index) {
        if (index === currentSlide) {
          button.classList.add('active');
          button.classList.add('slider-counter__link--active');
        } else {
          button.classList.remove('active');
          button.classList.remove('slider-counter__link--active');
        }
      });
    }
    
    // Autoplay functions
    function startAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
      autoplayInterval = setInterval(nextSlide, autoplaySpeed);
      console.log('Autoplay started');
    }
    
    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
      console.log('Autoplay stopped');
    }
    
    function toggleAutoplay() {
      if (isAutoplayEnabled) {
        stopAutoplay();
        isAutoplayEnabled = false;
        if (autoplayButton) {
          autoplayButton.classList.add('slideshow__autoplay--paused');
        }
      } else {
        startAutoplay();
        isAutoplayEnabled = true;
        if (autoplayButton) {
          autoplayButton.classList.remove('slideshow__autoplay--paused');
        }
      }
    }
    
    // Event listeners
    if (nextButton) {
      nextButton.addEventListener('click', function(e) {
        e.preventDefault();
        nextSlide();
        // Restart autoplay timer if it was running
        if (isAutoplayEnabled) {
          startAutoplay();
        }
      });
    }
    
    if (prevButton) {
      prevButton.addEventListener('click', function(e) {
        e.preventDefault();
        prevSlide();
        // Restart autoplay timer if it was running
        if (isAutoplayEnabled) {
          startAutoplay();
        }
      });
    }
    
    // Dot/number navigation
    dotButtons.forEach(function(button, index) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        goToSlide(index);
        // Restart autoplay timer if it was running
        if (isAutoplayEnabled) {
          startAutoplay();
        }
      });
    });
    
    // Autoplay toggle button
    if (autoplayButton) {
      autoplayButton.addEventListener('click', function(e) {
        e.preventDefault();
        toggleAutoplay();
      });
    }
    
    // Pause on hover, resume on leave
    slideshowElement.addEventListener('mouseenter', function() {
      if (isAutoplayEnabled) {
        stopAutoplay();
      }
    });
    
    slideshowElement.addEventListener('mouseleave', function() {
      if (isAutoplayEnabled) {
        startAutoplay();
      }
    });
    
    // Keyboard navigation
    slideshowElement.addEventListener('keydown', function(e) {
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextSlide();
          break;
        case ' ': // Space bar
          e.preventDefault();
          toggleAutoplay();
          break;
      }
    });
    
    // Initialize the slideshow
    initSlideshow();
  });
});