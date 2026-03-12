/* --- NOVEL ARCHIVE --- */
const chapters = ["The Awakening Void", "Eyes of the Ossuary", "Disciples of Burning Light", "The Empress Sends Word", "The Third Path"];

/* --- NAVIGATION CORE --- */
function toggleNav() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}

/* --- THEME ENGINE --- */
const themeToggle = document.getElementById('theme-toggle');
themeToggle.onclick = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('enterprise-theme', newTheme);
};

// Persistence
const savedTheme = localStorage.getItem('enterprise-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

/* --- READER SYSTEM --- */
function openNovel(num, title) {
    document.getElementById('hub').style.display = 'none';
    const reader = document.getElementById('reader');
    reader.style.display = 'block';
    
    document.getElementById('rt').innerText = title;
    const body = document.getElementById('rb');
    body.innerHTML = "<p class='mono-label'>CONSULTING THE VOID ARCHIVE...</p>";
    
    fetch(`Chapter ${num}.txt`)
        .then(res => res.ok ? res.text() : "The Void remains silent (File not found).")
        .then(text => {
            body.innerHTML = text.split('\n').map(p => `<p>${p}</p>`).join('');
        })
        .catch(() => body.innerText = "Connection lost to archive.");
        
    window.scrollTo(0,0);
}

function exitReader() {
    document.getElementById('reader').style.display = 'none';
    document.getElementById('hub').style.display = 'block';
    window.scrollTo(0,0);
}

/* --- BUILD INTERFACE --- */
function build() {
    const mainList = document.getElementById('main-archive');
    const sideList = document.getElementById('side-chapters');
    
    chapters.forEach((t, i) => {
        const n = i + 1;
        // Chapter Cards
        const card = document.createElement('div');
        card.className = 'book-card';
        card.style.cursor = 'pointer';
        card.innerHTML = `<div class="book-body"><h3>Chapter ${n}</h3><p>${t}</p><button class="btn-main">READ</button></div>`;
        card.onclick = () => openNovel(n, t);
        mainList.appendChild(card);
        
        // Sidebar Links
        const link = document.createElement('div');
        link.className = 'side-link';
        link.style.padding = "10px 0";
        link.style.borderBottom = "1px solid var(--br)";
        link.style.cursor = "pointer";
        link.innerText = `${n}. ${t}`;
        link.onclick = () => { openNovel(n, t); toggleNav(); };
        sideList.appendChild(link);
    });
}

build();
