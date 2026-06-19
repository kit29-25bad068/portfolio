/* ========================================
   NAVIGATION — mobile toggle
======================================== */
const navToggle = document.getElementById('nav-toggle');
const navMenu   = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  // Close menu when a link is clicked
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation');
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });
}

/* ========================================
   ACTIVE NAV LINK — highlight current page
======================================== */
(function highlightCurrentPage() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();

/* ========================================
   CONTACT FORM — accessible validation
======================================== */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  const formSuccess = document.getElementById('form-success');

  // Validate individual field
  function validateField(field) {
    const errorEl = document.getElementById(`${field.id}-error`);
    let message = '';

    if (field.type === 'checkbox') {
      if (field.required && !field.checked) message = 'You must agree to the privacy policy.';
    } else if (field.validity.valueMissing) {
      message = `${field.labels?.[0]?.textContent?.replace('*','').trim() || 'This field'} is required.`;
    } else if (field.validity.typeMismatch && field.type === 'email') {
      message = 'Please enter a valid email address.';
    } else if (field.validity.tooShort) {
      message = `Minimum ${field.minLength} characters required.`;
    }

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = !message;
    }
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  }

  // Live validation on blur
  contactForm.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });

  // Submit
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    let allValid = true;
    const fields = contactForm.querySelectorAll('input, textarea, select');

    fields.forEach(field => {
      if (!validateField(field)) allValid = false;
    });

    if (allValid) {
      contactForm.hidden = true;
      if (formSuccess) {
        formSuccess.classList.add('visible');
        formSuccess.setAttribute('role', 'alert');
        formSuccess.focus();
      }
    } else {
      // Focus first invalid field
      const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
    }
  });
}

/* ========================================
   SMOOTH ANCHOR SCROLL — respects reduced motion
======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});

/* ========================================
   ANNOUNCE DYNAMIC CONTENT to screen readers
======================================== */
function announce(message, assertive = false) {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.classList.add('sr-only');
  document.body.appendChild(liveRegion);
  setTimeout(() => { liveRegion.textContent = message; }, 100);
  setTimeout(() => { document.body.removeChild(liveRegion); }, 3000);
}