const express = require('express');
const router = express.Router();

let szavak = ['alma', 'kutya', 'iskola', 'programozas', 'monitor'];
let titkosSzo = '';
let joTippek = [];
let rosszTippek = [];

router.get('/szavak', (request, response) => {
    response.json({ szavak: szavak });
});

router.post('/szavak', (request, response) => {
    let szo = request.body.szo.toLowerCase().trim();

    if (szo === '') {
        return response.status(400).json({ uzenet: 'Írj be egy szót!' });
    }

    if (szavak.includes(szo)) {
        return response.status(400).json({ uzenet: 'Ez a szó már szerepel!' });
    }

    szavak.push(szo);
    response.json({ uzenet: 'A szó hozzáadva!', szavak: szavak });
});

router.delete('/szavak/:szo', (request, response) => {
    let szo = request.params.szo;
    let index = szavak.indexOf(szo);

    if (index === -1) {
        return response.status(404).json({ uzenet: 'Nincs ilyen szó!' });
    }

    szavak.splice(index, 1);
    response.json({ uzenet: 'A szó törölve!', szavak: szavak });
});

router.post('/ujjatek', (request, response) => {
    if (szavak.length === 0) {
        return response.status(400).json({ uzenet: 'Nincs szó a listában!' });
    }

    let veletlen = Math.floor(Math.random() * szavak.length);
    titkosSzo = szavak[veletlen];
    joTippek = [];
    rosszTippek = [];

    response.json({
        szo: '_ '.repeat(titkosSzo.length).trim(),
        hibak: 0,
        uzenet: 'Kezdődhet a játék!'
    });
});

router.post('/tipp', (request, response) => {
    let betu = request.body.betu.toLowerCase();

    if (titkosSzo === '') {
        return response.status(400).json({ uzenet: 'Indíts új játékot!' });
    }

    if (joTippek.includes(betu) || rosszTippek.includes(betu)) {
        return response.json({ uzenet: 'Ezt már megtippelted!' });
    }

    if (titkosSzo.includes(betu)) {
        joTippek.push(betu);
    } else {
        rosszTippek.push(betu);
    }

    let megjelenitett = '';

    for (let i = 0; i < titkosSzo.length; i++) {
        if (joTippek.includes(titkosSzo[i])) {
            megjelenitett += titkosSzo[i] + ' ';
        } else {
            megjelenitett += '_ ';
        }
    }

    let nyert = !megjelenitett.includes('_');
    let vesztett = rosszTippek.length >= 6;

    response.json({
        szo: megjelenitett.trim(),
        hibak: rosszTippek.length,
        uzenet: nyert
            ? 'Nyertél!'
            : vesztett
              ? 'Vesztettél! A szó: ' + titkosSzo
              : 'Próbálkozz tovább!',
        vege: nyert || vesztett
    });
});

module.exports = router;
