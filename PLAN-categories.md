# Umsetzungsplan: Categories erstellen & bearbeiten

Basierend auf `Aufgabe.txt`. Ziel: Seiten und Funktionalität zum **Anlegen** und **Bearbeiten**
von Categories, inklusive Model-, Controller-, Routen- und View-Anteilen — im bestehenden
MVC-Muster der App (analog zu Organizations/Projects).

## Grundsätze
- Jeder Schritt liefert ein **überprüfbares Ergebnis** und wird **einzeln nacheinander** bearbeitet.
- MVC strikt einhalten: DB-Code nur in `src/models/`, keine DB-Zugriffe im Controller,
  Routen nur in `src/routes.js` (nicht in `server.js`).
- Namenskonvention: **camelCase** in JS/EJS, `snake_case` nur für echte SQL-Spalten
  (per `AS "camelCase"` aliasiert) — siehe bestehendes Muster in `src/models/categories.js`.

## Routen-Entscheidung
Die Aufgabe nennt beispielhaft `/new-category` und `/edit-category/:id`. Die bestehende App
verwendet jedoch durchgängig ein anderes, ressourcenorientiertes Muster
(`/organization/new`, `/organization/:id/edit`, `/project/new`, `/project/:id/edit`,
`/category/:id`). Zur **Konsistenz mit dem bestehenden Code** werden die Category-Routen an
dieses Muster angeglichen:
- `GET  /category/new`        → Formular anzeigen
- `POST /category/new`        → Formular verarbeiten
- `GET  /category/:id/edit`   → Formular anzeigen (vorbefüllt)
- `POST /category/:id/edit`   → Formular verarbeiten

So bleiben alle Ressourcen (organization/project/category) einheitlich adressiert.

## Validierungsregeln
- **Client-seitig** (im View): `required` + `maxlength="100"`.
  Bewusst **keine** Mindestlänge clientseitig, damit die Server-Validierung testbar bleibt.
- **Server-seitig** (`express-validator`): vorhanden, `min: 3`, `max: 100`.

---

## Vorgehen: outside-in
Gebaut wird von der Einstiegsstelle nach innen: **Link → Route + Controller-Stub → View →
Verarbeitung → Model → Server-Validierung**. So ist nach jedem Schritt etwas im laufenden
Browser sichtbar oder klickbar; das Model wird erst hinzugefügt, wenn bereits ein Pfad dorthin
existiert und sein Ergebnis auf einer Seite überprüft werden kann. Erst Create komplett
(Schritte 1–6), dann Edit komplett (Schritte 7–12).

## Schritte

### Schritt 0 — Referenz-Requirement verifizieren (Organizations & Projects)
Die Aufgabe verlangt, dass Create/Edit für Organizations und Service Projects samt
Validierung funktionieren. Laut Git-History bereits umgesetzt — nur prüfen, nicht neu bauen.
- **Tun:** App starten, Flows durchklicken: Organization anlegen/bearbeiten,
  Project anlegen/bearbeiten; jeweils Client- und Server-Validierung testen.
- **Überprüfbar:** Alle vier Flows funktionieren; Validierungsfehler erscheinen als Flash-Meldungen.

---

## Feature A — Create Category (outside-in)

### Schritt 1 — Link „Add New Category" anlegen
- **Datei:** `src/views/categories.ejs`
- **Tun:** Link `Add New Category` mit `href="/category/new"` auf der Listenseite ergänzen.
- **Überprüfbar:** Link ist auf `/categories` sichtbar. (Klick führt vorerst zu 404 — erwartet,
  wird im nächsten Schritt behoben.)

### Schritt 2 — Route + Controller-Stub `showNewCategoryForm`
- **Dateien:** `src/routes.js`, `src/controllers/categories.js`
- **Tun:** `showNewCategoryForm` als Stub anlegen (vorerst `res.send('New Category Form')`),
  exportieren/importieren; Route `router.get('/category/new', showNewCategoryForm);`.
  **Wichtig:** Route **vor** `/category/:id` registrieren, sonst matcht `:id` das Wort „new".
- **Überprüfbar:** Klick auf den Link aus Schritt 1 liefert eine Antwort (kein 404 mehr);
  `/category/new` wird nicht als Detailseite behandelt.

### Schritt 3 — View `categoryNew.ejs` (mit Client-Validierung)
- **Dateien:** `src/views/categoryNew.ejs` (analog `organizationNew.ejs`), `src/controllers/categories.js`
- **Tun:** View mit Formular `action="/category/new" method="POST"`, Feld `name`
  (`required`, `maxlength="100"`), Submit-Button, Header/Footer-Partials. Controller-Stub auf
  `res.render('categoryNew', { title: 'Add New Category' })` umstellen.
- **Überprüfbar:** `/category/new` zeigt das Formular; leeres Absenden wird clientseitig blockiert;
  mehr als 100 Zeichen sind nicht eingebbar.

### Schritt 4 — POST-Route + Controller-Stub `processNewCategoryForm`
- **Dateien:** `src/routes.js`, `src/controllers/categories.js`
- **Tun:** `processNewCategoryForm` als Stub: `req.body.name` lesen, Erfolg-Flash
  (z. B. `Empfangen: <name>`), Redirect zurück auf `/category/new`. Route
  `router.post('/category/new', processNewCategoryForm);` (Validierung folgt in Schritt 6).
- **Überprüfbar:** Formular-Absenden erreicht den Controller — die Flash-Meldung mit dem
  eingegebenen Namen erscheint (noch kein DB-Schreibvorgang).

### Schritt 5 — Server-Validierung `categoryValidation` (Create)
- **Dateien:** `src/controllers/categories.js`, `src/routes.js`
- **Tun:** `categoryValidation`-Array (analog `organizationValidation`):
  `body('name').trim().notEmpty()...isLength({ min: 3, max: 100 })` mit Messages; Import von
  `body, validationResult`. Im Controller-Stub `validationResult` prüfen → bei Fehlern Flash +
  zurück auf `/category/new`, sonst weiter zum bestehenden Stub-Verhalten (Flash „Empfangen").
  Middleware in POST-Route einhängen:
  `router.post('/category/new', categoryValidation, processNewCategoryForm);`.
- **Überprüfbar:** Name mit 2 Zeichen wird **serverseitig** abgelehnt (Flash „mind. 3 Zeichen",
  zurück zum Formular); gültiger Name passiert die Validierung und erreicht den Stub (Flash
  „Empfangen") — alles ohne Model.

### Schritt 6 — Model `createCategory` + Controller verdrahten
- **Dateien:** `src/models/categories.js`, `src/controllers/categories.js`
- **Tun:** Model-Funktion `createCategory(name)` mit
  `INSERT INTO categories (name) VALUES ($1) RETURNING category_id AS "categoryId"` (SQL-Logging
  analog `createOrganization`), exportieren. Im Controller das Stub-Verhalten ersetzen:
  `createCategory(name)` aufrufen, Erfolg-Flash, Redirect auf `/category/:id`.
- **Überprüfbar:** Gültiger Name legt eine Category an, landet auf deren Detailseite und
  erscheint in der Liste `/categories`.

---

## Feature B — Edit Category (outside-in)

### Schritt 7 — Link „Edit" auf der Detailseite
- **Datei:** `src/views/category.ejs`
- **Tun:** Link `Edit` mit `href="/category/<%= category.categoryId %>/edit"` ergänzen.
- **Überprüfbar:** Link ist auf `/category/:id` sichtbar. (Klick führt vorerst zu 404 — erwartet.)

### Schritt 8 — Route + Controller `showEditCategoryForm` (Stub, mit Datenladung)
- **Dateien:** `src/routes.js`, `src/controllers/categories.js`
- **Tun:** `showEditCategoryForm`: `getCategoryById` (existiert bereits) laden; wenn nicht
  gefunden → Flash + Redirect `/categories`. Vorerst `res.send`, das den geladenen Namen ausgibt.
  Route `router.get('/category/:id/edit', showEditCategoryForm);`.
- **Überprüfbar:** Klick auf den Edit-Link liefert eine Antwort (kein 404) und zeigt den
  bestehenden Category-Namen — belegt, dass die Datenladung funktioniert.

### Schritt 9 — View `categoryEdit.ejs` (vorbefüllt, Client-Validierung)
- **Dateien:** `src/views/categoryEdit.ejs` (analog `organizationEdit.ejs`), `src/controllers/categories.js`
- **Tun:** View mit Formular `action="/category/<%= category.categoryId %>/edit" method="POST"`,
  Feld `name` vorbefüllt `value="<%= category.name %>"` (`required`, `maxlength="100"`),
  Submit-Button. Controller auf `res.render('categoryEdit', { title, category })` umstellen.
- **Überprüfbar:** Edit-Seite zeigt das vorbefüllte Formular mit dem bestehenden Namen.

### Schritt 10 — POST-Route + Controller-Stub `processEditCategoryForm`
- **Dateien:** `src/routes.js`, `src/controllers/categories.js`
- **Tun:** `processEditCategoryForm` als Stub: `id` + `req.body.name` lesen, Flash, Redirect auf
  `/category/:id`. Route `router.post('/category/:id/edit', processEditCategoryForm);`.
- **Überprüfbar:** Formular-Absenden erreicht den Controller (Flash erscheint, richtige Redirect-URL).

### Schritt 11 — Server-Validierung `categoryValidation` (Edit)
- **Datei:** `src/routes.js` (+ Controller `validationResult`-Prüfung in `processEditCategoryForm`)
- **Tun:** Vorhandenes `categoryValidation` aus Schritt 5 wiederverwenden. Controller-Stub prüft
  `validationResult` → bei Fehlern Flash + zurück auf `/category/:id/edit`, sonst bestehendes
  Stub-Verhalten. Middleware einhängen:
  `router.post('/category/:id/edit', categoryValidation, processEditCategoryForm);`.
- **Überprüfbar:** Name mit 2 Zeichen wird serverseitig abgelehnt; gültiger Name passiert die
  Validierung und erreicht den Stub — noch ohne Model.

### Schritt 12 — Model `updateCategory` + Controller verdrahten
- **Dateien:** `src/models/categories.js`, `src/controllers/categories.js`
- **Tun:** Model-Funktion `updateCategory(categoryId, name)` mit
  `UPDATE categories SET name = $1 WHERE category_id = $2 RETURNING category_id AS "categoryId"`
  (Rückgabe `categoryId` oder `null`), exportieren. Im Controller das Stub-Verhalten ersetzen:
  `updateCategory` aufrufen, Erfolg-/Fehler-Flash, Redirect auf `/category/:id`.
- **Überprüfbar:** Änderung wird gespeichert; Detailseite zeigt den neuen Namen.

---

## Abschluss

### Schritt 13 — MVC- & Konventions-Review
- **Tun:** Prüfen: kein DB-Code im Controller, kein SQL in Views, Routen nur in `routes.js`,
  camelCase in JS/EJS, SQL-Aliasse korrekt. Ungenutzte/temporäre Stub-Reste entfernen.
- **Überprüfbar:** Review-Checkliste erfüllt; `git diff` sauber; App startet ohne Warnungen.

### Schritt 14 — Styling & Accessibility
- **Datei:** `public/css/main.css` (falls nötig)
- **Tun:** Neue Formulare nutzen das bestehende `.form-group`-Styling; Labels mit `for`,
  ausreichender Kontrast, Fokus-States.
- **Überprüfbar:** Formulare wirken konsistent zu Organization/Project; Tab-Navigation
  und Labels funktionieren.

### Schritt 15 — Deployment
- **Tun:** Änderungen committen und auf den Hosting-Server deployen (bestehender Workflow).
- **Überprüfbar:** Create- und Edit-Category funktionieren live auf dem gehosteten Server.

---

## Definition of Done (Aufgaben-Abgleich)
- [ ] `/category/new` GET rendert das Create-Formular
- [ ] `/category/new` POST verarbeitet mit Server-Validierung, legt Category an
- [ ] `/category/:id/edit` GET rendert vorbefülltes Edit-Formular
- [ ] `/category/:id/edit` POST verarbeitet mit Server-Validierung, aktualisiert Category
- [ ] Client-Validierung: `required` + `maxlength=100` (keine Mindestlänge)
- [ ] Server-Validierung: vorhanden, min 3, max 100 Zeichen
- [ ] Model-Funktionen `createCategory` / `updateCategory` in `src/models/categories.js`
- [ ] Controller ohne DB-Code; Routen nur in `src/routes.js`
- [ ] Organization- & Project-Create/Edit weiterhin funktionsfähig (verifiziert)
- [ ] Deployed & professionell/barrierefrei gestylt
