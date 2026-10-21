function szavakBetoltese() {
    fetch('/api/szavak')
        .then((response) => response.json())
        .then((adat) => {
            let lista = document.getElementById('szavak');
            lista.innerHTML = '';

            adat.szavak.forEach(function (szo) {
                let elem = document.createElement('li');
                elem.className =
                    'list-group-item d-flex justify-content-between align-items-center';
                elem.textContent = szo;

                let gomb = document.createElement('button');
                gomb.textContent = 'Törlés';
                gomb.className = 'btn btn-danger btn-sm';

                gomb.addEventListener('click', function () {
                    fetch('/api/szavak/' + encodeURIComponent(szo), {
                        method: 'DELETE'
                    })
                        .then((response) => response.json())
                        .then((adat) => {
                            document.getElementById('uzenet').textContent = adat.uzenet;
                            szavakBetoltese();
                        });
                });

                elem.appendChild(gomb);
                lista.appendChild(elem);
            });
        });
}

document.getElementById('hozzaad').addEventListener('click', function () {
    let szo = document.getElementById('ujSzo').value;

    fetch('/api/szavak', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ szo: szo })
    })
        .then((response) => response.json())
        .then((adat) => {
            document.getElementById('uzenet').textContent = adat.uzenet;
            document.getElementById('ujSzo').value = '';
            szavakBetoltese();
        });
});

szavakBetoltese();
