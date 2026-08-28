/* R&D Portal frontend demo: all data is local and intentionally non-secure. */
const STORAGE = { resources: 'rdp_resources', requests: 'rdp_requests', user: 'rdp_current_user' };
const API_BASE = 'http://localhost:5001/api';
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
function initializeSessionActions() {
  const currentUser = getCurrentUser();
  document.querySelectorAll('#logout-button').forEach((button) => button.addEventListener('click', clearSession));
  if (!currentUser) return;
  document.querySelectorAll('.button-login[href="login.html"]').forEach((link) => {
    const logout = document.createElement('button');
    logout.className = link.className;
    logout.type = 'button';
    logout.textContent = 'Logout';
    logout.addEventListener('click', clearSession);
    link.replaceWith(logout);
  });
}
function initializeLogin() {
  const form = document.getElementById('login-form');
  const message = document.getElementById('login-message');
  if (!form || !message) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.hidden = true;
    try {
      const data = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email: form.elements['login-email'].value, password: form.elements['login-password'].value }) });
      localStorage.setItem(STORAGE.user, JSON.stringify(data.user));
      localStorage.setItem('rdp_token', data.token);
      window.location.href = 'dashboard.html';
    } catch (error) {
      message.textContent = error.message;
      message.hidden = false;
    }
  });
}
function renderDashboardStats(stats) {
  const cards = document.getElementById('dashboard-cards');
  const detail = document.getElementById('dashboard-detail');
  if (!cards || !detail) return;
  const items = [
    ['Departments', stats.departments, 'Research departments'],
    ['Facilities', stats.facilities, 'Shared research spaces'],
    ['Equipment', stats.equipment, 'Available equipment records'],
    ['Experts', stats.experts, 'Faculty and specialists'],
    ['Pending Requests', stats.pendingRequests, 'Requests awaiting review'],
    ['My Requests', stats.myRequests, 'Requests submitted by you']
  ].filter(([, value]) => value !== undefined);
  cards.innerHTML = items.map(([label, value, description]) => `<article class="dashboard-card"><h2>${label}</h2><div class="big-number">${value}</div><p>${description}</p></article>`).join('');
  detail.innerHTML = '<div class="section-heading"><p class="eyebrow">Resource overview</p><h2>Research resources at a glance</h2><p>Use the portal navigation to explore facilities, equipment, expertise, and requests across the institute.</p></div>';
}
function initializeDashboard() {
  const cards = document.getElementById('dashboard-cards');
  if (!cards) return;
  const localStats = {
    departments: departments.length,
    facilities: resources.filter((resource) => resource.type === 'Facility').length,
    equipment: resources.filter((resource) => resource.type === 'Equipment').length,
    experts: expertise.length,
    pendingRequests: getRequests().filter((request) => request.status === 'Pending').length
  };
  const currentUser = getCurrentUser();
  if (currentUser) {
    document.getElementById('dashboard-subtitle').textContent = `Welcome back, ${currentUser.name || currentUser.email || 'researcher'}.`;
  }
  renderDashboardStats(localStats);
  apiFetch('/dashboard/stats').then(renderDashboardStats).catch(() => {});
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

    try {
      let labs = [];

      /*
       * IT laboratory data is maintained locally in data.js.
       * Other departments continue using the PostgreSQL API.
       */
      const selectedDepartment = normalizeDepartment(department.value);
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

document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
  initializeLogoFallback();
  initializeSessionActions();
  initializeLogin();
  initializeDashboard();
  initializeStorage();
  initializeHomeDepartment();
  initializeResourceSearch();
  initializeDirectoryFilters('facility');
  initializeDepartments();
});