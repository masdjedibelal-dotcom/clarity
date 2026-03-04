# LOOP System / Clarity App – Setup & Cursor

## Projektstruktur (dieser Ordner)

```
mysite/   (oder loop-system/)
├── index.html          ← Landingpage (LOOP)
├── styles.css          ← Styles der Landingpage
├── clarity-app.html    ← Web App (Supabase)
├── app.js              ← optional
├── .cursorrules        ← Cursor-Kontext (empfohlen)
├── SETUP.md            ← diese Datei
└── sql/
    ├── 01_schema.sql   ← Schema in Supabase ausführen
    └── 02_seed.sql     ← Seed-Daten ausführen
```

**Cursor:** Ordner mit **File → Open Folder** öffnen. Für Änderungen an der Landingpage **Composer (Cmd+I)** nutzen, für Fragen **Chat (Cmd+L)**. Siehe `.cursorrules` für typische Prompts.

---

## 1. Supabase Projekt erstellen

1. Geh auf https://supabase.com → "New project"
2. Name: `clarity-app`, Region: Frankfurt (eu-central-1)
3. Passwort notieren → "Create new project"

---

## 2. Datenbank einrichten

Im Supabase Dashboard → **SQL Editor**:

**Schritt 1:** Inhalt von `sql/01_schema.sql` einfügen → Run
**Schritt 2:** Inhalt von `sql/02_seed.sql` einfügen → Run

---

## 3. Credentials eintragen (Key nie in Git committen)

Der **SUPABASE_KEY** darf nicht im Repository stehen. Nutze die lokale Config:

1. **config.example.js** im Projektroot als **config.local.js** kopieren.
2. In **config.local.js** den echten **Anon Key** eintragen (Supabase → Settings → API → anon public).
3. **config.local.js** steht in `.gitignore` und wird nicht committed.

Ohne config.local.js nutzen die Apps einen Platzhalter – die Datenbank-Anbindung funktioniert dann nicht.

Credentials: **Supabase → Settings → API → Project URL & anon public key**

---

## 4. Auth konfigurieren

Supabase → **Authentication → Settings**:
- Site URL: `https://deine-domain.de` (oder `http://localhost` für Tests)
- E-Mail-Bestätigung: optional deaktivieren für Tests

---

## 5. In Landingpage einbinden

In der Nav von `index.html` verlinkt der **„App starten →“** Button bereits auf `clarity-app.html`. Optional: Hero-Buttons oder weitere CTAs auf `clarity-app.html` setzen.

iFrame-Embed (falls gewünscht):

```html
<iframe src="./clarity-app.html" style="width:100%;height:100vh;border:none"></iframe>
```

---

## 6. Hosting (empfohlen: Vercel oder Netlify)

```
mysite/
├── index.html         ← Landingpage
├── clarity-app.html   ← Web App
└── sql/
    ├── 01_schema.sql
    └── 02_seed.sql
```

**Vercel:** `npx vercel` im Ordner → fertig.
**Netlify:** Ordner auf netlify.com hochladen → fertig.

---

## Screens im Überblick

| Screen | Funktion |
|--------|----------|
| Auth | Login / Register / Gast |
| Dashboard | Tagesblöcke, Items, Habits, Leitbild |
| Innen | Werte, Stärken, Antreiber, Persönlichkeit + Leitbild |
| Identität | Rollen & Säulen, max. 5 auswählen |
| Wissen | Snacks lesen, filtern, speichern |
| Fortschritt | 7-Tage Habit-Verlauf, Stats |
| Kalender | Monatsansicht, Tag auswählen |
