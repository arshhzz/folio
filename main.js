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
// (Retain hash in URL for accessibility)
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

// === Animated Mobile Menu ===
const navLinks = document.querySelector('.nav-links');
const mobileMenuBtn = document.createElement('button');
mobileMenuBtn.id = 'mobile-menu-btn';
mobileMenuBtn.setAttribute('aria-label', 'Open navigation menu');
mobileMenuBtn.innerHTML = `<span class="menu-bar"></span><span class="menu-bar"></span><span class="menu-bar"></span>`;
mobileMenuBtn.style.display = 'none';

const mobileMenuOverlay = document.createElement('div');
mobileMenuOverlay.id = 'mobile-menu-overlay';
mobileMenuOverlay.style.display = 'none';
document.body.appendChild(mobileMenuOverlay);

// Insert button after logo
const logo = document.querySelector('.logo');
logo.parentNode.insertBefore(mobileMenuBtn, logo.nextSibling);

function openMobileMenu() {
  navLinks.classList.add('mobile-open');
  mobileMenuOverlay.style.display = 'block';
  setTimeout(() => mobileMenuOverlay.classList.add('active'), 10);
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  navLinks.classList.remove('mobile-open');
  mobileMenuOverlay.classList.remove('active');
  setTimeout(() => mobileMenuOverlay.style.display = 'none', 300);
  document.body.style.overflow = '';
}
mobileMenuBtn.addEventListener('click', openMobileMenu);
mobileMenuOverlay.addEventListener('click', closeMobileMenu);
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));

function handleResize() {
  if (window.innerWidth < 769) {
    mobileMenuBtn.style.display = 'inline-flex';
    navLinks.classList.add('mobile');
  } else {
    mobileMenuBtn.style.display = 'none';
    navLinks.classList.remove('mobile', 'mobile-open');
    mobileMenuOverlay.style.display = 'none';
    document.body.style.overflow = '';
  }
}
window.addEventListener('resize', handleResize);
document.addEventListener('DOMContentLoaded', handleResize);
handleResize();

// === Hero Animated Background (Nuclear Fix) ===
(function heroAnimatedBackgroundCSS() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  hero.classList.add('hero-animated-bg');
})();

// === Hero Staggered Fade-up ===
// (DISABLED for troubleshooting)

// === Project Card 3D Tilt & Glow ===
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
window.addEventListener('DOMContentLoaded', enableProjectCardTilt);
window.addEventListener('resize', enableProjectCardTilt);

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