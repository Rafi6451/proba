const pages = ['home', 'game', 'words'];
const alphabet = [...'aábcdeéfghiíjklmnoóöőpqrstuúüűvwxyz'];
let gameOver = true;
let guessedLetters = new Set();

let wrongLetters = new Set();

const $ = (selector) => document.querySelector(selector);

function showPage(page) {
    $('#project-heading').style.display = page === 'home' ? '' : 'none';
    $('#home-cards').style.display = page === 'home' ? '' : 'none';
    if (!pages.includes(page)) page = 'home';

    pages.forEach((name) => {
        $(`#page-${name}`).classList.toggle('active', name === page);
        document.querySelectorAll(`[data-page="${name}"]`).forEach((button) => {
            button.classList.toggle(
                'active',
                name === page && button.classList.contains('nav-link')
            );
        });
    });

    if (page === 'words') loadWords();
    window.location.hash = page;

    const nav = $('#mainNav');
    if (nav && nav.classList.contains('show') && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(nav).hide();
    }
}

document.querySelectorAll('[data-page]').forEach((button) => {
    button.addEventListener('click', () => showPage(button.dataset.page));
});

$('#start-game').addEventListener('click', async () => {
    showPage('game');
    await startGame();
});
$('#new-game').addEventListener('click', startGame);

async function api(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });
    const data = await response.json();
    if (!response.ok) {
        const error = new Error(data.hiba || 'Ismeretlen hiba történt.');
        error.data = data;
        throw error;
    }
    return data;
}

async function startGame() {
    try {
        const state = await api('/api/jatek/uj', {
            method: 'POST',
            body: JSON.stringify({})
        });
        guessedLetters = new Set(state.joTippek || []);
        wrongLetters = new Set(state.rosszTippek || []);
        gameOver = Boolean(state.vege);
        $('#game-message').textContent = '';
        $('#game-message').className = 'game-message';
        $('#word-hint').textContent = 'Tippelj egy betűt!';
        renderGame(state);
    } catch (error) {
        $('#game-status').textContent = 'Nem indítható';
        $('#game-message').textContent = error.message;
        $('#game-message').className = 'game-message error';
    }
}

function renderGame(state) {
    $('#word-display').textContent = state.megjelenitettSzo || '— — — —';
    $('#mistakes').textContent = `${state.hibak ?? 0} / ${state.maxHiba ?? 6}`;

    document.querySelectorAll('[data-part]').forEach((part) => {
        part.classList.toggle('visible', Number(part.dataset.part) <= (state.hibak || 0));
    });

    $('#game-status').textContent = state.vege
        ? state.nyert
            ? 'Sikerült!'
            : 'Vége a játéknak'
        : 'Játék folyamatban';

    $('#keyboard').innerHTML = '';
    alphabet.forEach((letter) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'key';
        button.textContent = letter.toLocaleUpperCase('hu-HU');
        const wasGuessed = guessedLetters.has(letter) || wrongLetters.has(letter);
        button.disabled = gameOver || wasGuessed;

        if (guessedLetters.has(letter)) button.classList.add('correct');
        if (wrongLetters.has(letter)) button.classList.add('wrong');

        button.addEventListener('click', () => guessLetter(letter));
        $('#keyboard').appendChild(button);
    });

    if (state.vege) {
        gameOver = true;
        const megoldas = (state.megoldas || '').toLocaleUpperCase('hu-HU');
        $('#word-hint').textContent = `A keresett szó: ${megoldas}`;
        $('#game-message').textContent = state.nyert
            ? 'Gratulálok, kitaláltad a szót! 🎉'
            : `Most nem sikerült. A szó: ${megoldas}`;
        $('#game-message').className = `game-message ${state.nyert ? 'success' : 'error'}`;
    }
}

async function guessLetter(letter) {
    if (gameOver) return;

    try {
        const state = await api('/api/jatek/tipp', {
            method: 'POST',
            body: JSON.stringify({ betu: letter })
        });
        guessedLetters = new Set(state.joTippek || []);
        wrongLetters = new Set(state.rosszTippek || []);
        gameOver = Boolean(state.vege);
        $('#game-message').textContent = state.uzenet || '';
        $('#game-message').className = `game-message ${
            state.vege ? (state.nyert ? 'success' : 'error') : ''
        }`;
        renderGame(state);
    } catch (error) {
        $('#game-message').textContent = error.message;
        $('#game-message').className = 'game-message error';
    }
}

document.addEventListener('keydown', (event) => {
    if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        return;
    }
    const letter = event.key.toLocaleLowerCase('hu-HU');
    if (alphabet.includes(letter) && !gameOver) guessLetter(letter);
});

async function loadWords() {
    try {
        const data = await api('/api/szavak');
        renderWords(data.szavak);
    } catch (error) {
        setWordMessage(error.message, 'error');
    }
}

function renderWords(words) {
    $('#word-count').textContent = `${words.length} szó`;
    $('#word-list').innerHTML = '';
    $('#empty-words').classList.toggle('d-none', words.length !== 0);

    words.forEach((word) => {
        const item = document.createElement('li');
        item.className = 'list-group-item';

        const label = document.createElement('span');
        label.textContent = word;

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'delete-word';
        remove.textContent = '×';
        remove.setAttribute('aria-label', `${word} törlése`);
        remove.title = 'Szó törlése';
        remove.addEventListener('click', () => deleteWord(word));

        item.append(label, remove);
        $('#word-list').appendChild(item);
    });
}

function setWordMessage(message, type) {
    const element = $('#word-form-message');
    element.textContent = message;
    element.className = `form-message mb-0 mt-2 ${type}`;
}

$('#add-word-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = $('#new-word');

    try {
        const result = await api('/api/szavak', {
            method: 'POST',
            body: JSON.stringify({ szo: input.value })
        });
        renderWords(result.szavak);
        input.value = '';
        setWordMessage(result.uzenet, 'success');
    } catch (error) {
        setWordMessage(error.message, 'error');
    }
});

async function deleteWord(word) {
    if (!confirm(`Biztosan törlöd ezt a szót: „${word}”?`)) return;

    try {
        const result = await api(`/api/szavak/${encodeURIComponent(word)}`, {
            method: 'DELETE'
        });
        renderWords(result.szavak);
        setWordMessage(result.uzenet, 'success');
    } catch (error) {
        setWordMessage(error.message, 'error');
    }
}

const initialPage = window.location.hash.slice(1);
showPage(pages.includes(initialPage) ? initialPage : 'home');
