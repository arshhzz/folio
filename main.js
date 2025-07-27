// === Early Theme Application (fix flicker) ===
(function applyInitialTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  } else if (savedTheme === 'dark') {
    document.body.classList.remove('light-mode');
  } else if (!savedTheme && !prefersDark) {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }
})();

// Header background blur on scroll
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', this.getAttribute('href'));
    }
  });
});

// Fade-in animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);
document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});

// === Dark/Light Mode Toggle Button ===
const themeToggleBtn = document.getElementById('theme-toggle');
function setTheme(mode) {
  if (mode === 'light') {
    document.body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
    if (themeToggleBtn) themeToggleBtn.textContent = '🌞';
  } else {
    document.body.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
    if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
  }
}
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    setTheme(isLight ? 'dark' : 'light');
  });
  // Set initial icon
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    themeToggleBtn.textContent = '🌞';
  } else {
    themeToggleBtn.textContent = '🌙';
  }
}

// === Mobile Menu Functionality ===
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const navLinks = document.querySelector('.nav-links');

function openMobileMenu() {
  navLinks.classList.add('mobile', 'mobile-open');
  mobileMenuOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  navLinks.classList.remove('mobile-open');
  mobileMenuOverlay.classList.remove('active');
  setTimeout(() => {
    if (!navLinks.classList.contains('mobile-open')) {
      navLinks.classList.remove('mobile');
    }
  }, 300);
  document.body.style.overflow = '';
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', openMobileMenu);
}

if (mobileMenuOverlay) {
  mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

// Close mobile menu when clicking on navigation links
if (navLinks) {
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

// Handle window resize
function handleResize() {
  if (window.innerWidth >= 769) {
    closeMobileMenu();
  }
}

window.addEventListener('resize', handleResize);

// Initialize mobile menu on page load
document.addEventListener('DOMContentLoaded', () => {
  handleResize();
});

// === Hero Animated Background ===
(function heroAnimatedBackgroundCSS() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  hero.classList.add('hero-animated-bg');
})();

// === Project Card 3D Tilt & Glow (Desktop Only) ===
function enableProjectCardTilt() {
  if (window.innerWidth <= 900) return;
  
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
      card.style.boxShadow = '0 8px 40px 0 rgba(6,182,212,0.25), 0 0 24px 4px #06b6d4, 0 0 48px 8px #3b82f6';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

// Only enable tilt on desktop
if (window.innerWidth > 900) {
  window.addEventListener('DOMContentLoaded', enableProjectCardTilt);
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    enableProjectCardTilt();
  }
});

// === Active Section Highlight in Navigation ===
const sections = document.querySelectorAll('section[id]');
const navLinkElements = document.querySelectorAll('nav .nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80; // adjust for header height
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  
  navLinkElements.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// === Touch Device Optimizations ===
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

if (isTouchDevice()) {
  // Disable hover effects on touch devices
  document.body.classList.add('touch-device');
  
  // Add touch feedback for buttons
  document.querySelectorAll('.cta-button, .contact-link').forEach(button => {
    button.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('touchend', function() {
      this.style.transform = '';
    });
  });
}

// === Performance Optimizations ===
// Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optimize scroll performance
const debouncedScrollHandler = debounce(() => {
  // Active section highlight logic
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  
  navLinkElements.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}, 10);

window.addEventListener('scroll', debouncedScrollHandler); 