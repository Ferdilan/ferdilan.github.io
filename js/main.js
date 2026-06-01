// js/main.js
import { db } from './firebase.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

async function fetchAndRender(collectionName, containerId, renderCallback) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    try {
        const dbRef = ref(db, collectionName);
        const snapshot = await get(dbRef);
        
        if (!snapshot.exists()) {
            container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: var(--text-secondary);">No data in Realtime Database. You must add data via Admin Panel.</p>`;
            return;
        }

        let html = '';
        snapshot.forEach((childSnapshot) => {
            html += renderCallback(childSnapshot.key, childSnapshot.val());
        });
        container.innerHTML = html;
    } catch (err) {
        console.error(`Error loading ${collectionName}:`, err);
        // Error handling fallback is already handled or we can show a placeholder.
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Projects
    fetchAndRender("projects", "dynamic-projects", (id, data) => {
        const tagsHtml = (data.tags || []).map(tag => `<span class="tag">${tag.trim()}</span>`).join('');
        return `
            <div class="project-card glass-panel" id="project-${id}">
                <div class="project-image">
                    <i class='bx ${data.icon || 'bx-layer'}'></i>
                </div>
                <div class="project-content">
                    <h3>${data.title}</h3>
                    <p>${data.description}</p>
                    <div class="tags">${tagsHtml}</div>
                </div>
            </div>`;
    });

    // 2. Load Skills
    fetchAndRender("skills", "dynamic-skills", (id, data) => {
        const skillsList = (data.list || []).map(skill => `<li>${skill.trim()}</li>`).join('');
        return `
            <div class="skill-card glass-panel fade-in" id="skill-${id}">
                <div class="skill-icon"><i class='bx ${data.icon || 'bx-star'}'></i></div>
                <h3>${data.title}</h3>
                <ul>${skillsList}</ul>
            </div>`;
    });

    // 3. Load Blog
    fetchAndRender("blog", "dynamic-blog", (id, data) => {
        return `
            <div class="blog-card glass-panel" id="blog-${id}">
                <div class="blog-image">
                    <i class='bx ${data.icon || 'bx-book-open'}'></i>
                </div>
                <div class="blog-content">
                    <h3>${data.title}</h3>
                    <span class="blog-meta">${data.date || 'TBD'} &bull; ${data.read_time || '5 min'} read</span>
                    <p>${data.snippet}</p>
                    <a href="#" class="read-more">Read Article <i class='bx bx-right-arrow-alt'></i></a>
                </div>
            </div>`;
    });
});
