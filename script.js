/* --- CHAPTERS --- */
const chapters = ["The Awakening Void", "Eyes of the Ossuary", "Disciples of Burning Light", "The Empress Sends Word", "The Third Path"];

const mainUI = document.getElementById('main-ui');
const readerUI = document.getElementById('reader-ui');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

/* --- SIDEBAR ENGINE --- */
function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

document.getElementById('menu-toggle').onclick = toggleSidebar;
document.getElementById('sidebar-close').onclick = toggleSidebar;
overlay.onclick = toggleSidebar;

/* --- ARCHIVE RENDERER --- */
function renderArchive() {
    const mainList = document.getElementById('chapter-list');
    const sideList = document.getElementById('sidebar-chapter-list');
    
    chapters.forEach((t, i) => {
        const num = i + 1;
        // Main Cards
        const card = document.createElement('div');
        card.className = 'book-card-premium';
        card.innerHTML = `<div class="book-details"><h3>Chapter ${num}</h3><p>${t}</p><button class="btn-small">READ</button></div>`;
        card.onclick = () => openChapter(num, t);
        mainList.appendChild(card);
        
        // Sidebar List
        const item = document.createElement('div');
        item.className = 'side-chapter';
        item.style.padding = "12px 0";
        item.style.borderBottom = "1px solid rgba(255,255,255,0.05)";
        item.innerText = `${num}. ${t}`;
        item.onclick = () => { openChapter(num, t); toggleSidebar(); };
        sideList.appendChild(item);
    });
}

async function openChapter(num, title) {
    mainUI.style.display = 'none';
    readerUI.style.display = 'block';
    document.getElementById('reader-title').innerText = title;
    document.getElementById('reading-status').innerText = `CHAPTER ${num}`;
    window.scrollTo(0,0);
    
    const body = document.getElementById('content-body');
    body.innerText = "Accessing the Void Archive...";
    
    // Fetch from repository
    try {
        const res = await fetch(`Chapter ${num}.txt`);
        if (res.ok) body.innerText = await res.text();
        else body.innerText = "This chapter is currently shielded by the Void (File not found).";
    } catch (e) {
        body.innerText = "Archive Connection Error.";
    }
}

document.getElementById('back-btn').onclick = () => {
    readerUI.style.display = 'none';
    mainUI.style.display = 'block';
};

/* --- THEME TOGGLE --- */
document.getElementById('theme-btn').onclick = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
};

renderArchive();
