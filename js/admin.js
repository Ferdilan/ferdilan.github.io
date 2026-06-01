import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { ref, push, set, remove, onValue, update } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// -- UI Elements --
const authContainer = document.getElementById('auth-container');
const dbContainer = document.getElementById('dashboard-container');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');

// -- Authentication --
onAuthStateChanged(auth, (user) => {
    if (user) {
        authContainer.style.display = 'none';
        dbContainer.style.display = 'flex';
        initDashboard();
    } else {
        authContainer.style.display = 'flex';
        dbContainer.style.display = 'none';
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const pwd = document.getElementById('password').value;
    const errEl = document.getElementById('auth-error');
    const btn = loginForm.querySelector('button');
    btn.innerText = 'Logging in...';
    btn.disabled = true;
    try {
        await signInWithEmailAndPassword(auth, email, pwd);
    } catch (error) {
        errEl.innerText = "Login gagal: " + error.message;
        errEl.style.display = "block";
        btn.innerText = 'Login';
        btn.disabled = false;
    }
});

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => signOut(auth));
}

// -- Dashboard Navigation --
const navNames = ['projects', 'skills', 'blog'];
navNames.forEach(nav => {
    const el = document.getElementById(`nav-${nav}`);
    if (!el) return;
    el.addEventListener('click', () => {
        navNames.forEach(n => {
            document.getElementById(`nav-${n}`).classList.remove('active');
            document.getElementById(`section-${n}`).classList.remove('active');
        });
        el.classList.add('active');
        document.getElementById(`section-${nav}`).classList.add('active');
        document.getElementById('page-title').innerText = `Manage ${nav.charAt(0).toUpperCase() + nav.slice(1)}`;
    });
});

// -- Modal Logic --
const modal = document.getElementById('edit-modal');
const modalTitle = document.getElementById('modal-title');
const modalForm = document.getElementById('modal-form');
const modalFieldsContainer = document.getElementById('modal-fields');
const closeModalBtn = document.getElementById('close-modal');

let currentEditCollection = null;
let currentEditId = null;

closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

function closeModal() {
    modal.style.display = 'none';
    currentEditCollection = null;
    currentEditId = null;
    modalForm.reset();
}

function openEditModal(collection, id, data) {
    currentEditCollection = collection;
    currentEditId = id;
    modal.style.display = 'flex';

    const fieldConfigs = getFieldConfigs(collection);
    modalTitle.innerText = `Edit ${collection.slice(0, -1).charAt(0).toUpperCase() + collection.slice(1, -1)}`;
    modalFieldsContainer.innerHTML = fieldConfigs.map(f => {
        const val = Array.isArray(data[f.key]) ? data[f.key].join(', ') : (data[f.key] || '');
        if (f.type === 'textarea') {
            return `<div class="form-group"><label>${f.label}</label><textarea class="form-control" name="${f.key}" rows="3" ${f.required ? 'required' : ''}>${val}</textarea></div>`;
        }
        return `<div class="form-group"><label>${f.label}</label><input type="text" class="form-control" name="${f.key}" value="${val}" ${f.required ? 'required' : ''}></div>`;
    }).join('');
}

function getFieldConfigs(collection) {
    if (collection === 'projects') return [
        { key: 'title', label: 'Judul Proyek', required: true },
        { key: 'description', label: 'Deskripsi', required: true },
        { key: 'icon', label: 'Icon Boxicons (e.g. bx-broadcast)' },
        { key: 'tags', label: 'Tags (pisahkan koma)' },
    ];
    if (collection === 'skills') return [
        { key: 'title', label: 'Kategori Skill', required: true },
        { key: 'icon', label: 'Icon Boxicons (e.g. bx-code-block)' },
        { key: 'list', label: 'Daftar Skill (pisahkan koma)', required: true },
    ];
    if (collection === 'blog') return [
        { key: 'title', label: 'Judul Artikel', required: true },
        { key: 'date', label: 'Tanggal', required: true },
        { key: 'read_time', label: 'Waktu Baca (e.g. 5 min)' },
        { key: 'icon', label: 'Icon Boxicons (e.g. bx-book)' },
        { key: 'snippet', label: 'Cuplikan Teks', required: true, type: 'textarea' },
    ];
    return [];
}

modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentEditCollection || !currentEditId) return;

    const btn = modalForm.querySelector('button[type="submit"]');
    btn.innerText = 'Menyimpan...';
    btn.disabled = true;

    const formData = new FormData(modalForm);
    const data = {};
    formData.forEach((val, key) => {
        // Fields that should be arrays
        if (key === 'tags' || key === 'list') {
            data[key] = val.split(',').map(s => s.trim()).filter(s => s);
        } else {
            data[key] = val;
        }
    });

    try {
        await update(ref(db, `${currentEditCollection}/${currentEditId}`), data);
        closeModal();
        showToast('Data berhasil diperbarui!');
    } catch (err) {
        alert('Gagal memperbarui data: ' + err.message);
    } finally {
        btn.innerText = 'Simpan Perubahan';
        btn.disabled = false;
    }
});

// -- Toast Notification --
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// -- CRUD Logic --
function initDashboard() {
    setupSection('projects', 'form-project', 'table-projects', () => ({
        title: document.getElementById('proj-title').value,
        description: document.getElementById('proj-desc').value,
        icon: document.getElementById('proj-icon').value,
        tags: document.getElementById('proj-tags').value.split(',').map(s => s.trim()).filter(s => s)
    }));

    setupSection('skills', 'form-skill', 'table-skills', () => ({
        title: document.getElementById('skill-title').value,
        icon: document.getElementById('skill-icon').value,
        list: document.getElementById('skill-list').value.split(',').map(s => s.trim()).filter(s => s)
    }));

    setupSection('blog', 'form-blog', 'table-blog', () => ({
        title: document.getElementById('blog-title').value,
        date: document.getElementById('blog-date').value,
        read_time: document.getElementById('blog-time').value,
        icon: document.getElementById('blog-icon').value,
        snippet: document.getElementById('blog-snippet').value
    }));
}

function setupSection(colName, formId, tableId, getDataMap) {
    const form = document.getElementById(formId);
    if (!form) return;

    // CREATE
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = 'Menyimpan...';
        btn.disabled = true;
        const data = getDataMap();
        try {
            const newRef = push(ref(db, colName));
            await set(newRef, data);
            form.reset();
            showToast(`${colName} berhasil ditambahkan!`);
        } catch (err) {
            alert(`Gagal menambahkan ${colName}: ` + err.message);
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });

    // READ + DELETE + EDIT (realtime)
    onValue(ref(db, colName), (snapshot) => {
        const tbody = document.getElementById(tableId);
        if (!tbody) return;
        tbody.innerHTML = '';

        if (!snapshot.exists()) {
            tbody.innerHTML = `<tr><td colspan="2" style="text-align:center; color:#94a3b8; padding:1.5rem;">Belum ada data.</td></tr>`;
            return;
        }

        snapshot.forEach(childSnap => {
            const data = childSnap.val();
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <strong>${data.title}</strong>
                    ${data.description ? `<br><small style="color:#94a3b8">${data.description.substring(0, 60)}...</small>` : ''}
                </td>
                <td class="action-btns">
                    <button class="btn-edit" data-id="${childSnap.key}" data-col="${colName}">
                        <i class='bx bx-edit'></i> Edit
                    </button>
                    <button class="btn-danger" data-id="${childSnap.key}" data-col="${colName}">
                        <i class='bx bx-trash'></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(tr);

            // Store full data on the row for edit
            tr.querySelector('.btn-edit').addEventListener('click', () => {
                openEditModal(colName, childSnap.key, data);
            });

            tr.querySelector('.btn-danger').addEventListener('click', async (e) => {
                if (confirm(`Hapus "${data.title}"? Tindakan ini tidak bisa dibatalkan.`)) {
                    await remove(ref(db, `${colName}/${childSnap.key}`));
                    showToast('Data berhasil dihapus.', 'error');
                }
            });
        });
    });
}
