/* R&D Portal frontend demo: all data is local and intentionally non-secure. */
const STORAGE = { resources: 'rdp_resources', requests: 'rdp_requests', user: 'rdp_current_user' };
const isNetlifyHost = typeof window !== 'undefined' && window.location.hostname.includes('netlify.app');
const API_BASE = typeof window !== 'undefined' && window.__RDP_API_BASE__ ? window.__RDP_API_BASE__ : isNetlifyHost ? '' : 'http://localhost:5001/api';
const normalizeRole = (value) => {
  const role = String(value || '').trim().toLowerCase();
  if (role === 'technician' || role === 'lab_technician') return 'lab_technician';
  return role;
};

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('rdp_token');
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) };
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || `API request failed with ${response.status}`);
  return payload.data;
}

// Data initialization and LocalStorage
function getResources() { const saved = JSON.parse(localStorage.getItem(STORAGE.resources) || 'null'); return Array.isArray(saved) && saved.length && saved.every((resource) => departments.some((department) => department.shortName === resource.department)) ? saved : resources; }
function getRequests() { return JSON.parse(localStorage.getItem(STORAGE.requests) || '[]'); }
function saveRequests(items) { localStorage.setItem(STORAGE.requests, JSON.stringify(items)); }
function getCurrentUser() { return JSON.parse(localStorage.getItem(STORAGE.user) || 'null'); }
function initializeStorage() { const saved = JSON.parse(localStorage.getItem(STORAGE.resources) || 'null'); if (!Array.isArray(saved) || !saved.length || !saved.every((resource) => departments.some((department) => department.shortName === resource.department))) localStorage.setItem(STORAGE.resources, JSON.stringify(resources)); }

// Navigation
function initializeNavigation() {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-navigation');
  if (!menuButton || !navigation) return;
  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
}
function initializeLogoFallback() {
  document.querySelectorAll('.college-logo').forEach((logo) => logo.addEventListener('error', () => {
    logo.removeAttribute('src'); logo.alt = 'College logo placeholder'; logo.classList.add('logo-fallback');
  }, { once: true }));
}
function clearSession() {
  localStorage.removeItem(STORAGE.user);
  localStorage.removeItem('rdp_token');
  window.location.href = 'login.html';
}
function renderUserSummary() {
  const currentUser = getCurrentUser();
  const summary = document.getElementById('user-profile-summary');
  const homeCard = document.getElementById('home-user-card');

  if (!summary && !homeCard) return;

  if (!currentUser) {
    if (summary) summary.innerHTML = '<span class="user-summary-empty">Not signed in</span>';
    if (homeCard) homeCard.innerHTML = '';
    return;
  }

  const roleLabel = String(currentUser.role || 'student').replace(/\b\w/g, (letter) => letter.toUpperCase());
  const userText = `${currentUser.name || currentUser.email || 'User'} • ${roleLabel}`;

  if (summary) {
    summary.innerHTML = `<div class="user-summary-pill"><span class="user-summary-name">${escapeHtml(currentUser.name || currentUser.email || 'User')}</span><span class="user-summary-role">${escapeHtml(roleLabel)}</span></div>`;
  }

  if (homeCard) {
    homeCard.innerHTML = `
      <div class="user-card-box">
        <div class="user-card-label">Logged in as</div>
        <div class="user-card-name">${escapeHtml(currentUser.name || currentUser.email || 'User')}</div>
        <div class="user-card-meta">${escapeHtml(currentUser.email || currentUser.registerNumber || '')}</div>
        <div class="user-card-meta">Role: ${escapeHtml(roleLabel)}</div>
      </div>
    `;
  }

  document.querySelectorAll('#logout-button').forEach((button) => {
    button.textContent = 'Logout';
    button.setAttribute('title', userText);
  });
}

function initializeSessionActions() {
  const currentUser = getCurrentUser();
  document.querySelectorAll('#logout-button').forEach((button) => button.addEventListener('click', clearSession));

  if (currentUser) {
    document.querySelectorAll('.button-login[href="login.html"]').forEach((link) => {
      const logout = document.createElement('button');
      logout.className = link.className;
      logout.type = 'button';
      logout.textContent = 'Logout';
      logout.addEventListener('click', clearSession);
      link.replaceWith(logout);
    });
  }

  renderUserSummary();
}
function initializeLogin() {
  const form = document.getElementById('login-form');
  const message = document.getElementById('login-message');
  if (!form || !message) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.hidden = true;
    message.className = 'message';

    const loginValue = form.elements['login-email'].value.trim();
    const passwordValue = form.elements['login-password'].value;
    const roleValue = String(form.elements['login-role']?.value || '').trim().toLowerCase();

    try {
      const data = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email: loginValue, password: passwordValue, role: roleValue }) });
      localStorage.setItem(STORAGE.user, JSON.stringify(data.user));
      localStorage.setItem('rdp_token', data.token);
      window.location.href = 'dashboard.html';
    } catch (error) {
      message.textContent = error.message || 'Invalid credentials. Please try again.';
      message.hidden = false;
      message.classList.add('message-error');
    }
  });
}

function initializeAuthUI() {
  const tabs = document.querySelectorAll('.auth-role-tab');
  const forms = document.querySelectorAll('.auth-form');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const portalTitle = document.getElementById('portal-title');
  const portalSubtitle = document.querySelector('.auth-header-copy p');

  if (!tabs.length || !forms.length) return;

  let selectedRole = 'student';

  const syncLoginRole = () => {
    const loginRole = document.getElementById('login-role');
    if (loginRole) loginRole.value = selectedRole;
  };

  const syncRegisterRole = () => {
    const registerRole = document.getElementById('register-role');
    const registerButton = document.querySelector('.register-button');
    if (registerRole) registerRole.value = selectedRole === 'admin' ? 'student' : selectedRole;
    if (registerButton) {
      const roleLabel = selectedRole === 'lab_technician' ? 'Lab Technician' : selectedRole === 'faculty' ? 'Faculty' : 'Student';
      registerButton.firstChild.textContent = `Register ${roleLabel} Account `;
    }
  };

  const setMode = (mode) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.authRole === selectedRole;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    forms.forEach((form) => {
      form.classList.toggle('active', form.id === (mode === 'register' ? 'register-form' : 'login-form'));
    });

    syncLoginRole();
    syncRegisterRole();

    if (portalTitle) {
      portalTitle.textContent = mode === 'register' ? 'Create your account' : 'Sign in to your portal';
    }
    if (portalSubtitle) {
      portalSubtitle.textContent = mode === 'register' ? 'Create your campus access account to continue.' : 'Choose your access type to continue.';
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      selectedRole = tab.dataset.authRole || 'student';
      setMode('login');
    });
  });

  const loginSwitch = document.querySelector('.switch-to-login');
  if (loginSwitch) {
    loginSwitch.addEventListener('click', () => setMode('login'));
  }

  const registerSwitch = document.querySelector('.switch-to-register');
  if (registerSwitch) {
    registerSwitch.addEventListener('click', () => setMode('register'));
  }

  if (registerForm) {
    const registerRole = document.getElementById('register-role');
    if (registerRole) {
      registerRole.addEventListener('change', () => {
        selectedRole = normalizeRole(registerRole.value);
        syncLoginRole();
        syncRegisterRole();
      });
    }

    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(registerForm);
      const name = String(formData.get('register-name') || '').trim();
      const registerNumber = String(formData.get('register-number') || '').trim();
      const email = String(formData.get('register-email') || '').trim();
      const phone = String(formData.get('register-phone') || '').trim();
      const department = String(formData.get('register-department') || '').trim();
      const program = String(formData.get('register-program') || '').trim();
      const year = String(formData.get('register-year') || '').trim();
      const section = String(formData.get('register-section') || '').trim();
      const password = String(formData.get('register-password') || '');
      const confirmPassword = String(formData.get('register-confirm-password') || '');
      const accountRole = normalizeRole(formData.get('register-role') || selectedRole);

      if (!name || !registerNumber || !email || !phone || !department || !program || !year || !section || !password || !confirmPassword || !['student', 'faculty', 'lab_technician'].includes(accountRole)) {
        showToast('Please complete all fields');
        return;
      }

      if (password !== confirmPassword) {
        showToast('Passwords do not match');
        return;
      }

      try {
        const departmentCode = departments.find((item) => item.name === department)?.shortName || department;
        const data = await apiFetch('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name, email, password, role: accountRole, departmentCode })
        });
        registerForm.reset();
        localStorage.setItem(STORAGE.user, JSON.stringify(data.user));
        localStorage.setItem('rdp_token', data.token);
        window.location.href = 'dashboard.html';
      } catch (error) {
        showToast(error.message || 'Account creation failed.');
      }
    });
  }

  if (loginForm) {
    const passwordToggle = document.querySelector('.password-visibility');
    if (passwordToggle) {
      passwordToggle.addEventListener('click', () => {
        const input = document.getElementById('login-password');
        if (!input) return;
        input.type = input.type === 'password' ? 'text' : 'password';
      });
    }
  }

  setMode('login');
}
function renderDashboardStats(stats) {
  const cards = document.getElementById('dashboard-cards');
  const detail = document.getElementById('dashboard-detail');
  if (!cards || !detail) return;

  const currentUser = getCurrentUser();
  const items = [
    ['Departments', stats.departments, 'Research departments'],
    ['Facilities', stats.facilities, 'Shared research spaces'],
    ['Equipment', stats.equipment, 'Available equipment records'],
    ['Experts', stats.experts, 'Faculty and specialists'],
    ['Pending Requests', stats.pendingRequests, 'Requests awaiting review'],
    ['My Requests', stats.myRequests, 'Requests submitted by you']
  ].filter(([, value]) => value !== undefined);

  cards.innerHTML = items.map(([label, value, description]) => `<article class="dashboard-card"><h2>${label}</h2><div class="big-number">${value}</div><p>${description}</p></article>`).join('');

  if (currentUser) {
    const roleLabel = String(currentUser.role || 'student').replace(/\b\w/g, (letter) => letter.toUpperCase());
    const detailRows = [
      ['Name', currentUser.name || currentUser.email || 'User'],
      ['Email', currentUser.email || 'Not available'],
      ['Role', roleLabel],
      ['Department', currentUser.department || 'Not assigned'],
      ['Register Number', currentUser.registerNumber || 'Not available']
    ];

    detail.innerHTML = `
      <div class="section-heading">
        <p class="eyebrow">Profile overview</p>
        <h2>Account details</h2>
      </div>
      <div class="user-detail-grid">
        ${detailRows.map(([label, value]) => `
          <div class="user-detail-item">
            <span class="user-detail-label">${escapeHtml(label)}</span>
            <strong>${escapeHtml(value)}</strong>
          </div>
        `).join('')}
      </div>
      <div class="section-heading" style="margin-top: 2rem;">
        <p class="eyebrow">Resource overview</p>
        <h2>Research resources at a glance</h2>
        <p>Use the portal navigation to explore facilities, equipment, expertise, and requests across the institute.</p>
      </div>
    `;
    return;
  }

  detail.innerHTML = '<div class="section-heading"><p class="eyebrow">Resource overview</p><h2>Research resources at a glance</h2><p>Use the portal navigation to explore facilities, equipment, expertise, and requests across the institute.</p></div>';
}
function initializeDashboard() {
  const cards = document.getElementById('dashboard-cards');
  if (!cards) return;

  const currentUser = getCurrentUser();
  const subtitle = document.getElementById('dashboard-subtitle');
  const role = normalizeRole(currentUser?.role || 'student');
  const rosterPanel = document.querySelector('.faculty-roster-panel');
  if (rosterPanel) rosterPanel.style.display = role === 'faculty' || role === 'lab_technician' ? 'block' : 'none';

  const localStats = {
    departments: departments.length,
    facilities: resources.filter((resource) => resource.type === 'Facility').length,
    equipment: resources.filter((resource) => resource.type === 'Equipment').length,
    experts: expertise.length,
    pendingRequests: getRequests().filter((request) => request.status === 'Pending').length,
    myRequests: getRequests().filter((request) => request.userEmail === currentUser?.email).length
  };

  if (currentUser && subtitle) {
    subtitle.textContent = `Welcome back, ${currentUser.name || currentUser.email || 'researcher'}.`;
  }

  renderDashboardStats(localStats);

  if (!currentUser) return;

  const endpoint = role === 'faculty' ? '/dashboard/faculty' : role === 'lab_technician' ? '/dashboard/lab-technician' : '/dashboard/stats';

  apiFetch(endpoint)
    .then((payload) => {
      const data = payload?.stats || payload?.data || payload || {};
      const sanitized = {
        departments: Number(data.departments ?? departments.length),
        facilities: Number(data.facilities ?? resources.filter((resource) => resource.type === 'Facility').length),
        equipment: Number(data.equipment ?? resources.filter((resource) => resource.type === 'Equipment').length),
        experts: Number(data.experts ?? expertise.length),
        pendingRequests: Number(data.pendingRequests ?? getRequests().filter((request) => request.status === 'Pending').length),
        myRequests: Number(data.myRequests ?? getRequests().filter((request) => request.userEmail === currentUser?.email).length),
      };
      renderDashboardStats(sanitized);
    })
    .catch(() => {
      renderDashboardStats(localStats);
    });
}
function populateDepartmentSelect(select, placeholder = 'All Departments') {
  if (!select) return;
  select.innerHTML = `<option value="${placeholder === 'Select department' ? '' : 'all'}">${placeholder}</option>`;
  departments.forEach((item) => select.insertAdjacentHTML('beforeend', `<option value="${item.shortName}">${escapeHtml(item.displayName || item.shortName)}</option>`));
}
function initializeHomeDepartment() { populateDepartmentSelect(document.getElementById('home-department')); }

// Toast notifications
function showToast(message) {
  const region = document.querySelector('.toast-region'); if (!region) return;
  const toast = document.createElement('div'); toast.className = 'toast'; toast.textContent = message; region.append(toast);
  window.setTimeout(() => toast.remove(), 3200);
}
function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[character]); }
function availabilityBadge(value) { const key = value.toLowerCase(); return `<span class="badge badge-${key}">${escapeHtml(value)}</span>`; }

// Resource rendering and search/filter system
function resourceCard(resource) {
  return `<article class="resource-card"><div class="resource-card-header"><span class="resource-category">${escapeHtml(resource.type)}</span>${availabilityBadge(resource.availability)}</div><h3>${escapeHtml(resource.name)}</h3><p>${escapeHtml(resource.description)}</p><dl class="resource-details"><div><dt>Department</dt><dd>${escapeHtml(resource.department)}</dd></div><div><dt>Location</dt><dd>${escapeHtml(resource.location)}</dd></div></dl><div class="card-actions"><button class="button button-secondary button-small" type="button" data-resource-id="${resource.id}">View Details</button><a class="button button-primary button-small" href="requests.html?resource=${encodeURIComponent(resource.id)}">Request Resource</a></div></article>`;
}
function matchesResource(resource, filters) {
  const searchable = Object.values(resource).join(' ').toLowerCase();
  return (!filters.query || searchable.includes(filters.query.toLowerCase())) && (!filters.department || filters.department === 'all' || resource.department === filters.department) && (!filters.type || filters.type === 'all' || resource.type === filters.type) && (!filters.availability || filters.availability === 'all' || resource.availability === filters.availability) && (!filters.area || filters.area === 'all' || resource.category === filters.area);
}
function renderResourceList(container, filters = {}) {
  const results = getResources().filter((resource) => matchesResource(resource, filters));
  container.innerHTML = results.length ? results.map(resourceCard).join('') : '<div class="empty-state">No resources match your search. Try clearing a filter.</div>';
  container.querySelectorAll('[data-resource-id]').forEach((button) => button.addEventListener('click', () => openResourceModal(button.dataset.resourceId)));
}
function openResourceModal(id) {
  const resource = getResources().find((item) => item.id === id); if (!resource) return;
  const root = document.getElementById('modal-root'); if (!root) return;
  root.innerHTML = `<div class="modal-backdrop is-open" role="presentation"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-header"><h2 id="modal-title">${escapeHtml(resource.name)}</h2><button class="modal-close" type="button" aria-label="Close">&times;</button></div><div class="modal-content"><p>${escapeHtml(resource.description)}</p><dl class="modal-detail-grid"><div><dt>Department</dt><dd>${escapeHtml(resource.department)}</dd></div><div><dt>Resource Type</dt><dd>${escapeHtml(resource.type)}</dd></div><div><dt>Category</dt><dd>${escapeHtml(resource.category)}</dd></div><div><dt>Location</dt><dd>${escapeHtml(resource.location)}</dd></div><div><dt>Availability</dt><dd>${availabilityBadge(resource.availability)}</dd></div><div><dt>Capacity</dt><dd>${escapeHtml(resource.capacity)}</dd></div><div><dt>Responsible Faculty</dt><dd>${escapeHtml(resource.faculty)}</dd></div><div><dt>Contact</dt><dd>${escapeHtml(resource.contact)}</dd></div></dl><div class="card-actions"><button class="button button-secondary modal-close" type="button">Close</button><a class="button button-primary" href="requests.html?resource=${encodeURIComponent(resource.id)}">Request Resource</a></div></div></section></div>`;
  bindModalClose(root.querySelector('.modal-backdrop'));
}
function bindModalClose(backdrop) { const close = () => backdrop.remove(); backdrop.querySelectorAll('.modal-close').forEach((button) => button.addEventListener('click', close)); backdrop.addEventListener('click', (event) => { if (event.target === backdrop) close(); }); document.addEventListener('keydown', function escape(event) { if (event.key === 'Escape') { close(); document.removeEventListener('keydown', escape); } }); }
function initializeResourceSearch() {
  const form = document.getElementById('resource-search'); const list = document.getElementById('featured-resource-list'); if (!form || !list) return;
  renderResourceList(list);
  form.addEventListener('submit', (event) => { event.preventDefault(); renderResourceList(list, { query: form.query.value, department: form.department.value, type: form.type.value, availability: form.availability.value, area: form.area.value }); document.getElementById('featured-resources').scrollIntoView({ behavior:'smooth' }); });
}
function initializeDirectoryFilters(kind) {
  if (kind === 'facility') return initializeLaboratoryDirectory();
  const list = document.getElementById(`${kind}-list`); if (!list) return;
  const prefix = kind === 'facility' ? 'facility' : 'equipment';
  const search = document.getElementById(`${prefix}-search`); const department = document.getElementById(`${prefix}-department`); const availability = document.getElementById(`${prefix}-availability`); const category = document.getElementById(`${prefix}-${kind === 'facility' ? 'type' : 'category'}`);
  populateDepartmentSelect(department);
  const requestedDepartment = new URLSearchParams(location.search).get('department');
  if (requestedDepartment && [...department.options].some((option) => option.value === requestedDepartment)) department.value = requestedDepartment;
  if (category && kind === 'equipment') [...new Set(getResources().filter((item) => item.type === 'Equipment').map((item) => item.category))].forEach((item) => category.insertAdjacentHTML('beforeend', `<option>${escapeHtml(item)}</option>`));
  const render = () => { const filtered = getResources().filter((item) => item.type === (kind === 'facility' ? 'Facility' : 'Equipment')).filter((item) => (!search.value || Object.values(item).join(' ').toLowerCase().includes(search.value.toLowerCase())) && (department.value === 'all' || item.department === department.value) && (availability.value === 'all' || item.availability === availability.value) && (!category || category.value === 'all' || item.category === category.value)); list.innerHTML = filtered.length ? filtered.map(resourceCard).join('') : '<div class="empty-state">No matching resources found.</div>'; list.querySelectorAll('[data-resource-id]').forEach((button) => button.addEventListener('click', () => openResourceModal(button.dataset.resourceId))); };
  [search, department, availability, category].filter(Boolean).forEach((control) => control.addEventListener('input', render)); render();
}
function initializeExpertiseDirectory() {
  const list = document.getElementById('expert-list');
  const categories = document.getElementById('expertise-categories');
  if (!list || !categories) return;
  categories.innerHTML = expertiseCategories.map((category) => `<a class="expertise-item" href="#expert-list"><span>${escapeHtml(category)}</span><span aria-hidden="true">&#8594;</span></a>`).join('');
  list.innerHTML = expertise.map((expert) => `<article class="expert-card"><span class="eyebrow">${escapeHtml(expert.department)}</span><h3>${escapeHtml(expert.name)}</h3><p>${escapeHtml(expert.designation)}</p><p><strong>Research areas:</strong> ${escapeHtml(expert.areas)}</p><p><strong>Contact:</strong> ${escapeHtml(expert.contact)}</p></article>`).join('');
}
function laboratoryCard(lab) {
  const equipment = (lab.equipment || []).map((item) => typeof item === 'string' ? item : item.name);
  const manpower = lab.department_code === 'IT' ? (lab.technicalStaff || 'Not Available in Official Document') : '';
  const itDetails = lab.department_code === 'IT' ? `<p><strong>Important Equipment:</strong> ${escapeHtml(equipment.join(', '))}</p><p><strong>Technical Manpower:</strong> ${escapeHtml(manpower)}</p>` : '';
  return `<article class="resource-card"><div class="resource-card-header"><span class="resource-category">${escapeHtml(lab.type || 'Laboratory')}</span>${availabilityBadge(lab.availability || 'Available')}</div><h3>${escapeHtml(lab.name)}</h3><p>${escapeHtml(lab.description || 'Laboratory inventory supplied by the department.')}</p>${itDetails}<dl class="resource-details"><div><dt>Course Code</dt><dd>${escapeHtml(lab.course_code || 'Not specified')}</dd></div><div><dt>Department</dt><dd>${escapeHtml(lab.department_code)}</dd></div><div><dt>Semester</dt><dd>${escapeHtml(lab.semester || 'Not specified')}</dd></div><div><dt>Regulation</dt><dd>${escapeHtml(lab.regulation || 'Not specified')}</dd></div><div><dt>Batch</dt><dd>${escapeHtml(lab.batch_size ? `${lab.batch_size} students` : lab.capacity)}</dd></div><div><dt>Equipment count</dt><dd>${escapeHtml(lab.equipment_count ?? 'View details')}</dd></div></dl><div class="card-actions"><button class="button button-secondary button-small" type="button" data-lab-id="${lab.id}">View Details</button><a class="button button-primary button-small" href="requests.html?resource=${encodeURIComponent(lab.id)}">Request Lab</a></div></article>`;
}
function laboratorySearchText(lab) { return [lab.name, lab.department_code, lab.course_code, lab.semester, lab.regulation, lab.description, ...(lab.equipment || []).map((item) => typeof item === 'string' ? item : item.name)].join(' ').toLowerCase(); }
let laboratoryRecords = [];
function normalizeDepartment(value) {
  const department = String(value || '').trim().toLowerCase();
  if (department === 'it' || department === 'information technology') return 'IT';
  if (department === 'cse' || department === 'computer science' || department === 'computer science and engineering') return 'CSE';
  if (department === 'mech' || department === 'mechanical' || department === 'mechanical engineering') return 'MECH';
  return String(value || '').trim().toUpperCase();
}
function normalizeLocalLaboratory(lab) {
  const manpower = lab.technicalManpower;
  const unavailable = 'Not Available in Official Document';
  const department = normalizeDepartment(lab.department);
  return { ...lab, department, department_code: department, type: 'Laboratory', course_code: lab.courseCode || (department === 'IT' ? 'IT Laboratory' : 'Not specified'), semester: lab.semester || 'Not specified', regulation: lab.regulation || 'Not specified', capacity: `${lab.batchSize || lab.batch_size} students`, batch_size: lab.batchSize || lab.batch_size, availability: 'Available', equipment_count: lab.equipment.length, technicalStaff: manpower?.name || unavailable, designation: manpower?.designation || unavailable, qualification: manpower?.qualification || unavailable, description: lab.description || `${lab.utilization} | Batch Size: ${lab.batchSize} | Technical Manpower: ${manpower?.name || unavailable}` };
}
function normalizeResourceLaboratory(resource) {
  const department = normalizeDepartment(resource.department);
  return { ...resource, department_code: department, type: 'Laboratory', course_code: 'Not specified', semester: 'Not specified', regulation: 'Not specified', batch_size: resource.capacity, equipment: [], equipment_count: 0, technicalStaff: resource.faculty || 'Not Specified', designation: 'Not Specified', qualification: 'Not Specified' };
}
function normalizeApiLaboratory(lab) {
  const department = normalizeDepartment(lab.department_code || lab.department);
  return { ...lab, department, department_code: department };
}
function openLaboratoryModal(id) {
  const lab = [...itLaboratories.map(normalizeLocalLaboratory), ...cseLaboratories, ...aidsLaboratories.map(normalizeLocalLaboratory), ...laboratoryRecords].find((item) => String(item.id) === String(id));
  const root = document.getElementById('modal-root');
  if (!lab || !root) return;
  const equipment = (lab.equipment || []).map((item) => {
    const entry = typeof item === 'string' ? { name: item } : item;
    const required = entry.required ?? entry.required_quantity;
    const available = entry.available ?? entry.available_quantity;
    const quantities = required === undefined ? '' : ` <span>Required: ${escapeHtml(required)} | Available: ${escapeHtml(available)} | Deficiency: ${escapeHtml(entry.deficiency)}</span>`;
    return `<li>${escapeHtml(entry.name)}${quantities}</li>`;
  }).join('');
  root.innerHTML = `<div class="modal-backdrop is-open" role="presentation"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="laboratory-modal-title"><div class="modal-header"><h2 id="laboratory-modal-title">${escapeHtml(lab.name)}</h2><button class="modal-close" type="button" aria-label="Close">&times;</button></div><div class="modal-content"><dl class="modal-detail-grid"><div><dt>Department</dt><dd>${escapeHtml(lab.department_code)}</dd></div><div><dt>Course Code</dt><dd>${escapeHtml(lab.course_code || 'Not specified')}</dd></div><div><dt>Semester</dt><dd>${escapeHtml(lab.semester || 'Not specified')}</dd></div><div><dt>Regulation</dt><dd>${escapeHtml(lab.regulation || 'Not specified')}</dd></div><div><dt>Batch Size</dt><dd>${escapeHtml(lab.batch_size || lab.capacity || 'Not specified')}</dd></div><div><dt>Weekly Utilization</dt><dd>${escapeHtml(lab.utilization || 'Not specified')}</dd></div><div><dt>Technical Staff</dt><dd>${escapeHtml(lab.technicalStaff || 'Not Specified')}</dd></div><div><dt>Designation</dt><dd>${escapeHtml(lab.designation || 'Not Specified')}</dd></div><div><dt>Qualification</dt><dd>${escapeHtml(lab.qualification || 'Not Specified')}</dd></div></dl><h3>Equipment</h3><ul class="equipment-list">${equipment}</ul><div class="card-actions"><button class="button button-secondary modal-close" type="button">Close</button><a class="button button-primary" href="requests.html?resource=${encodeURIComponent(lab.id)}">Request Lab</a></div></div></section></div>`;
  bindModalClose(root.querySelector('.modal-backdrop'));
}
async function initializeLaboratoryDirectory() {
  const list = document.getElementById('facility-list');
  if (!list) return;

  const search = document.getElementById('facility-search');
  const department = document.getElementById('facility-department');
  const semester = document.getElementById('facility-semester');
  const regulation = document.getElementById('facility-regulation');
  const courseCode = document.getElementById('facility-course-code');
  const type = document.getElementById('facility-type');

  populateDepartmentSelect(department);

  const requestedDepartment =
    new URLSearchParams(location.search).get('department');

  const requestedDepartmentCode = normalizeDepartment(requestedDepartment);
  if (requestedDepartmentCode && [...department.options].some((option) => option.value === requestedDepartmentCode)) department.value = requestedDepartmentCode;

  async function render() {
    list.innerHTML =
      '<div class="empty-state">Loading laboratories...</div>';
    const selectedDepartment = normalizeDepartment(department.value);

    try {
      let labs = [];

      /*
       * IT laboratory data is maintained locally in data.js.
       * Other departments continue using the PostgreSQL API.
       */
      if (selectedDepartment === 'IT') {
        const apiLabs = (await apiFetch('/facilities?department=IT')).map(normalizeApiLaboratory).filter((lab) => lab.type === 'Laboratory' && lab.batch_size !== null);
        const localLabsByName = new Map(itLaboratories.map((lab) => [lab.name, normalizeLocalLaboratory(lab)]));
        labs = apiLabs.map((lab) => ({ ...localLabsByName.get(lab.name), ...lab, id: localLabsByName.get(lab.name)?.id || lab.id, equipment: localLabsByName.get(lab.name)?.equipment || [] }));
      } else if (selectedDepartment === 'CSE') {
        labs = cseLaboratories.filter((lab) => normalizeDepartment(lab.department) === 'CSE');
      } else if (selectedDepartment === 'AIDS') {
        labs = aidsLaboratories.filter((lab) => normalizeDepartment(lab.department) === 'AIDS').map(normalizeLocalLaboratory);
      } else {
        const params = new URLSearchParams();

        if (department.value !== 'all')
          params.set('department', department.value);

        if (semester.value !== 'all')
          params.set('semester', semester.value);

        if (regulation.value !== 'all')
          params.set('regulation', regulation.value);

        if (courseCode.value)
          params.set('course_code', courseCode.value.trim());

        if (type.value !== 'all')
          params.set('type', type.value);

        if (search.value)
          params.set('search', search.value.trim());

        labs = (await apiFetch(`/facilities?${params}`)).map(normalizeApiLaboratory)
          .filter((lab) => lab.course_code)
          .filter((lab) => selectedDepartment === 'ALL' || !['IT', 'CSE'].includes(lab.department_code));
        if (selectedDepartment === 'ALL') labs = [...itLaboratories.map(normalizeLocalLaboratory), ...cseLaboratories, ...aidsLaboratories.map(normalizeLocalLaboratory), ...labs];
      }

      // Local laboratory records need frontend filtering because they do not use the API.
      if (['IT', 'CSE', 'AIDS'].includes(selectedDepartment)) {
        const query = search.value.trim().toLowerCase();

        if (query) {
          labs = labs.filter((lab) => laboratorySearchText(lab).includes(query));
        }

        if (courseCode.value.trim()) {
          labs = labs.filter((lab) => (lab.course_code || '').toLowerCase().includes(courseCode.value.trim().toLowerCase()));
        }
        if (semester.value !== 'all') labs = labs.filter((lab) => lab.semester === semester.value);
        if (regulation.value !== 'all') labs = labs.filter((lab) => lab.regulation === regulation.value || lab.regulation === regulation.value.replace(' ', ''));
        if (type.value !== 'all') labs = labs.filter((lab) => lab.type === type.value);
      }

      laboratoryRecords = labs;

      list.innerHTML = labs.length
        ? labs.map(laboratoryCard).join('')
        : '<div class="empty-state">No laboratories match the selected filters.</div>';

      list.querySelectorAll('[data-lab-id]').forEach((button) => {
        button.addEventListener('click', () =>
          openLaboratoryModal(button.dataset.labId)
        );
      });

    } catch (error) {
      const localLabs = [
        ...itLaboratories.map(normalizeLocalLaboratory),
        ...cseLaboratories,
        ...aidsLaboratories.map(normalizeLocalLaboratory),
        ...resources.filter((resource) => resource.type === 'Facility' && ['ECE', 'EEE', 'MECH'].includes(normalizeDepartment(resource.department))).map(normalizeResourceLaboratory)
      ].filter((lab) => selectedDepartment === 'ALL' || lab.department_code === selectedDepartment)
        .filter((lab) => !search.value.trim() || laboratorySearchText(lab).includes(search.value.trim().toLowerCase()))
        .filter((lab) => semester.value === 'all' || lab.semester === semester.value)
        .filter((lab) => regulation.value === 'all' || lab.regulation === regulation.value || lab.regulation === regulation.value.replace(' ', ''))
        .filter((lab) => !courseCode.value.trim() || (lab.course_code || '').toLowerCase().includes(courseCode.value.trim().toLowerCase()))
        .filter((lab) => type.value === 'all' || lab.type === type.value);
      laboratoryRecords = localLabs;
      list.innerHTML = localLabs.length
        ? localLabs.map(laboratoryCard).join('')
        : '<div class="empty-state">No laboratories match the selected filters.</div>';
      list.querySelectorAll('[data-lab-id]').forEach((button) => button.addEventListener('click', () => openLaboratoryModal(button.dataset.labId)));
    }
  }

  [search, department, semester, regulation, courseCode, type]
    .forEach((control) => control.addEventListener('input', render));

  render();
}

function initializeDepartments() {
  const list = document.getElementById('department-list');
  if (!list) return;
  list.innerHTML = departments.map((department) => `<article class="resource-card"><span class="eyebrow">Department Code: ${escapeHtml(department.shortName)}</span><h2>${escapeHtml(department.name)}</h2><p>${escapeHtml(department.description)}</p><p><strong>${escapeHtml(department.facilities)} facilities</strong></p><a class="button button-primary" href="facilities.html?department=${encodeURIComponent(department.shortName)}">View Resources</a></article>`).join('');
}

const defaultFacultyStudents = [
  { registerNo: '721224idat01', name: 'Priyan', department: 'Information Technology', year: '3rd Year', section: 'A', email: '24itad01@karpagamtech.ac.in', active: true },
  { registerNo: '721224ecbd30', name: 'Mowniya C', department: 'Electronics and Communication Engineering', year: '3rd Year', section: 'A', email: '24ecbd30@karpagamtech.ac.in', active: true },
  { registerNo: '721224ecbd47', name: 'Thiruja R', department: 'Electronics and Communication Engineering', year: '3rd Year', section: 'A', email: '24ecbd47@karpagamtech.ac.in', active: true },
  { registerNo: '721224ecb17', name: 'Madhumathi R', department: 'Electronics and Communication Engineering', year: '3rd Year', section: 'A', email: '24ecb17@karpagamtech.ac.in', active: true },
  { registerNo: '721224eca57', name: 'Jekin deva packiyan J', department: 'Electronics and Communication Engineering', year: '3rd Year', section: 'A', email: '24eca57@karpagamtech.ac.in', active: true },
  { registerNo: '721224bcd52', name: 'Priyadharshini S', department: 'Electronics and Communication Engineering', year: '3rd Year', section: 'A', email: '24ecbd52@karpagamtech.ac.in', active: true },
  { registerNo: '721224ECCD35', name: 'Suba S', department: 'Electronics and Communication Engineering', year: '3rd Year', section: 'A', email: '24ecCD35@karpagamtech.ac.in', active: true },
  { registerNo: '721224ECAD18', name: 'Deepika Sai A', department: 'Electronics and Communication Engineering', year: '3rd Year', section: 'A', email: '24ecad18@karpagamtech.ac.in', active: true },
  { registerNo: '721224ECCD49', name: 'Vaishnavi P', department: 'Electronics and Communication Engineering', year: '3rd Year', section: 'A', email: '24ECCD49@karpagamtech.ac.in', active: true },
  { registerNo: '721224ecbd61', name: 'Rangnaya G', department: 'Electronics and Communication Engineering', year: '3rd Year', section: 'A', email: '24ecbd61@karpagamtech.ac.in', active: true }
];

function openStudentDetailModal(student) {
  const root = document.getElementById('modal-root');
  if (!root) return;

  const detailRows = [
    ['Register Number', student.registerNo || 'N/A'],
    ['Name', student.name || 'Student'],
    ['Department', student.department || 'Department'],
    ['Year', student.year || 'Not specified'],
    ['Section', student.section || 'A'],
    ['Email', student.email || 'student@college.edu'],
    ['Role', student.role || 'student']
  ];

  root.innerHTML = `
    <div class="modal-backdrop is-open" role="presentation">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="student-modal-title">
        <div class="modal-header">
          <h2 id="student-modal-title">Student Details</h2>
          <button class="modal-close" type="button" aria-label="Close">&times;</button>
        </div>
        <div class="modal-content">
          <dl class="modal-detail-grid">
            ${detailRows.map(([label, value]) => `
              <div>
                <dt>${escapeHtml(label)}</dt>
                <dd>${escapeHtml(value)}</dd>
              </div>
            `).join('')}
          </dl>
          <div class="card-actions">
            <button class="button button-secondary modal-close" type="button">Close</button>
          </div>
        </div>
      </section>
    </div>
  `;

  bindModalClose(root.querySelector('.modal-backdrop'));
}

function removeRegisteredUserById(targetValue) {
  return false;
}

function initializeFacultyRoster() {
  const tableBody = document.getElementById('authorized-students-body');
  const searchInput = document.getElementById('roster-search');
  const departmentFilter = document.getElementById('roster-department');
  const yearFilter = document.getElementById('roster-year');
  const sectionFilter = document.getElementById('roster-section');
  const countLabel = document.getElementById('roster-count-label');
  const refreshButton = document.getElementById('refresh-roster-button');

  if (!tableBody) return;

  let authorizedStudents = defaultFacultyStudents;
  const getAuthorizedStudents = () => authorizedStudents;

  const refreshDepartmentOptions = () => {
    const students = getAuthorizedStudents();
    const departments = [...new Set(students.map((student) => student.department))].sort();
    if (!departmentFilter) return;

    const currentValue = departmentFilter.value || 'all';
    departmentFilter.innerHTML = '<option value="all">Department</option>' + departments.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join('');
    if (departments.includes(currentValue)) departmentFilter.value = currentValue;
    else departmentFilter.value = 'all';
  };

  const renderRows = () => {
    const students = getAuthorizedStudents();
    const query = (searchInput?.value || '').trim().toLowerCase();
    const department = departmentFilter?.value || 'all';
    const year = yearFilter?.value || 'all';
    const section = sectionFilter?.value || 'all';

    const filtered = students.filter((student) => {
      const matchesQuery = !query || student.name.toLowerCase().includes(query) || student.registerNo.toLowerCase().includes(query) || student.email.toLowerCase().includes(query);
      const matchesDepartment = department === 'all' || student.department === department;
      const matchesYear = year === 'all' || student.year === year;
      const matchesSection = section === 'all' || student.section === section;
      return matchesQuery && matchesDepartment && matchesYear && matchesSection;
    });

    tableBody.innerHTML = filtered.map((student) => `
      <tr>
        <td>${escapeHtml(student.registerNo)}</td>
        <td><span class="roster-avatar">${escapeHtml(String(student.name).split(' ').map((part) => part[0]).slice(0, 2).join('').toLowerCase())}</span>${escapeHtml(student.name)}</td>
        <td>${escapeHtml(student.department)}</td>
        <td>${escapeHtml(student.year)}</td>
        <td>${escapeHtml(student.section)}</td>
        <td>${escapeHtml(student.email)}</td>
        <td><span class="status-pill status-active">● Active</span></td>
        <td>
          <div class="roster-actions">
            <button type="button" class="roster-action-button view-button" data-register="${escapeHtml(student.registerNo)}">View</button>
            <button type="button" class="roster-action-button remove-button" data-register="${escapeHtml(student.registerNo)}">Remove</button>
          </div>
        </td>
      </tr>
    `).join('');

    tableBody.querySelectorAll('.view-button').forEach((button) => {
      button.addEventListener('click', () => {
        const targetId = button.dataset.register || '';
        const student = getAuthorizedStudents().find((item) => String(item.registerNo).toLowerCase() === String(targetId).toLowerCase());
        if (student) openStudentDetailModal(student);
      });
    });

    tableBody.querySelectorAll('.remove-button').forEach((button) => {
      button.addEventListener('click', () => {
        const targetId = button.dataset.register || '';
        const removed = removeRegisteredUserById(targetId);
        if (removed) {
          renderRows();
          refreshDepartmentOptions();
          showToast('Account removed successfully.');
        } else {
          showToast('No saved account found to remove.');
        }
      });
    });

    if (countLabel) {
      countLabel.textContent = `AUTHORIZED STUDENTS: ${filtered.length}`;
    }
  };

  refreshDepartmentOptions();

  [searchInput, departmentFilter, yearFilter, sectionFilter].forEach((control) => {
    if (control) control.addEventListener('input', renderRows);
    if (control) control.addEventListener('change', renderRows);
  });

  refreshButton?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (departmentFilter) departmentFilter.value = 'all';
    if (yearFilter) yearFilter.value = 'all';
    if (sectionFilter) sectionFilter.value = 'all';
    refreshDepartmentOptions();
    renderRows();
    showToast('Authorized roster refreshed.');
  });

  renderRows();
  apiFetch('/students')
    .then((students) => {
      authorizedStudents = (students || []).map((student) => ({
        registerNo: String(student.registerNumber || student.registerNo || student.email || 'N/A'),
        name: String(student.name || 'Student'),
        department: String(student.department?.name || student.department?.code || 'Department'),
        year: String(student.year || 'Not specified'),
        section: String(student.section || 'A'),
        email: String(student.email || 'student@college.edu'),
        active: true
      }));
      refreshDepartmentOptions();
      renderRows();
    })
    .catch(() => {});
}

document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
  initializeLogoFallback();
  initializeSessionActions();
  initializeLogin();
  initializeAuthUI();
  initializeDashboard();
  initializeStorage();
  renderUserSummary();
  initializeHomeDepartment();
  initializeResourceSearch();
  initializeDirectoryFilters('facility');
  initializeDirectoryFilters('equipment');
  initializeExpertiseDirectory();
  initializeDepartments();
  initializeFacultyRoster();
});