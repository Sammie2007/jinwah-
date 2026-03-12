/* --- ARCHIVE DATA --- */
const chapters = ["The Awakening Void", "Eyes of the Ossuary", "Disciples of Burning Light", "The Empress Sends Word", "The Third Path"];

/* --- UI COMPONENTS --- */
const side = document.getElementById('side');
const ov = document.getElementById('ov');
const hub = document.getElementById('main-ui');
const read = document.getElementById('reader');

/* --- NAVIGATION --- */
function nav() {
    side.classList.toggle('active');
    ov.classList.toggle('active');
}

/* --- THEME SYSTEM --- */
function th() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('jinwah-theme', next);
}

// Persist Theme
document.documentElement.setAttribute('data-theme', localStorage.getItem('jinwah-theme') || 'dark');

/* --- READER SYSTEM --- */
function openRead(n, t) {
    hub.style.display = 'none';
    read.style.display = 'block';
    document.getElementById('rt').innerText = t;
    const body = document.getElementById('rb');
    body.innerHTML = "<p class='mono'>INITIATING_VOID_ACCESS...</p>";
    
    fetch(`Chapter ${n}.txt`)
        .then(res => res.ok ? res.text() : "ACCESS_DENIED: DATA_NOT_FOUND")
        .then(txt => {
            body.innerHTML = txt.split('\n').map(p => `<p>${p}</p>`).join('');
        })
        .catch(() => body.innerText = "LINK_FAILURE");
    window.scrollTo(0,0);
}

function back() {
    read.style.display = 'none';
    hub.style.display = 'block';
    window.scrollTo(0,0);
}

/* --- INTERFACE BUILDER --- */
function build() {
    const list = document.getElementById('main-list');
    const sideList = document.getElementById('side-chaps');
    
    chapters.forEach((t, i) => {
        const n = i + 1;
        // Main Cards
        const card = document.createElement('div');
        card.className = 'card-premium';
        card.style.cursor = 'pointer';
        card.innerHTML = `<div class="card-body"><span class="mono">CH_${n}</span><h3>${t}</h3><p>Consult the chronicle of the Voidheart.</p></div>`;
        card.onclick = () => openRead(n, t);
        list.appendChild(card);
        
        // Side Links
        const item = document.createElement('div');
        item.className = 'side-group';
        item.innerHTML = `<div style="padding:10px 0; border-bottom:1px solid var(--br); cursor:pointer;">${n}. ${t}</div>`;
        item.onclick = () => { openRead(n, t); nav(); };
        sideList.appendChild(item);
    });
}

build();
