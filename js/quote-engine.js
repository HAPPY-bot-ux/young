/* ============================================================
   YOUNG & MOLDED ORG — MULTI-STEP QUOTE ENGINE (LIGHT THEME)
   ============================================================ */

const QuoteEngine = (() => {
  const state = {
    step: 1, totalSteps: 5,
    services: [], projectName: '', description: '', deliverables: '',
    budget: '', timeline: '',
    name: '', company: '', email: '', phone: '', whatsapp: '',
  };

  const services = ['Photography','Videography','Graphic Design','Digital Marketing',
    'Web Development','AI & Technology','Business Consulting','Event Management','Artist Management'];
  const budgets = ['< R5k','R5k - R10k','R10k - R25k','R25k - R50k','R50k - R100k','R100k+','Not Sure'];
  const timelines = ['ASAP','< 1 Week','2-4 Weeks','1-3 Months','3+ Months','Retainer'];

  function prefillFromURL() {
    const p = new URLSearchParams(window.location.search);
    const svc = p.get('service');
    const pkg = p.get('package');
    if (svc) {
      const m = services.find(s => s.toLowerCase().includes(svc.toLowerCase()));
      if (m) state.services = [m];
    }
    if (pkg) {
      if (pkg.includes('web')) state.services = ['Web Development'];
      if (pkg.includes('brand')) state.services = ['Graphic Design'];
    }
  }

  function render() {
    const container = document.getElementById('quote-step-container');
    if (!container) return;

    document.querySelectorAll('.step-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i + 1 === state.step);
      dot.classList.toggle('completed', i + 1 < state.step);
    });
    document.querySelectorAll('.step-line').forEach((line, i) => {
      line.classList.toggle('completed', i + 1 < state.step);
    });
    const counter = document.getElementById('step-counter');
    if (counter) counter.textContent = `Step ${state.step} of ${state.totalSteps}`;

    let html = '';
    switch (state.step) {
      case 1: html = renderStep1(); break;
      case 2: html = renderStep2(); break;
      case 3: html = renderStep3(); break;
      case 4: html = renderStep4(); break;
      case 5: html = renderStep5(); break;
    }
    container.innerHTML = html;
    if (state.step === 1) attachStep1();
    if (state.step === 5) attachStep5();
    updateButtons();
    window.scrollTo({ top: 140, behavior: 'smooth' });
  }

  function renderStep1() {
    return `
      <div class="reveal visible">
        <h2 class="display-sm mb-2">What services do you need?</h2>
        <p class="text-muted-soft mb-8 text-sm">Select all that apply. You can choose multiple services.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          ${services.map(s => `
            <div class="select-card ${state.services.includes(s) ? 'selected' : ''}" data-service="${s}">
              <div class="flex items-center gap-3">
                <div class="w-5 h-5 rounded border-2 ${state.services.includes(s) ? 'bg-[#0891b2] border-[#0891b2]' : 'border-[#cbd5e1]'} flex items-center justify-center flex-shrink-0">
                  ${state.services.includes(s) ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>' : ''}
                </div>
                <span class="text-sm font-semibold text-[#0f172a]">${s}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  function attachStep1() {
    document.querySelectorAll('[data-service]').forEach(card => {
      card.addEventListener('click', () => {
        const svc = card.getAttribute('data-service');
        state.services = state.services.includes(svc)
          ? state.services.filter(s => s !== svc)
          : [...state.services, svc];
        render();
      });
    });
  }

  function renderStep2() {
    return `
      <div class="reveal visible">
        <h2 class="display-sm mb-2">Tell us about your project</h2>
        <p class="text-muted-soft mb-8 text-sm">The more detail you provide, the more accurate our quote.</p>
        <div class="space-y-5">
          <div>
            <label class="form-label">Project Name *</label>
            <input type="text" id="q-project-name" class="form-input" placeholder="e.g. Corporate Rebrand 2026" value="${esc(state.projectName)}" required>
          </div>
          <div>
            <label class="form-label">Detailed Description *</label>
            <textarea id="q-description" class="form-textarea" rows="5" placeholder="Describe your goals, audience, and what success looks like..." required>${esc(state.description)}</textarea>
          </div>
          <div>
            <label class="form-label">Key Deliverables</label>
            <textarea id="q-deliverables" class="form-textarea" rows="3" placeholder="e.g. Logo, 10 social posts, landing page...">${esc(state.deliverables)}</textarea>
          </div>
          <div>
            <label class="form-label">Attach Brief (PDF/JPG, max 20MB)</label>
            <div class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors" style="border-color:#cbd5e1;" onclick="document.getElementById('q-file').click()" onmouseover="this.style.borderColor='#38e2f8'" onmouseout="this.style.borderColor='#cbd5e1'">
              <p class="text-sm text-[#475569]">Click to upload or drag & drop</p>
              <p class="text-xs text-[#94a3b8] mt-1">PDF, JPG, PNG — max 20MB</p>
              <input type="file" id="q-file" class="hidden" accept=".pdf,.jpg,.jpeg,.png">
            </div>
            <p id="q-file-name" class="text-xs text-[#0891b2] mt-2 font-semibold"></p>
          </div>
        </div>
      </div>
    `;
  }

  function renderStep3() {
    return `
      <div class="reveal visible">
        <h2 class="display-sm mb-2">What's your budget range?</h2>
        <p class="text-muted-soft mb-8 text-sm">All figures in ZAR. This helps us tailor the right solution.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${budgets.map(b => `
            <div class="select-card ${state.budget === b ? 'selected' : ''}" data-budget="${b}">
              <span class="text-sm font-semibold text-[#0f172a]">${b}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderStep4() {
    return `
      <div class="reveal visible">
        <h2 class="display-sm mb-2">When do you need this?</h2>
        <p class="text-muted-soft mb-8 text-sm">Select your ideal timeline.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${timelines.map(t => `
            <div class="select-card ${state.timeline === t ? 'selected' : ''}" data-timeline="${t}">
              <span class="text-sm font-semibold text-[#0f172a]">${t}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderStep5() {
    return `
      <div class="reveal visible">
        <h2 class="display-sm mb-2">Almost there — your details</h2>
        <p class="text-muted-soft mb-8 text-sm">We'll send your quote and next steps within 24 hours.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div><label class="form-label">Full Name *</label><input type="text" id="q-name" class="form-input" placeholder="John Doe" value="${esc(state.name)}" required></div>
          <div><label class="form-label">Company</label><input type="text" id="q-company" class="form-input" placeholder="Company (Pty) Ltd" value="${esc(state.company)}"></div>
          <div><label class="form-label">Email *</label><input type="email" id="q-email" class="form-input" placeholder="you@company.com" value="${esc(state.email)}" required></div>
          <div><label class="form-label">Phone *</label><input type="tel" id="q-phone" class="form-input" placeholder="+27 10 000 0000" value="${esc(state.phone)}" required></div>
          <div class="sm:col-span-2"><label class="form-label">WhatsApp Number</label><input type="tel" id="q-whatsapp" class="form-input" placeholder="Same as phone if left blank" value="${esc(state.whatsapp)}"></div>
        </div>
        <div class="mt-6 flex items-start gap-3">
          <input type="checkbox" id="q-popi" class="mt-1" required>
          <label for="q-popi" class="text-xs text-[#475569] leading-relaxed">I consent to Young & Molded Org processing my data in accordance with POPIA. We will never share your information.</label>
        </div>
        <div id="cross-sell" class="mt-8"></div>
      </div>
    `;
  }
  function attachStep5() {
    renderCrossSell();
    const fi = document.getElementById('q-file');
    if (fi) fi.addEventListener('change', (e) => {
      const name = e.target.files[0]?.name;
      if (name) document.getElementById('q-file-name').textContent = `Attached: ${name}`;
    });
  }

  function renderCrossSell() {
    const el = document.getElementById('cross-sell');
    if (!el) return;
    let recs = [];
    if (state.services.includes('Web Development')) {
      recs = ['Brand Identity Kit','Professional Photography','Google Business Setup','Monthly Web Maintenance'];
    } else if (state.services.includes('Videography')) {
      recs = ['Social Media Distro Package','Graphic Banner Ads','Video SEO Optimization'];
    } else if (state.services.includes('Photography')) {
      recs = ['Social Media Management','Website Refresh','Brand Guidelines'];
    }
    if (!recs.length) { el.innerHTML = ''; return; }
    el.innerHTML = `
      <div class="card card-highlight p-6">
        <span class="pill pill-cyan mb-3">Complete Your Digital Presence</span>
        <h3 class="display-sm mb-2" style="font-size:1.15rem;">Recommended add-ons</h3>
        <p class="text-muted-soft text-sm mb-4">Based on your selection, these services pair perfectly:</p>
        <div class="flex flex-wrap gap-2">${recs.map(r => `<span class="pill pill-cyan">${r}</span>`).join('')}</div>
      </div>
    `;
  }

  function updateButtons() {
    const prev = document.getElementById('quote-prev');
    const next = document.getElementById('quote-next');
    const submit = document.getElementById('quote-submit');
    if (prev) prev.style.display = state.step === 1 ? 'none' : 'inline-flex';
    if (next) next.style.display = state.step === state.totalSteps ? 'none' : 'inline-flex';
    if (submit) submit.style.display = state.step === state.totalSteps ? 'inline-flex' : 'none';
  }

  function validateStep() {
    if (state.step === 1 && state.services.length === 0) {
      showToast('Please select at least one service.', 'error'); return false;
    }
    if (state.step === 2) {
      state.projectName = document.getElementById('q-project-name')?.value.trim() || '';
      state.description = document.getElementById('q-description')?.value.trim() || '';
      state.deliverables = document.getElementById('q-deliverables')?.value.trim() || '';
      if (!state.projectName || !state.description) {
        showToast('Please fill in project name and description.', 'error'); return false;
      }
    }
    if (state.step === 3 && !state.budget) { showToast('Please select a budget range.', 'error'); return false; }
    if (state.step === 4 && !state.timeline) { showToast('Please select a timeline.', 'error'); return false; }
    return true;
  }
  function next() { if (validateStep() && state.step < state.totalSteps) { state.step++; render(); } }
  function prev() { if (state.step > 1) { state.step--; render(); } }

  function submit() {
    state.name = document.getElementById('q-name')?.value.trim() || '';
    state.company = document.getElementById('q-company')?.value.trim() || '';
    state.email = document.getElementById('q-email')?.value.trim() || '';
    state.phone = document.getElementById('q-phone')?.value.trim() || '';
    state.whatsapp = document.getElementById('q-whatsapp')?.value.trim() || '';
    const popi = document.getElementById('q-popi')?.checked;
    if (!state.name || !state.email || !state.phone) { showToast('Please complete all required contact fields.', 'error'); return; }
    if (!popi) { showToast('Please accept the POPIA consent to continue.', 'error'); return; }

    console.log('Quote submission:', { ...state, submittedAt: new Date().toISOString() });

    const container = document.getElementById('quote-step-container');
    container.innerHTML = `
      <div class="text-center py-12 reveal visible">
        <div class="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center glow-cyan" style="background:rgba(56,226,248,0.15);border:2px solid #38e2f8;">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>
        </div>
        <h2 class="display-sm mb-3">Quote request received!</h2>
        <p class="text-muted-soft max-w-md mx-auto mb-8">Thank you, ${esc(state.name)}. Our team will review your requirements and send a tailored quote to <strong class="text-cyan">${esc(state.email)}</strong> within 24 hours.</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="index.html" class="btn-primary">Back to Home</a>
          <button onclick="openWhatsApp()" class="btn-whatsapp">Chat on WhatsApp</button>
        </div>
      </div>
    `;
    document.getElementById('quote-nav').style.display = 'none';
    document.querySelector('.step-indicator').style.opacity = '0.3';
    trackEvent('quote_submitted', { services: state.services.join(','), budget: state.budget });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function attachDynamicListeners() {
    document.getElementById('quote-step-container')?.addEventListener('click', (e) => {
      const b = e.target.closest('[data-budget]');
      const t = e.target.closest('[data-timeline]');
      if (b) { state.budget = b.getAttribute('data-budget'); render(); }
      if (t) { state.timeline = t.getAttribute('data-timeline'); render(); }
    });
  }

  function init() {
    if (!document.getElementById('quote-step-container')) return;
    prefillFromURL();
    attachDynamicListeners();
    document.getElementById('quote-next')?.addEventListener('click', next);
    document.getElementById('quote-prev')?.addEventListener('click', prev);
    document.getElementById('quote-submit')?.addEventListener('click', submit);
    render();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', QuoteEngine.init);