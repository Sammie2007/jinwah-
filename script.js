/* --- CHAPTER DATA ARCHIVE --- */
const chapters = [
    "The Awakening Void", "Eyes of the Ossuary", "Disciples of Burning Light", 
    "The Empress Sends Word", "The Third Path", "Elara", 
    "What the Void Remembers", "Refusal", "The Faith That Breaks", "Convergence"
];

/* --- UI ELEMENTS --- */
const mainUI = document.getElementById('main-ui');
const readerUI = document.getElementById('reader-ui');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const sidebarChapterList = document.getElementById('sidebar-chapter-list');
const mainChapterList = document.getElementById('chapter-list');

/* --- INITIALIZATION --- */
function init() {
    // Set Theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    renderMainArchive();
    renderSidebarArchive();
    
    console.log("Sammie & Sultan Enterprise Engine: Active");
}

/* --- SIDEBAR ENGINE --- */
function toggleSidebar() {
    const isActive = sidebar.classList.contains('active');
    if (!isActive) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    } else {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
}

document.getElementById('menu-toggle').onclick = toggleSidebar;
document.getElementById('sidebar-close').onclick = toggleSidebar;
overlay.onclick = toggleSidebar;

/* --- ARCHIVE RENDERERS --- */
function renderMainArchive() {
    mainChapterList.innerHTML = '';
    chapters.forEach((title, index) => {
        const num = index + 1;
        const card = document.createElement('div');
        card.className = 'book-card-premium';
        card.style.cursor = 'pointer';
        card.innerHTML = `
            <div class="book-details">
                <span class="book-genre">Chapter ${num}</span>
                <h3>${title}</h3>
                <p>Continue the journey of Jinwah across the Third Path.</p>
                <button class="btn-small">BEGIN READING</button>
            </div>
        `;
        card.onclick = () => openChapter(num, title);
        mainChapterList.appendChild(card);
    });
}

function renderSidebarArchive() {
    sidebarChapterList.innerHTML = '';
    chapters.forEach((title, index) => {
        const num = index + 1;
        const item = document.createElement('div');
        item.className = 'side-chapter';
        item.innerText = `${num}. ${title}`;
        item.onclick = () => {
            openChapter(num, title);
            toggleSidebar();
        };
        sidebarChapterList.appendChild(item);
    });
}

/* --- READING ENGINE --- */
async function openChapter(num, title) {
    mainUI.style.display = 'none';
    readerUI.style.display = 'block';
    
    // UI Updates
    document.getElementById('reader-title').innerText = title;
    document.getElementById('reading-status').innerText = `NOW READING: CHAPTER ${num}`;
    window.scrollTo(0, 0);

    const body = document.getElementById('content-body');
    body.innerHTML = `<div class="loader">Consulting the Void...</div>`;

    // Fetch Logic for Multiple Naming Conventions
    const possiblePaths = [`Chapter ${num}.txt`, `Chapter ${num} .txt`, `chapter${num}.txt`];
    let found = false;

    for (let path of possiblePaths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                const text = await response.text();
                body.innerHTML = text.split('\n').map(p => `<p>${p}</p>`).join('');
                found = true;
                break;
            }
        } catch (err) {
            console.error(`Path ${path} not found.`);
        }
    }

    if (!found) {
        body.innerHTML = `<p class="error">The Void remains silent. This chapter has not yet been archived in the portal.</p>`;
    }
}

function closeReader() {
    readerUI.style.display = 'none';
    mainUI.style.display = 'block';
    window.scrollTo(0, 0);
}

document.getElementById('back-btn').onclick = closeReader;

/* --- THEME TOGGLE ENGINE --- */
document.getElementById('theme-btn').onclick = () => {
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('theme', target);
};

/* --- ENTERPRISE LINK HANDLING --- */
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        const href = link.getAttribute('href');
        if (href.startsWith('#') && readerUI.style.display === 'block') {
            closeReader();
        }
    });
});

// Boot System
init();
