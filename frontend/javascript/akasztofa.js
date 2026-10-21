let indult = false;

document.getElementById('ujJatek').addEventListener('click', function () {
    fetch('/api/ujjatek', {
        method: 'POST'
    })
        .then((response) => response.json())
        .then((adat) => {
            document.getElementById('szo').textContent = adat.szo;
            document.getElementById('hibak').textContent = 'Hibák: 0 / 6';
            document.getElementById('uzenet').textContent = adat.uzenet;
            indult = true;
        });
});

document.getElementById('tipp').addEventListener('click', function () {
    let betu = document.getElementById('betu').value.toLowerCase();

    if (!indult) {
        document.getElementById('uzenet').textContent = 'Előbb indíts új játékot!';
        return;
    }

    if (betu.length !== 1) {
        document.getElementById('uzenet').textContent = 'Egy betűt írj be!';
        return;
    }

    fetch('/api/tipp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ betu: betu })
    })
        .then((response) => response.json())
        .then((adat) => {
            if (adat.szo) {
                document.getElementById('szo').textContent = adat.szo;
            }

            document.getElementById('hibak').textContent = 'Hibák: ' + (adat.hibak || 0) + ' / 6';
            document.getElementById('uzenet').textContent = adat.uzenet;

            if (adat.vege) {
                indult = false;
            }

            document.getElementById('betu').value = '';
        });
});
