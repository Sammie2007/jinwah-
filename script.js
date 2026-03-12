/* --- CHAPTER DATA (FULL 10) --- */
const chapters = [
    "The Awakening Void", 
    "Eyes of the Ossuary", 
    "Disciples of Burning Light", 
    "The Empress Sends Word", 
    "The Third Path", 
    "Elara", 
    "What the Void Remembers", 
    "Refusal", 
    "The Faith That Breaks", 
    "Convergence"
];

/* --- UI COMPONENTS --- */
const side = document.getElementById('side');
const ov = document.getElementById('ov');
const hub = document.getElementById('main-ui');
const read = document.getElementById('reader');

/* --- NAVIGATION LOGIC --- */
function nav() {
    side.classList.toggle('active');
    ov.classList.toggle('active');
}

/* --- THEME ENGINE --- */
function th() {
    const doc = document.documentElement;
    const isDark = doc.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    
    doc.setAttribute('data-theme', next);
    localStorage.setItem('jinwah-theme-last', next);
}

// Persist Theme on Load
document.documentElement.setAttribute('data-theme', localStorage.getItem('jinwah-theme-last') || 'dark');

/* --- READER ENGINE --- */
async function openRead(n, t) {
    hub.style.display = 'none';
    read.style.display = 'block';
    
    document.getElementById('rt').innerText = t;
    const body = document.getElementById('rb');
    body.innerHTML = "<p class='tech-tag'>INITIATING_VOID_ACCESS...</p>";
    window.scrollTo(0,0);
    
    // Fetch chapter file with safety checks
    try {
        const res = await fetch(`Chapter ${n}.txt`);
        if (res.ok) {
            const text = await res.text();
            body.innerHTML = text.split('\n').map(p => `<p>${p}</p>`).join('');
        } else {
            body.innerHTML = "<p class='tech-tag'>ACCESS_DENIED: DATA_NOT_FOUND_IN_ARCHIVE.</p>";
        }
    } catch (e) {
        body.innerHTML = "<p class='tech-tag'>LINK_FAILURE: THE_VOID_IS_OFFLINE.</p>";
    }
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
        // Main Grid Archive
        const card = document.createElement('div');
        card.className = 'card-premium';
        card.style.cursor = 'pointer';
        card.innerHTML = `<div class="card-body"><span class="tech-tag">CH_${n}</span><h3>${t}</h3><p>Consult the record of the Voidheart Saga.</p></div>`;
        card.onclick = () => openRead(n, t);
        list.appendChild(card);
        
        // Side List Archive
        const item = document.createElement('div');
        item.style.cssText = "padding:12px 0; border-bottom:1px solid var(--br); cursor:pointer;";
        item.innerText = `${n}. ${t}`;
        item.onclick = () => { openRead(n, t); nav(); };
        sideList.appendChild(item);
    });
}

// System Launch
build();
