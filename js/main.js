/* ============================================================
   YOUNG & MOLDED ORG — SHARED SITE JAVASCRIPT
   ============================================================ */

// ============ HEADER SCROLL ============
(function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ============ MOBILE DRAWER ============
function openDrawer() {
  document.getElementById('mobile-drawer')?.classList.add('open');
  document.getElementById('drawer-overlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  document.getElementById('mobile-drawer')?.classList.remove('open');
  document.getElementById('drawer-overlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

// ============ ACTIVE NAV LINK ============
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.getAttribute('data-nav') === path) link.classList.add('active');
  });
})();

// ============ SCROLL REVEAL ============
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

// ============ ACCORDION ============
function toggleAccordion(btn) {
  const content = btn.nextElementSibling;
  const icon = btn.querySelector('.accordion-icon');
  const isOpen = content.classList.contains('open');
  content.classList.toggle('open');
  if (icon) icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
}

// ============ MODAL ============
function openModal(title, desc, ctaText) {
  const overlay = document.getElementById('action-modal');
  if (!overlay) return;
  const titleEl = overlay.querySelector('[data-modal-title]');
  const descEl = overlay.querySelector('[data-modal-desc]');
  const ctaEl = overlay.querySelector('[data-modal-cta]');
  if (titleEl) titleEl.textContent = title || 'Get Started';
  if (descEl) descEl.textContent = desc || 'Connect with our team to discuss your project.';
  if (ctaEl && ctaText) ctaEl.textContent = ctaText;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  const overlay = document.getElementById('action-modal');
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ============ TOAST ============
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  const dotColor = type === 'error' ? '#ef4444' : '#38e2f8';
  toast.innerHTML = `
    <span style="width:10px;height:10px;border-radius:50%;background:${dotColor};flex-shrink:0;box-shadow:0 0 10px ${dotColor};"></span>
    <span style="color:#fff;">${message}</span>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4200);
}

// ============ GENERIC FORM HANDLER ============
function handleFormSubmit(e, formName) {
  e.preventDefault();
  const form = e.target;
  const required = form.querySelectorAll('[required]');
  let valid = true;
  required.forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#ef4444';
      valid = false;
    } else {
      field.style.borderColor = '';
    }
  });
  if (!valid) { showToast('Please complete all required fields.', 'error'); return; }
  showToast(`Thank you! Your ${formName} request has been received.`);
  form.reset();
  if (typeof closeModal === 'function') closeModal();
}

// ============ WHATSAPP ============
function openWhatsApp() {
  const msg = encodeURIComponent("Hi Young & Molded Org, I'd like to discuss a project.");
  window.open(`https://wa.me/27100000000?text=${msg}`, '_blank');
}

// ============ FAQ INIT ============
function initFaqs() {
  document.querySelectorAll('[data-faq-trigger]').forEach(btn =>
    btn.addEventListener('click', () => toggleAccordion(btn))
  );
}

// ============ GA4 STUB ============
function trackEvent(name, params = {}) {
  if (typeof gtag === 'function') gtag('event', name, params);
  else console.log('[GA4]', name, params);
}

document.addEventListener('DOMContentLoaded', () => {
  initFaqs();
  document.querySelectorAll('[data-whatsapp]').forEach(el =>
    el.addEventListener('click', () => trackEvent('whatsapp_click'))
  );
});