# Akasztófa – Node.js projektfeladat

Készítette: Marcell Rafi

Ez a projekt a megadott NodeJS template-re épül. A meglévő mappaszerkezetet, a Bootstrap fájlokat, az Express szervert és az API routert használja.

## Indítás

1. Nyisd meg a `backend` mappát a terminálban:

   ```bash
   cd backend
   ```

2. Telepítsd a függőségeket (első indításkor):

   ```bash
   npm install
   ```

3. Indítsd el fejlesztői módban:

   ```bash
   npm run dev
   ```

4. Böngészőben: http://127.0.0.1:3000

## Megvalósított követelmények

- **Főoldal:** menüből elérhető a játék és a szókezelő.
- **Játékoldal:** akasztófa, betűtippek, 6 hibalehetőség, győzelem/vereség kezelése.
- **Szókezelő:** új szavak hozzáadása és törlése; a backend ellenőrzi, hogy a szó érvényes-e és szerepel-e már a listában.
- **Bootstrap:** reszponzív felület a template `frontend/bootstrap` mappájában található Bootstrap fájlokkal.
- **Backend:** a `backend/api/api.js` fájlban top-level `szavak` tömb tárolja a szavakat.
- **Titkos szó:** a kisorsolt szó a backend oldali sessionben marad; játék közben a frontend csak a kitakart szóalakot kapja meg.
- **Betűtipp-végpont:** a szerver ellenőrzi a tippeket, számolja a hibákat és megállapítja a játék végét.

## API végpontok

| Metódus | Végpont | Funkció |
|---|---|---|
| GET | `/api/szavak` | Szavak listázása |
| POST | `/api/szavak` | Szó hozzáadása, JSON: `{"szo":"alma"}` |
| DELETE | `/api/szavak/:szo` | Szó törlése |
| POST | `/api/jatek/uj` | Új játék és szó sorsolása |
| POST | `/api/jatek/tipp` | Betűtipp, JSON: `{"betu":"a"}` |
| GET | `/api/jatek` | Aktuális játékállapot |

A szólista memóriában van, ezért a szerver újraindításakor visszaáll az alapértelmezett listára. Ez megfelel a feladat tömbös tárolásra vonatkozó leírásának.
