const express = require('express');
const path = require('path');

const app = express();
const router = express.Router();

app.use(express.json());

router.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/index.html'));
});

router.get('/akasztofa', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/akasztofa.html'));
});

router.get('/szokezelo', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/szokezelo.html'));
});

app.use('/', router);
app.use('/api', require('./api/api.js'));
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(3000, '127.0.0.1', () => {
    console.log('Szerver: http://127.0.0.1:3000');
});
