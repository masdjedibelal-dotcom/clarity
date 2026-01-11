/*
 * ===================================================================
 * STRUKTURIERTER SCRIPT-BLOCK
 * ===================================================================
 * 
 * ORGANISATION:
 * 1. DATA LAYER - Alle Daten-Arrays und -Objekte
 * 2. HELPER FUNCTIONS - Utility-Funktionen (DOM, Chart.js, etc.)
 * 3. UI FUNCTIONS - Rendering und Update-Funktionen
 * 4. CHART FUNCTIONS - Chart.js Initialisierung und Management
 * 5. INITIALIZATION - App-Start und Event-Handler
 * 
 * ===================================================================
 */

// ===================================================================
// 1. DATA LAYER
// ===================================================================
// Alle statischen Daten-Arrays und -Objekte
// ===================================================================

// State-Variablen für Tab-Systeme
let activeFoundationTab = 'Werte'; // Default: Werte
let activePillarTab = 'load'; // Default: load

const steps = [
    { t: "Motivation", d: "Motivation ist der Anfangszustand. Sie entsteht intrinsisch (aus persönlichem Wunsch/Sinn) oder extrinsisch (Belohnung/Druck). Sie erzeugt den notwendigen Impuls, um überhaupt über Veränderung nachzudenken.", s: "Auslöser (Trigger) & Bedürfnis", r: "Initiator", research:["Dopamin-Spitzen entstehen bei der Vorstellung des Ziels (Outcome), nicht während der harten Arbeit.","Push-Faktoren (Weg von Schmerz) sind oft kurzfristig stärker als Pull-Faktoren (Hin zu Freude).","Motivation ist hoch-emotional und daher extrem anfällig für Stress oder Schlafmangel."] },
    { t: "Entscheidung", d: "Eine Entscheidung ist die bewusste Wahl zwischen mehreren Optionen. Sie beendet das innere Abwägen und legt fest, welcher Weg verfolgt wird – und welche Alternativen bewusst ausgeschlossen werden.", s: "Verbindlichkeit (Commitment)", r: "Weichensteller", research:["Entscheidungen entstehen im Zusammenspiel von intuitivem und rationalem Denken.","Vorab getroffene Entscheidungen schützen vor Entscheidungsmüdigkeit und sparen mentale Energie.","Klare Festlegungen reduzieren Heuristiken und Bias."] },
    { t: "Disziplin", d: "Handeln gegen Widerstände. Wenn der emotionale Rausch der Motivation verfliegt, tritt Disziplin an ihre Stelle. Es ist die kognitive Fähigkeit, langfristige Ziele über kurzfristige Impulse zu stellen. In dieser Phase findet der härteste Kampf im Gehirn statt: Alt gegen Neu.", s: "Willenskraft & Disziplin", r: "Motor", research:["Willenskraft verhält sich wie ein Muskel und kann durch 'Decision Fatigue' im Laufe des Tages abnehmen.","Disziplin erfordert bewusste Aufmerksamkeit und verbrennt massiv Glukose im präfrontaler Cortex.","Hier scheitern 80% aller Neujahrsvorsätze, da das Gehirn in alte Energiespar-Muster zurückfällt."] },
    { t: "Gewohnheit", d: "Die neuronale Automatisierung. Sobald eine Handlung oft genug wiederholt wurde, verschiebt das Gehirn die Steuerung vom energiehungrigen Cortex in die effizienten Basalganglien. Ab diesem Punkt wird kein aktives Denken mehr benötigt – die Handlung geschieht fast von selbst.", s: "Automatisierung", r: "Autopilot", research:["The Habit Loop: Jede Gewohnheit braucht einen Auslöser (Cue),eine Routine und eine Belohnung.","Nach ca. 66 Tagen ist eine Handlung so tief verankert, dass sie bei Fehlen Unbehagen auslöst.","Neuronale Myelinisierung verstärkt die Leitbahnen, was die Reaktionszeit minimiert."] },
    { t: "Innere Stärke", d: "Psychologische Robustheit (Resilienz). Erfolg ist kein linearer Weg. Innere Stärke bedeutet, nach Rückschlägen nicht abzubrechen, sondern das System neu zu kalibrieren. Es geht um die Regulation von Frustration und die Fähigkeit zur Selbstreflexion ohne Selbstverurteilung.", s: "Resilienz, Mindet & Emotionsregulation", r: "Stabilisator", research:["Growth Mindset: Fehler werden als Datenpunkte und Lernchancen begriffen, nicht als Identitätsmangel.","Emotionsregulation verhindert, dass ein schlechter Tag zu einer Abbruch-Woche wird.","Selbstmitgefühl korreliert paradoxerweise höher mit Disziplin als Selbststrenge."] },
    { t: "Selbstwirksamkeit", d: "Das tiefe Vertrauen in die eigene Handlungsfähigkeit. Durch das Meistern der vorherigen Phasen sammelt das Individuum 'Beweise' für die eigene Kompetenz. Dies erzeugt eine positive Feedbackschleife, die weit über das ursprüngliche Ziel hinausstrahlt.", s: "Vertrauen & Bestätigung", r: "Katalysator", research:["Mastery Experiences sind der stärkste Treiber für echtes Selbstbewusstsein.","Hohe Selbstwirksamkeit reduziert Stress und erhöht die Ausdauer bei komplexen Aufgaben.","Der Fokus verschiebt sich von 'Kann ich das?' zu 'Wie löse ich das?'."] },
    { t: "Identität", d: "Der finale Zustand: Die Handlung ist eins mit dem Selbstbild. Man tut Dinge nicht mehr, um ein Ziel zu erreichen, sondern weil man dieser Mensch IST. Dies ist die stabilste Form des Erfolgs, da kein äußerer Druck und keine künstliche Motivation mehr nötig sind.", s: "Ontologische Transformation", r: "Statische Identität", research:["Identity-Based Habits: 'Ich bin ein Nichtraucher' ist stärker als 'Ich versuche aufzuhören'.","Kognitive Dissonanz sorgt dafür, dass wir uns konsistent zu unserem Selbstbild verhalten.","Werte und Handlungen sind in perfekter Resonanz, was tiefe Zufriedenheit erzeugt."] }
];

// Stabiles Mapping für Chart-Datasets: Keys, Labels, Farben
const CHART_DATASET_CONFIG = {
    motivation: {
        key: 'motivation',
        label: 'Motivation',
        borderColor: '#f59e0b'
    },
    discipline: {
        key: 'discipline',
        label: 'Disziplin',
        borderColor: '#ef4444'
    },
    habit: {
        key: 'habit',
        label: 'Gewohnheit',
        borderColor: '#10b981'
    }
};

// Reihenfolge für Chart-Rendering (konsistent mit Mapping)
const CHART_DATASET_ORDER = ['motivation', 'discipline', 'habit'];

const phasesData = [
    { n: "Aktivierung", m: "Tag 1 - 10", d: "Die Phase der Begeisterung. Alles ist neu, die Energie ist explosiv. Hier werden Visionen geboren, aber noch keine stabilen Strukturen gebaut. Wichtig: Den Schwung nutzen, um die Umgebung vorzubereiten.", val: { motivation: 100, discipline: 20, habit: 0 } },
    { n: "Widerstand", m: "Tag 11 - 30", d: "Die Phase der Ernüchterung. Der Körper und das Gehirn rebellieren gegen die Veränderung. Schmerz und Müdigkeit werden spürbar. Hier entscheidet sich, wer Systeme baut und wer nur Träume hat.", val: { motivation: 30, discipline: 90, habit: 10 } },
    { n: "Integration", m: "Tag 31 - 60", d: "Die Phase der Normalisierung. Die Anstrengung sinkt spürbar. Es fühlt sich nicht mehr wie ein Fremdkörper an. Das Gehirn beginnt, die neuen Bahnen zu bevorzugen. Erste messbare Erfolge werden sichtbar.", val: { motivation: 20, discipline: 50, habit: 60 } },
    { n: "Stabilität", m: "Tag 60+", d: "Die Phase der Meisterschaft. Die neue Handlung ist der Standard. Sie kostet keine Willenskraft mehr. Man muss sich eher überwinden, es NICHT zu tun. Die Identität hat sich erfolgreich transformiert.", val: { motivation: 80, discipline: 10, habit: 100 } }
];

       const foundationData = [
    {
        t: "Werte",
        d: "Sie bestimmen, welche Entscheidungen sich für dich richtig anfühlen,welche Kompromisse dich innerlich kosten und wann dein System langfristig stabil bleibt – oder kippt.",
        p: "Sie schaffen innere Kongruenz und ein klares Warum, das dich auch durch Motivationslöcher trägt.",
        c: "Sind Ziele nicht wertekongruent, entstehen innerer Stress und Selbstsabotage.",
        e: "Beispiel: Ist Verantwortung ein zentraler Wert, hältst du Zusagen an dich selbst eher ein – etwa beim regelmäßigen Training oder Lernen – auch wenn die Motivation schwankt."
    },
    {
        t: "Stärken",
d: "Stärken sind wiederkehrende Muster in deinem Denken, Fühlen oder Handeln, die dir leichtfallen und dir Energie geben. Sie zeigen, wo du natürlich wirksam bist – nicht, wo du dich anstrengst.",
p: "Wenn du aus deinen Stärken heraus handelst, kommst du schneller in den Flow, erlebst mehr Selbstwirksamkeit und bleibst langfristig dran.",
c: "Konzentrierst du dich hauptsächlich auf deine Schwächen, entsteht hohe Reibung: Fortschritt fühlt sich mühsam an, Motivation sinkt und Selbstvertrauen leidet.",
e: "Beispiel: Hast du die Stärke Analytik, hilft dir ein einfaches Tracking deiner Gewohnheiten, um Fortschritte sichtbar zu machen und dranzubleiben."
    },
    {
        t: "Persönlichkeit",
        d: "Deine Persönlichkeit beschreibt stabile Muster in deinem Denken, Fühlen und Handeln. Sie erklärt, warum manche Menschen Struktur brauchen, andere Freiheit, warum einige Energie aus Ruhe ziehen und andere aus Austausch.",
        p: "Wenn du deine Persönlichkeitsstruktur kennst, kannst du Ziele, Gewohnheiten und Entscheidungen so aufbauen, dass sie zu dir passen – statt ständig gegen dich selbst zu kämpfen.",
        c: "Ohne dieses Verständnis versuchst du oft Strategien, die für andere funktionieren, aber nicht für dich – und hältst dich dann fälschlich für undiszipliniert oder inkonsequent.",
        e: "Beispiel: Als eher introvertierte Person triffst du bessere Entscheidungen, wenn du dir vor wichtigen Gesprächen Zeit zur Vorbereitung nimmst statt spontan zu reagieren."
    },
    {
        t: "Innere Antreiber",
d: "Innere Antreiber sind meist unbewusste Glaubenssätze wie „Sei perfekt“ oder „Mach es allen recht“, die früh entstehen und unser Verhalten automatisch steuern.",
p: "Bewusst eingesetzt erzeugen sie hohe Energie, Tempo und Qualitätsanspruch.",
c: "Unreflektiert oder übersteigert führen Antreiber zu Dauerstress, Erschöpfung oder Aufschieben aus Angst vor Fehlern.",
e: "Beispiel: Der Antreiber „Beeil dich“ kann dir helfen, Aufgaben schnell zu starten. Wird er zu stark, brauchst du bewusst Pausen, um nicht in Dauerstress zu geraten."

    }
];

const summaryDetails = {
    motivation: { t: "Motivation", c: "#f59e0b", d: "Der biologische Zündschlüssel. Dopamin sorgt für den Fokus auf das Ziel. Ohne Motivation gibt es keinen Start, aber wer sich nur auf sie verlässt, scheitert, sobald das Dopamin-Niveau sinkt.", e: "Das begeisterte Gefühl nach einer Dokumentation über Marathonläufer: 'Ich fange morgen an!'", e: "Das begeisterte Gefühl nach einer Dokumentation über Marathonläufer: 'Ich fange morgen an!'" },
    entscheidung: { t: "Entscheidung", c: "#44403c", d: "Filtermoment. Hier wird aus einem Wunsch eine Verpflichtung. Die Entscheidung findet im präfrontalen Cortex statt und erfordert ein klares 'Nein' zu Alternativen.", e: "Der Moment um 6:00 Uhr morgens: Wecker ausstellen und aufstehen statt Weiterschlafen." },
    disziplin: { t: "Disziplin", c: "#ef4444", d: "ie Brücke über das Tal der Tränen. Handeln ohne Lust. Hier wird die Willenskraft investiert, um das Gehirn umzuprogrammieren. Das schmerzt, ist aber die Geburtsstunde jeder Gewohnheit.", e: "In Woche 4 ins Fitnessstudio gehen, obwohl man Muskelkater hat und es draußen regnet." },
    schutzfaktoren: { t: "Schutzschild", c: "#10b981", d: "Resilienz und Regulation. Mechanismen, die verhindern, dass ein Ausrutscher zum Scheitern führt. Wer sich selbst verzeiht, bleibt länger am Ball.", e: "ach einem Stück Kuchen nicht den Tag aufgeben ('Jetzt ist es eh egal'), sondern das Abendessen wieder gesund planen." },
    gewohnheit: { t: "Gewohnheit", c: "#10b981", d: "Der Autopilot-Status. Die Handlung ist in den Basalganglien verankert. Es kostet fast keine Energie mehr. Das Gehirn liebt diese Effizienz.", e: "Du stehst in der Küche und schnippelst Gemüse für den nächsten Tag, ohne darüber nachzudenken." },
    selbstwirksamkeit: { t: "Ego-Beweis", c: "#3b82f6", d: "Die neue Identität. Jede abgeschlossene Handlung ist eine Stimme für dein neues Ich. Das Selbstvertrauen wächst durch Taten, nicht durch Affirmationen.", e: "Du siehst dich im Spiegel und denkst nicht 'Ich will abnehmen', sondern 'Ich BIN ein Athlet'." }
};

const LOOP_SYSTEM_DATA = [
  {
    title: "Load",
    desc: "Load beschreibt, wie viel Energie, Fokus und mentale Kapazität deinem System aktuell zur Verfügung steht.",
    pro: "Stabiler Load macht Output leichter: Du hast Klarheit, Energie und weniger Reibung beim Start.",
    contra: "Wenn Load fehlt, fühlt sich alles wie Disziplin an – obwohl das System eigentlich leer ist.",
    example: "Mini-Check: „Wie leer bin ich gerade (0–10)?“ – Wenn du bei 3 bist, ist Output nicht die Lösung, sondern erst Load."
  },
  {
    title: "Output",
    desc: "Output ist die Fähigkeit, Gedanken in Handlung zu übersetzen – mit möglichst wenig Reibung im Alltag.",
    pro: "Output erzeugt Selbstwirksamkeit: Du siehst, dass du liefern kannst – auch ohne perfekte Stimmung.",
    contra: "Zu viel Komplexität, Perfektionismus oder fehlende Struktur führen dazu, dass du startest – aber nicht dranbleibst.",
    example: "Fast Fix: „Nur starten.“ Zeitbox 10 Minuten – kein Ergebnis-Ziel. Output beginnt mit Bewegung, nicht mit Motivation."
  },
  {
    title: "Off",
    desc: "Off ist die bewusste Phase für Erholung, Entlastung und Regulation des Nervensystems – damit dein System stabil bleibt.",
    pro: "Off senkt Stress und macht dich wieder steuerfähig: Fokus, Stimmung und Impulskontrolle werden besser.",
    contra: "Ohne Off bleibst du im Dauerstress: Gereiztheit, Unruhe, schlechter Schlaf – und Output wird zäh.",
    example: "Mini-Reset: 5 tiefe Atemzüge + 2 Minuten Reizpause (kein Screen). Off ist kein Luxus, sondern Prozessbestandteil."
  },
  {
    title: "Progress",
    desc: "Progress ist die Veränderung, die aus Wiederholung entsteht: Lernen, Anpassung – und langfristig Identität.",
    pro: "Progress formt dein Selbstbild: „Ich bin jemand, der dranbleibt.“ Das ist stärker als jedes Mindset-Mantra.",
    contra: "Wenn du nicht misst oder wiederholst, fühlt sich alles nach Stillstand an – obwohl du eigentlich Potenzial hast.",
    example: "Mini-Regel: 1 Satz Fortschritt pro Tag (Journal). Wiederholung macht aus Verhalten Identität – Loop für Loop."
  }
];

// ===================================================================
// 2. HELPER FUNCTIONS
// ===================================================================
// Utility-Funktionen für DOM-Zugriffe, Chart.js, Selektoren, etc.
// ===================================================================

// Helper-Funktion für sichere DOM-Zugriffe
function safeGetElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element mit ID "${id}" nicht gefunden.`);
    }
    return element;
}

// Helper-Funktion: Prüft ob Chart.js geladen ist
function isChartJsReady() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js ist nicht geladen. Prüfe ob CDN verfügbar ist.');
        return false;
    }
    if (typeof Chart.register === 'undefined') {
        console.warn('Chart.js ist geladen, aber Chart.register ist nicht verfügbar. Mögliche Version-Inkompatibilität.');
        return false;
    }
    return true;
}

// Helper-Funktion: Prüft ob ChartDataLabels Plugin verfügbar ist
function isChartDataLabelsReady() {
    if (typeof ChartDataLabels === 'undefined') {
        console.warn('Chart.js DataLabels Plugin ist nicht geladen.');
        return false;
    }
    return true;
}

// Helper-Funktion: Sichere querySelectorAll mit Error-Handling
function safeQuerySelectorAll(selector, context = document) {
    if (!selector || typeof selector !== 'string') {
        console.warn(`safeQuerySelectorAll: Ungültiger Selektor "${selector}".`);
        return [];
    }
    
    try {
        const elements = context.querySelectorAll(selector);
        if (elements.length === 0) {
            console.warn(`safeQuerySelectorAll: Keine Elemente für Selektor "${selector}" gefunden.`);
        }
        return Array.from(elements); // Konvertiere NodeList zu Array für bessere Kompatibilität
    } catch (error) {
        console.error(`safeQuerySelectorAll: Fehler beim Ausführen von Selektor "${selector}":`, error);
        return [];
    }
}

// Helper-Funktion: Sichere querySelector mit Error-Handling
function safeQuerySelector(selector, context = document) {
    if (!selector || typeof selector !== 'string') {
        console.warn(`safeQuerySelector: Ungültiger Selektor "${selector}".`);
        return null;
    }
    
    try {
        const element = context.querySelector(selector);
        if (!element) {
            console.warn(`safeQuerySelector: Kein Element für Selektor "${selector}" gefunden.`);
        }
        return element;
    } catch (error) {
        console.error(`safeQuerySelector: Fehler beim Ausführen von Selektor "${selector}":`, error);
        return null;
    }
}

// Helper-Funktion: Vibration für App-Gefühl
function vibrate(duration = 5) {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
        try {
            navigator.vibrate(duration);
        } catch (error) {
            // Silent fail - Vibration nicht kritisch
        }
    }
}

// ===============================
// TOGGLE RESEARCH FUNCTION (for Methods)
// ===============================
function toggleResearch(toggleId, contentId) {
  const toggle = document.getElementById(toggleId);
  const content = document.getElementById(contentId);
  
  if (!toggle || !content) return;
  
  const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
  
  if (isExpanded) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Warum ist das so?';
    content.hidden = true;
  } else {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.textContent = 'Weniger';
    content.hidden = false;
  }
  
  // Vibration für App-Gefühl
  vibrate(5);
}



// ===================================================================
// 3. UI FUNCTIONS
// ===================================================================
// Rendering und Update-Funktionen für UI-Komponenten
// ===================================================================

function updateStep(i) {
    // Validierung: Prüfe ob Index und Daten existieren
    if (!Array.isArray(steps) || i < 0 || i >= steps.length) {
        console.warn(`updateStep: Ungültiger Index ${i} oder steps-Array nicht verfügbar.`);
        return;
    }
    
    const s = steps[i];
    if (!s) {
        console.warn(`updateStep: Schritt bei Index ${i} ist undefined.`);
        return;
    }
    
    // Sichere DOM-Zugriffe mit Helper-Funktion
    const stepTitle = safeGetElement('step-title');
    const stepDesc = safeGetElement('step-desc');
    const stepDescToggle = safeGetElement('step-desc-toggle');
    const stepSource = safeGetElement('step-source');
    const stepRisk = safeGetElement('step-risk');
    const stepNum = safeGetElement('step-num');
    const deepPoints = safeGetElement('deep-points');
    
    // Setze Inhalte nur wenn Elemente existieren
    if (stepTitle) stepTitle.textContent = s.t || '';
    if (stepSource) stepSource.textContent = s.s || '';
    if (stepRisk) stepRisk.textContent = s.r || '';
    if (stepNum) stepNum.textContent = (i+1).toString().padStart(2, '0');
    
    // step-desc entfernen - schwerer Text wird nicht in der Hauptansicht angezeigt
    if (stepDesc) {
        stepDesc.textContent = '';
        stepDesc.style.display = 'none';
    }
    if (stepDescToggle) {
        stepDescToggle.style.display = 'none';
    }
    
    // InnerHTML nur setzen wenn Element existiert und research-Array vorhanden (mit XSS-Schutz)
    if (deepPoints && Array.isArray(s.research) && s.research.length > 0) {
        try {
            // Erstelle Carousel-Container mit kleinen Teaser-Karten (max. 40 Zeichen)
            const carouselItems = s.research.map((p, researchIndex) => {
                // XSS-Schutz: Escape alle Text-Inhalte
                const fullText = (p && typeof p === 'string') ? String(p) : '';
                
                // Teaser: Max. 40 Zeichen + '...'
                const maxLength = 40;
                let teaserText = fullText.substring(0, maxLength);
                if (fullText.length > maxLength) {
                    teaserText = teaserText.replace(/\s+\S*$/, '') + '...';
                }
                const escapedTeaser = escapeHtml(teaserText);
                
                // Vollständiger Text für Modal
                const escapedFullText = escapeHtml(fullText);
                
                return `
                  <div class="carousel-item">
                    <div class="app-card" 
                         onclick="openModal('Forschung', '${escapedFullText.replace(/'/g, "\\'")}')"
                         role="button"
                         tabindex="0"
                         style="cursor: pointer; padding: 12px; transition: background 0.2s;"
                         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openModal('Forschung', '${escapedFullText.replace(/'/g, "\\'")}')}"
                         onmouseover="this.style.background='var(--surface-bright)'"
                         onmouseout="this.style.background='var(--surface)'">
                      <p style="color: var(--text); font-size: 13px; line-height: 1.4; margin: 0; text-align: left;">${escapedTeaser}</p>
                    </div>
                  </div>
                `;
            }).join('');
            
            deepPoints.innerHTML = `<div class="app-carousel">${carouselItems}</div>`;
        } catch (error) {
            console.error('Fehler beim Setzen von deep-points innerHTML:', error);
            deepPoints.innerHTML = '<div class="app-card" style="padding: 12px;"><p style="color: var(--text-muted); font-size: 13px; font-style: italic;">Fehler beim Laden der Details.</p></div>';
        }
    }
}

// ===============================
// 4 SÄULEN (EINMALIG!)
// ===============================
const pillarsData = [
    {
    k: "load",
    t: "Load",
    lvl: "Energie & Fokus",
    icon: "L",
    tag: "Grundniveau",
    d: "Load ist dein energetisches und mentales Grundniveau. Er entscheidet, ob Handeln leicht oder schwer fällt – noch bevor Disziplin oder Motivation relevant werden.",
    signs: "Schnell erschöpft, Fokus bricht weg, Reizbarkeit, Prokrastination, ständiger Bedarf an Koffein oder externem Push.",
    pitfall: "Output erzwingen, obwohl das System leer ist – das führt zu Frust, Überlastung oder Abbruch.",
    next: "Stabilisiere zuerst Energie & Fokus: Schlafrhythmus, klare Startzeiten, Reiz- und Input-Reduktion."
  },
  {
    k: "output",
    t: "Output",
    lvl: "Handlung & Umsetzung",
    icon: "O",
    tag: "Umsetzung",
    d: "Output beschreibt deine Fähigkeit, ins Handeln zu kommen und dranzubleiben. Hier entscheidet sich, ob Wissen zu Resultaten wird.",
    signs: "Viel Planung, wenig Umsetzung, häufiger Neustart, Busy-Sein ohne echte Ergebnisse.",
    pitfall: "Auf Motivation warten oder Tools optimieren, statt Verhalten klar zu strukturieren.",
    next: "Reduziere Reibung: klare Startsignale, kleine Standards, feste Wenn–Dann-Regeln."
  },
  {
    k: "off",
    t: "Off",
    lvl: "Regeneration & Nervensystem",
    icon: "Ø",
    tag: "Erholung",
    d: "Off ist die Fähigkeit, bewusst runterzufahren. Ohne echte Regeneration wird Leistung teuer – mental wie körperlich.",
    signs: "Innere Unruhe, schlechter Schlaf, Gereiztheit, Abschalten gelingt nur mit Ablenkung.",
    pitfall: "Abschalten mit Betäuben verwechseln (Scrollen, Serien, Alkohol) statt das Nervensystem zu beruhigen.",
    next: "Baue klare Off-Rituale: feste Endpunkte, Übergänge, Reizreduktion, Schlafschutz."
  },
  {
    k: "progress",
    t: "Progress",
    lvl: "Lernen & Entwicklung",
    icon: "P",
    tag: "Wachstum",
    d: "Progress ist nachhaltige Entwicklung. Du wirst besser, weil du reflektierst, nachschärfst und Standards baust – nicht weil du härter grindest.",
    signs: "Stagnation trotz Aufwand, wiederholte Fehler, keine klaren Routinen oder Lernschleifen.",
    pitfall: "Neuen Input jagen, ohne den eigenen Prozess zu überprüfen oder anzupassen.",
    next: "Etabliere Reviews: Was wirkt? Was nicht? Was ist der nächste kleine Standard?"
  }
];

const selfCheckQuick = [
  {
    case: "Ich bin müde, obwohl ich eigentlich genug geschlafen habe.",
    think: "Irgendwie fehlt mir Energie.",
    focus: "Load",
    recommendation: "Starte bei LOAD: stabilisiere Energie & Fokus, bevor du Output erzwingst. Wenn dein Grundniveau leer ist, fühlt sich alles schwer an."
  },
  {
    case: "Ich weiß, was ich tun sollte – aber ich fange einfach nicht an.",
    think: "Ich schiebe es vor mir her.",
    focus: "Output",
    recommendation: "Starte bei OUTPUT: reduziere Startwiderstand und baue klare Startsignale. Nicht mehr planen – klein starten und wiederholen."
  },
  {
    case: "Ich bin innerlich unruhig, gereizt oder angespannt.",
    think: "Ich komme nicht richtig runter.",
    focus: "Off",
    recommendation: "Starte bei OFF: beruhige dein Nervensystem und schaffe echte Regeneration. Leistung kommt erst, wenn du wieder runterfahren kannst."
  },
  {
    case: "Ich zweifle an mir oder frage mich, ob ich gut genug bin.",
    think: "Andere wirken sicherer als ich.",
    focus: "Progress",
    recommendation: "Starte bei PROGRESS: baue innere Stabilität über Lernschleifen, Standards und Selbstbild. Nicht mehr Druck – mehr Entwicklung."
  },
  {
    case: "Ich mache viel, aber nichts fühlt sich richtig oder sinnvoll an.",
    think: "Ich funktioniere nur noch.",
    focus: "Progress",
    recommendation: "Starte bei PROGRESS: richte neu aus (Werte, Richtung, Standards). Effizienz ohne Sinn verbrennt Energie und killt den Loop."
  },
  {
    case: "Ich bin erschöpft, obwohl ich objektiv erfolgreich bin.",
    think: "Irgendwas passt nicht.",
    focus: "Off",
    recommendation: "Starte bei OFF: du brauchst Erholung und Verarbeitung, nicht noch mehr Optimierung. Ohne Off wird Erfolg teuer."
  },
  {
    case: "Ich nehme mir Dinge vor, halte sie aber nicht durch.",
    think: "Meine Disziplin ist schlecht.",
    focus: "Output",
    recommendation: "Starte bei OUTPUT: baue Systeme, Regeln und kleine Standards, die dich automatisch ins Tun bringen. Nicht mehr Willenskraft – weniger Reibung."
  },
  {
    case: "Ich reagiere oft emotional oder anders als ich eigentlich will.",
    think: "Ich ärgere mich über mich selbst.",
    focus: "Load",
    recommendation: "Starte bei LOAD: oft fehlt Kapazität (Fokus/Energie), dann übernimmt der Autopilot. Stabilisiere Grundniveau, bevor du dich ‚wegoptimierst‘."
  }
];

// ===============================
// STEP DESC TOGGLE
// ===============================
function toggleStepDesc() {
    // Vibration für App-Gefühl
    vibrate(5);
    
    const stepDesc = safeGetElement('step-desc');
    const stepDescToggle = safeGetElement('step-desc-toggle');
    
    if (!stepDesc || !stepDescToggle) {
        console.warn('toggleStepDesc: step-desc oder step-desc-toggle Element nicht gefunden.');
        return;
    }
    
    const isExpanded = stepDesc.getAttribute('data-is-expanded') === 'true';
    const fullText = stepDesc.getAttribute('data-full-text');
    
    if (!fullText) {
        // Fallback: Wenn kein data-full-text vorhanden, nichts tun
        return;
    }
    
    if (isExpanded) {
        // Text einklappen: Zeige gekürzte Version
        const maxLength = 120;
        const truncatedText = fullText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
        stepDesc.textContent = truncatedText;
        stepDesc.setAttribute('data-is-expanded', 'false');
        stepDescToggle.textContent = 'Mehr lesen...';
    } else {
        // Text ausklappen: Zeige vollständigen Text
        stepDesc.textContent = fullText;
        stepDesc.setAttribute('data-is-expanded', 'true');
        stepDescToggle.textContent = 'Weniger lesen...';
    }
}

// ===============================
// UNIFIED READ MORE TOGGLE (Foundation / Identity / Leitbild)
// ===============================
// ===================================================================
// READ TOGGLE (Global System)
// ===================================================================
// Globales System für "Mehr lesen / Weniger lesen" Toggles
// Verwendet Event Delegation für alle Buttons mit .js-read-toggle
// ===================================================================

document.addEventListener('click', function(e) {
  const toggleBtn = e.target.closest('.js-read-toggle');
  if (!toggleBtn) return;

  e.preventDefault();

  // Optional: Vibration
  if (typeof vibrate === 'function') {
    vibrate(5);
  }

  // Lese data-read-target Attribut
  const targetId = toggleBtn.getAttribute('data-read-target');
  if (!targetId) {
    console.warn('read-toggle: data-read-target Attribut fehlt');
    return;
  }

  // Finde Target-Element
  const targetEl = document.getElementById(targetId);
  if (!targetEl) {
    console.warn('read-toggle: Target-Element nicht gefunden:', targetId);
    return;
  }

  // Toggle State
  const isExpanded = !targetEl.hidden;
  
  if (isExpanded) {
    // Schließen
    targetEl.hidden = true;
    toggleBtn.textContent = 'Mehr lesen…';
    toggleBtn.setAttribute('aria-expanded', 'false');
  } else {
    // Öffnen
    targetEl.hidden = false;
    toggleBtn.textContent = 'Weniger lesen…';
    toggleBtn.setAttribute('aria-expanded', 'true');
  }
});


// ✅ SELF-CHECK (Gemini-style, aligned to existing UI)
// Voraussetzung: const selfCheckQuick = [...] existiert bereits

function renderSelfCheckQuick() {
  const grid = safeGetElement("self-check-grid");
  const result = safeGetElement("self-check-result");
  if (!grid || !result) return;

  // Validierung: Prüfe ob selfCheckQuick existiert und Array ist
  if (!Array.isArray(selfCheckQuick) || selfCheckQuick.length === 0) {
    console.warn('renderSelfCheckQuick: selfCheckQuick ist kein Array oder leer.');
    grid.innerHTML = '<div class="app-card" style="padding: var(--spacing-md); text-align: center; color: var(--app-text-muted);">Keine Self-Check-Daten verfügbar.</div>';
    return;
  }

  const focusBadge = (focus) => {
    const f = (focus || "").toLowerCase();

    if (f.includes("load"))     return { label: "LOAD", bg: "rgba(251, 191, 36, 0.2)", color: "var(--accent)" };   // Energie/Fokus (körpernah)
    if (f.includes("output"))   return { label: "OUTPUT", bg: "rgba(14, 165, 233, 0.2)", color: "#0ea5e9" }; // Umsetzung/System
    if (f.includes("off"))      return { label: "OFF", bg: "rgba(16, 185, 129, 0.2)", color: "#10b981" };    // Regeneration (körpernah)
    if (f.includes("progress")) return { label: "PROGRESS", bg: "rgba(139, 92, 246, 0.2)", color: "#8b5cf6" }; // Lernen/Identität (mindset)

    return { label: focus || "Fokus", bg: "rgba(255,255,255,0.1)", color: "var(--app-text)" };
  };

  // Render mit Error-Handling, ID-Validierung und XSS-Schutz
  try {
    grid.innerHTML = selfCheckQuick.map((item, idx) => {
      // Validierung: Index muss Zahl sein und innerhalb des Arrays liegen
      if (typeof idx !== 'number' || idx < 0 || idx >= selfCheckQuick.length) {
console.warn(`renderSelfCheckQuick: Ungültiger Index ${idx}.`);
return '';
      }
      
      // Validierung: Item muss existieren
      if (!item) {
console.warn(`renderSelfCheckQuick: Item bei Index ${idx} ist undefined.`);
return '';
      }
      
      // Fallback-Werte für fehlende Properties mit XSS-Schutz
      const itemCase = (item && item.case) ? escapeHtml(String(item.case)) : '';
      const itemFocus = (item && item.focus) ? escapeHtml(String(item.focus)) : '';
      const itemThink = (item && item.think) ? escapeHtml(String(item.think)) : '';
      const badge = focusBadge(itemFocus);
      
      // ID-Validierung: Stelle sicher dass data-idx gültig ist
      const dataIdx = String(idx); // Konvertiere zu String für data-attribute
      
      return `
<button
  type="button"
  data-idx="${dataIdx}"
  class="app-card"
  style="padding: var(--spacing-sm); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); text-align: left; cursor: pointer; transition: all var(--transition-fast); width: 100%;"
  onmouseover="this.style.background='rgba(255,255,255,0.08)'"
  onmouseout="this.style.background='rgba(255,255,255,0.05)'"
>
  <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
    <div style="font-weight: 600; color: var(--app-text); font-size: 14px; line-height: 1.5; flex: 1;">"${itemCase}"</div>
    <span style="color: ${badge.color}; white-space: nowrap; font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 9999px; background: ${badge.bg}; flex-shrink: 0;">${badge.label}</span>
  </div>
  <div style="color: var(--app-text-muted); margin-top: 6px; font-size: 14px; line-height: 1.5;">${itemThink}</div>
</button>
      `;
    }).filter(html => html !== '').join(""); // Entferne leere Einträge
  } catch (error) {
    console.error('Fehler beim Rendern von Self-Check-Buttons:', error);
    grid.innerHTML = '<div class="app-card" style="padding: var(--spacing-md); text-align: center; color: #f43f5e;">Fehler beim Laden der Self-Check-Buttons.</div>';
    return;
  }

  // Click handler (delegation) - mit Error-Handling
  grid.onclick = (e) => {
    try {
      const btn = e.target.closest("button[data-idx]");
      if (!btn) return;

      // Vibration für App-Gefühl
      vibrate(5);

      const idx = Number(btn.dataset.idx);
      if (isNaN(idx) || idx < 0 || idx >= selfCheckQuick.length) {
console.warn(`renderSelfCheckQuick: Ungültiger Index ${idx} im Click-Handler.`);
return;
      }

      const item = selfCheckQuick[idx];
      if (!item) {
console.warn(`renderSelfCheckQuick: Item bei Index ${idx} ist undefined.`);
return;
      }

      const badge = focusBadge(item.focus);

      // Öffne Bottom Sheet mit strukturierten Daten
      const safeCase = (item.case) ? escapeHtml(String(item.case)) : '';
      const safeThink = (item.think) ? escapeHtml(String(item.think)) : '';
      const safeFocus = (item.focus) ? escapeHtml(String(item.focus)) : '';
      const safeRecommendation = (item.recommendation) ? escapeHtml(String(item.recommendation)) : '';

      // Strukturiere Sections
      const sections = [
        {
          k: 'why',
          label: 'Warum das so ist',
          text: safeThink || 'Dein aktueller Zustand zeigt, wo der Loop blockiert ist.'
        },
        {
          k: 'help',
          label: 'Was jetzt hilft',
          text: safeRecommendation || 'Starte mit dem empfohlenen Fokus-Bereich.'
        },
        {
          k: 'error',
          label: 'Typischer Fehler',
          text: 'Zu schnell zu viel ändern wollen oder am falschen Punkt starten. Fokussiere dich auf einen Bereich und baue von dort aus auf.'
        },
        {
          k: 'next',
          label: 'Nächster Schritt',
          text: `Wähle 1–2 Methoden aus dem Bereich "${safeFocus}" und integriere sie schrittweise in deinen Alltag.`
        }
      ];

      // Öffne Bottom Sheet
      openBottomSheet({
        category: 'Empfohlener Fokus',
        title: safeFocus,
        subtitle: safeCase,
        sections: sections
      });
    } catch (error) {
      console.error('Fehler im Click-Handler von renderSelfCheckQuick:', error);
    }
  };
}

// renderSelfCheckQuick wird jetzt in initializeApp() aufgerufen



// ===============================
// METHODEN (Keys = pillarsData.k)
// ===============================
const methodsData = {
  load: [
    {
    n: "Ernährung & Essensstruktur",
    z: "Energie / Gesundheit",
    v: "Stabilisiert Blutzucker und verhindert Energieeinbrüche.",
    d: "Strukturierte Ernährung schafft konstante Energie, mentale Klarheit und unterstützt Gewichtsregulation.",
    h: "Einfach halten, nicht optimieren.",
    e: [
  "Zeitlich begrenztes Essen (TRE): Alle Mahlzeiten innerhalb eines festen 8–10-Stunden-Fensters einnehmen.",
  "Chrono-Nutrition: Größere Mahlzeiten in die erste Tageshälfte legen, abends leichter essen.",
  "Protein-First-Prinzip: Jede Mahlzeit mit einer klaren Proteinquelle beginnen.",
  "Proteinreiches Frühstück: Den Tag mit ca. 25–30 g Protein starten.",
  "Blutzucker-freundliche Reihenfolge: Erst Gemüse, dann Protein, dann Fett, Kohlenhydrate zuletzt essen.",
  "Low-Variance Meals: Werktags bewusst einfache, wiederkehrende Mahlzeiten nutzen.",
  "Meal Regularity: Mahlzeiten möglichst zu ähnlichen Uhrzeiten einnehmen.",
  "80/20-Regel: Überwiegend funktional essen, bewusst Raum für Genuss lassen."
],
    p: "Hoher Hebel mit wenig Komplexität",
    c: "Zu schnell zu streng werden"
  },

  {
    n: "Energiehaushalt & Belastungssteuerung",
    z: "Leistung",
    v: "Verhindert Überlastung und ineffektives Durchziehen.",
    d: "Energie ist begrenzt und muss aktiv gesteuert werden.",
    h: "Arbeite mit Energie, nicht gegen sie.",
    e: [
  "Front-Load Fokusarbeit: Die anspruchsvollsten Aufgaben bewusst in die erste Tageshälfte legen.",
  "Ultradian-Rhythmus: In 60–90-Minuten-Fokusblöcken arbeiten und danach pausieren.",
  "One-Big-Thing-Regel: Pro Tag nur eine wirklich wichtige Aufgabe definieren.",
  "Energy Cut-Off: Nach klar definierten Zeiten keine Hochfokus-Arbeit mehr starten.",
  "Active Recovery Breaks: Pausen aktiv nutzen (Gehen, Dehnen statt Scrollen).",
  "Decision Batching: Entscheidungen bündeln statt über den Tag zu verteilen.",
  "No-Zero-Energy-Tage: An Low-Energy-Tagen Mindestversionen statt Komplettausfall umsetzen."
],
    p: "Mehr Output ohne mehr Arbeit",
    c: "Pausen werden ignoriert"
  },

  {
    n: "Hydration & Elektrolyte",
    z: "Grundenergie",
    v: "Verhindert Müdigkeit, Kopfschmerzen und Konzentrationsabfall.",
    d: "Hydration ist eine der häufigsten Ursachen für Leistungstiefs.",
    h: "Trinken ist eine Routine, kein Gefühl.",
    e: [
  "Hydration am Morgen: Direkt nach dem Aufstehen 0,5–1 Liter Wasser trinken.",
  "Trink-Default statt Durstgefühl: Trinken nach Zeit oder Routine, nicht nach Gefühl.",
  "Elektrolyte bei Belastung: Bei Sport, Hitze oder Fasten Salz oder Elektrolyte ergänzen.",
  "Flaschen-Placement: Wasser sichtbar und griffbereit platzieren.",
  "Trink-Anker: Trinken fest an Meetings, Aufgabenwechsel oder Pausen koppeln.",
  "Abendliches Runterfahren: Abends keine großen Flüssigkeitsmengen mehr trinken."
],
    p: "Extrem simpel, oft übersehen",
    c: "Durst wird ignoriert"
  },

  {
    n: "Chronotyp & Tages-Timing",
    z: "Fokus",
    v: "Reduziert innere Reibung und Energieverschwendung.",
    d: "Nicht jeder funktioniert zu jeder Uhrzeit gleich gut.",
    h: "Plane nach Biologie, nicht nach Kalender.",
    e: [
  "Chronotyp-Mapping: Eigene Hoch- und Tiefphasen über 1–2 Wochen beobachten.",
  "Peak-Time-Regel: Denk- und Entscheidungsarbeit nur in Hochenergiezeiten erledigen.",
  "Low-Energy-Zonen schützen: In Tiefphasen nur Routinen oder einfache Aufgaben planen.",
  "Social-Jetlag-Minimierung: Schlafzeiten am Wochenende maximal ±1 Stunde verschieben.",
  "Fixe Startzeiten: Feste Aufstehzeit als biologischen Anker nutzen."
],
    p: "Spürbare Entlastung im Alltag",
    c: "Fremde Rhythmen kopieren"
  },

  {
    n: "Licht & zirkadianer Rhythmus",
    z: "Schlaf / Fokus",
    v: "Verbessert Schlafqualität, Stimmung und Tagesenergie.",
    d: "Licht ist der stärkste externe Taktgeber des Körpers.",
    h: "Licht steuert Energie stärker als Disziplin.",
    e: [
  "Morning Light Exposure: Morgens 5–15 Minuten Tageslicht direkt nach dem Aufstehen aufnehmen.",
  "Hell-dunkel-Kontrast: Tagsüber helles Licht, abends konsequent dimmen.",
  "Screen Curfew: 60–90 Minuten vor dem Schlafen keine grellen Bildschirme mehr nutzen.",
  "Abendliches Abdunkel-Ritual: Licht bewusst reduzieren als Signal zum Runterfahren.",
  "Schlaf-Umgebung optimieren: Schlafzimmer möglichst dunkel, kühl und ruhig halten."
],
    p: "Großer Effekt auf Schlaf",
    c: "Abendlicht wird unterschätzt"
  },

  {
    n: "Bewegung & NEAT",
    z: "Energie / Stoffwechsel",
    v: "Erhöht Energie ohne zusätzliches Training.",
    d: "Alltagsbewegung wirkt kontinuierlich auf Energie und Stoffwechsel.",
    h: "Bewegung in den Alltag integrieren.",
    e: [
  "Walk-after-Meals-Regel: Nach größeren Mahlzeiten 10–20 Minuten gehen.",
  "Stündliche Bewegungsregel: Mindestens einmal pro Stunde aufstehen oder bewegen.",
  "Step Anchors: Telefonate oder kurze Aufgaben bewusst im Gehen erledigen.",
  "Standing Defaults: Kurze Tasks standardmäßig im Stehen erledigen.",
  "Movement Stacking: Bewegung an bestehende Routinen koppeln.",
  "Abendliche Bewegung vermeiden: Späte intensive Bewegung reduzieren, um Schlaf nicht zu stören."
],
    p: "Niedrige Hürde, hoher Nutzen",
    c: "Wird nicht als relevant wahrgenommen"
  }

  ],
  progress: [
{
    n: "Klarheit & mentale Ordnung",
    z: "Progress",
    v: "Weniger Grübeln, mehr Klarheit – du steuerst den Tag statt ihn zu erleiden.",
    d: "Hier geht’s um mentale Entlastung, klare Prioritäten und schnelle Reflexion. Nicht mehr denken – besser entscheiden.",
    h: "Wähle 1–2 Methoden als Standard. Der Effekt kommt durch Wiederholung, nicht durch Vielfalt.",
    e: [
  "Brain Dump: 2–5 Minuten alles ungefiltert aufschreiben, dann 1 Punkt für morgen markieren.",
  "Daily Outcome Definition: Morgens 1 Ergebnis definieren, das den Tag erfolgreich macht.",
  "Reflection Loop (5 Minuten): Abends 3 Fragen beantworten (Win / schwer / Lernpunkt).",
  "End-of-Day Closure: Offenes bewusst parken – „Heute fertig, morgen weiter mit …“ notieren.",
  "Reframing: Frage „Welche Sicht macht mich handlungsfähig?“ und formuliere eine bessere Bedeutung.",
  "Umsetzungsvorsatz (Wenn–Dann): 1–2 Regeln bauen, die Verhalten automatisch auslösen.",
  "Decision Closure Rule: Getroffene Entscheidungen schriftlich abschließen („Entschieden ist …“).",
  "Cognitive Offloading: Alles, was nicht heute relevant ist, bewusst in ein externes System auslagern.",
  "Top-3-Filter: Alles prüfen mit der Frage „Zahlt das auf meine Top 3 gerade ein?“"
],
    p: "Sofort spürbar: weniger mentaler Lärm",
    c: "Zu viele Methoden auf einmal → keine wird Routine"
  },

  /* =========================
     PROGRESS – IDENTITÄT & SELBSTWIRKSAMKEIT
  ========================= */

  {
    n: "Identität & Selbstwirksamkeit",
    z: "Progress",
    v: "Du baust Vertrauen in dich über Beweise – nicht über Motivation.",
    d: "Progress wird stabil, wenn du dich als jemand erlebst, der liefert – auch bei Widerstand.",
    h: "Mach es klein und täglich. Identität entsteht durch die Summe kleiner Beweise.",
    e: [
  "Selbstwirksamkeits-Log: Abends 1–3 Beweise notieren, dass du geliefert hast.",
  "Identity-Based Tracking: Ein Satz pro Tag: „Ich bin jemand, der …“ + Beweis aus dem Tag.",
  "Minimum-Standard-Regel: Definiere die kleinste Version, die auch an schlechten Tagen gilt.",
  "No-Zero-Days: Jeden Tag mindestens 1 Mini-Handlung, damit Momentum nicht abreißt.",
  "Coach-Selbstgespräch: Einen Standardsatz nutzen („5 Minuten starten – dann entscheide ich neu.“).",
  "Effort Attribution: Erfolg bewusst auf Einsatz zurückführen („Ich habe das geschafft, weil …“).",
  "Bounce-Back-Rule: Nach Rückschlägen sofort zur kleinsten stabilen Routine zurückkehren.",
  "Identity Repair Statement: Nach Fehlern bewusst formulieren, wer man trotzdem ist.",
  "Proof over Mood: Eigene Leistung anhand von Fakten bewerten, nicht anhand von Stimmung."
],
    p: "Sehr starker Hebel für Disziplin und Selbstvertrauen",
    c: "Zu groß planen → du nimmst dir die Beweise wieder weg"
  },

  /* =========================
     PROGRESS – WACHSTUM & KOMFORTZONE
  ========================= */

  {
    n: "Wachstum & Komfortzone",
    z: "Progress",
    v: "Angst wird zu Handlung – du trainierst Mut wie einen Muskel.",
    d: "Wachstum passiert nicht durch Nachdenken, sondern durch wiederholte kleine Stretch-Momente.",
    h: "Skaliere klein. 1 Mini-Challenge pro Woche ist besser als 1 großer Sprint pro Quartal.",
   e: [
  "Mutliste (Stretch-Zone): 10 Mut-Aktionen sammeln (1–10) und wöchentlich eine umsetzen.",
  "Rejection Practice: Kleine Situationen mit möglicher Ablehnung bewusst suchen.",
  "Failure Normalization: Fehlversuche neutral dokumentieren (Test → Ergebnis → Lernpunkt).",
  "Mentales Training (Visualisierung): Ablauf + Gefühl + Abschluss vorher durchspielen.",
  "Skill Stretching: Aufgaben wählen, die leicht über dem aktuellen Niveau liegen.",
  "Feedback Exposure: Aktiv Feedback einholen statt vermeiden.",
  "Discomfort Scheduling: Mut-Aktionen bewusst fest im Kalender verankern.",
  "Fear Labeling: Angst konkret benennen statt diffus vermeiden.",
  "Progressive Exposure: Schwierigkeit schrittweise erhöhen statt zu springen."
],
    p: "Sehr starker Hebel für Selbstvertrauen und Entwicklung",
    c: "Zu groß starten → Vermeidung wird stärker"
  },

  /* =========================
     PROGRESS – SINN & LANGFRISTIGKEIT
  ========================= */

  {
    n: "Sinn & langfristige Ausrichtung",
    z: "Progress",
    v: "Du bleibst auf Kurs – auch wenn Motivation schwankt.",
    d: "Sinn ist dein Langzeit-Treibstoff. Er verhindert, dass du nur reagierst und dich verzettelst.",
    h: "Baue eine Wochenroutine. Sinn entsteht durch Rückblick + klare nächste Schritte.",
e: [
  "Weekly Reflection & Planning: Woche reflektieren und 1–3 Prioritäten setzen.",
  "Effort–Meaning Link: Schwierige Aufgaben bewusst mit einem größeren Warum verknüpfen.",
  "Long-Term Scorecard: Fortschritt wöchentlich statt täglich bewerten.",
  "Values Check-in: Prüfen, ob Handeln mit eigenen Werten übereinstimmt.",
  "Trajectory Thinking: Entscheidungen nach langfristiger Richtung bewerten.",
  "Season Focus: Für einen Zeitraum bewusst nur wenige Themen priorisieren.",
  "Default Yes / Default No: Vorab definieren, wozu du grundsätzlich Ja bzw. Nein sagst.",
  "North-Star Question: Regelmäßig fragen „Wozu zahlt das langfristig ein?“",
  "Legacy Framing: Entscheidungen aus Sicht des zukünftigen Selbst betrachten."
],
    p: "Sehr stark für Fokus und Durchhaltevermögen",
    c: "Wird als „zu langsam“ unterschätzt"
  }

  ],
  output: [
    {
    n: "Produktivität",
    z: "Output",
    v: "Mehr Fokus, weniger Reibung, sichtbarer Fortschritt.",
    d: "Methoden, um Arbeit realistisch zu planen, sauber zu starten und konzentriert abzuschließen.",
    h: "Wähle 1–2 Methoden als Default, nicht alles gleichzeitig.",
    e: [
  "Paretoprinzip (80/20-Regel): Konzentriere dich auf die wenigen Aufgaben, die den größten Teil des Ergebnisses erzeugen.",
  "Eisenhower-Matrix: Sortiert Aufgaben nach wichtig/dringend, um Prioritäten klar zu entscheiden statt nur zu reagieren.",
  "ALPEN-Methode: Plant den Tag realistisch, indem Aufgaben, Dauer, Puffer und Nachkontrolle bewusst berücksichtigt werden.",
  "Ivy-Lee-Methode: Legt am Abend die wichtigsten Aufgaben für den nächsten Tag fest und zwingt zur klaren Reihenfolge.",
  "Pomodoro: Bündelt Fokus durch feste Arbeitsintervalle mit geplanten Pausen.",
  "Eat the Frog: Erledige die schwierigste oder unangenehmste Aufgabe zuerst, um mentalen Druck abzubauen.",
  "1–3–5 Tagesplan: Strukturiert den Tag mit einer großen, drei mittleren und fünf kleinen Aufgaben.",
  "2-Minuten-Regel: Alles, was weniger als zwei Minuten dauert, wird sofort erledigt statt aufgeschoben.",
  "Timeboxing: Aufgaben werden mit fixer Zeit bearbeitet, um Perfektionismus und Endlosarbeit zu vermeiden.",
  "Single-Tasking: Arbeite immer nur an einer Aufgabe gleichzeitig, um Fokusverlust zu verhindern.",
  "Batching: Fasst ähnliche Aufgaben zusammen, um Kontextwechsel zu reduzieren.",
  "Energy-Based Scheduling: Plant Aufgaben nach Energielevel statt nach Uhrzeit.",
  "Focus Gatekeeping: Blockiert Fokuszeit im Kalender und schützt sie konsequent vor Unterbrechungen.",
  "Definition of Done: Legt vor Beginn fest, wann eine Aufgabe wirklich als abgeschlossen gilt.",
  "Output-First Working: Definiert zuerst das gewünschte Ergebnis und richtet die Arbeit konsequent darauf aus."
],
    p: "Sehr alltagstauglich + skalierbar",
    c: "Zu viele Methoden gleichzeitig verwässern den Effekt"
  },

  /* =========================
     OUTPUT – ENTSCHEIDUNG
  ========================= */

  {
    n: "Entscheidung",
    z: "Output",
    v: "Schneller entscheiden, weniger Grübeln.",
    d: "Methoden, um Entscheidungen zu strukturieren, zu beschleunigen und sauber zu vertreten.",
    h: "Eine Methode pro Entscheidung reicht völlig.",
   e: [
  "WOOP (Wish–Outcome–Obstacle–Plan): Definiert Wunsch, gewünschtes Ergebnis, wahrscheinliches Hindernis und eine konkrete Wenn–Dann-Handlung.",
  "Value-based Decision Tool: Bewertet Optionen danach, wie gut sie zu den eigenen Werten passen.",
  "Regret-Minimization-Framework: Trifft Entscheidungen aus der Perspektive des 80-jährigen Selbst, um spätere Reue zu minimieren.",
  "Kant-Test (Öffentlichkeits-Test): Prüft, ob man die Entscheidung öffentlich vertreten oder verallgemeinern würde.",
  "Reversibility Check: Unterscheidet zwischen reversiblen und irreversiblen Entscheidungen, um Tempo anzupassen.",
  "Good-Enough Rule (70%-Regel): Entscheidet bei ausreichender Klarheit statt auf perfekte Informationen zu warten.",
  "Decision Deadline: Setzt eine feste Frist, um Entscheidungsaufschub zu vermeiden.",
  "Pre-Mortem: Analysiert vorab mögliche Gründe, warum eine Entscheidung scheitern könnte.",
  "Pro-Contra-Liste: Stellt Vor- und Nachteile systematisch gegenüber, um Klarheit zu gewinnen.",
  "Entscheidungsmatrix: Bewertet Alternativen anhand mehrerer Kriterien mit Punkten.",
  "Entscheidungsbaum: Visualisiert Entscheidungsoptionen und deren mögliche Konsequenzen.",
  "10-10-10-Modell: Bewertet Entscheidungen nach ihren Auswirkungen in 10 Minuten, 10 Monaten und 10 Jahren.",
  "WRAP-Methode: Verbessert Entscheidungen durch Optionen erweitern, Abstand gewinnen und Risiken antizipieren.",
  "Best-Case-/Worst-Case-Analyse: Durchdenkt bewusst die besten und schlechtesten möglichen Szenarien.",
  "Perspektivwechsel: Betrachtet die Entscheidung aus Sicht anderer beteiligter Personen."
],
    p: "Sehr klar und wirkungsvoll",
    c: "Überanalyse ersetzt manchmal einfaches Tun"
  },

  /* =========================
     OUTPUT – ZIELE
  ========================= */

  {
    n: "Ziele",
    z: "Output",
    v: "Ziele werden klar, messbar und handlungsleitend.",
    d: "Methoden, um Ziele nicht nur zu formulieren, sondern konsequent umzusetzen.",
    h: "Wenige Ziele, sauber formuliert.",
    e: [
      "SMART-Ziele: Ziele spezifisch, messbar, attraktiv, realistisch und terminiert formulieren.",
      "Backcasting: Vom Endzustand rückwärts die notwendigen Schritte ableiten.",
      "Outcome-Fokus: Ziele als Ergebnis statt als Aktivität formulieren.",
      "Milestone-Logik: Große Ziele in klar definierte Zwischenetappen zerlegen.",
      "Zeithorizont-Klarheit: Kurz-, Mittel- und Langfristziele bewusst trennen.",
      "Lead-Metric-Fokus: Steuerbare Vorlaufkennzahlen statt nur Endergebnisse tracken.",
      "Anti-Goals: Klar definieren, was man bewusst nicht mehr tut.",
      "Identity-Linked Goals: Ziele als Ausdruck der gewünschten Identität formulieren.",
      "Seasonal Goals: Ziele bewusst auf Quartale oder Lebensphasen begrenzen."
    ],
    p: "Hohe Klarheit und Umsetzbarkeit",
    c: "Zu viele parallele Ziele erzeugen Stress"
  },

  /* =========================
     OUTPUT – DISZIPLIN & DURCHZIEHEN
  ========================= */

  {
    n: "Umsetzung & Disziplin",
    z: "Output",
    v: "Umsetzung auch bei Widerstand und niedriger Motivation.",
    d: "Methoden, die Willenskraft sparen und Verhalten wahrscheinlicher machen.",
    h: "Disziplin entsteht durch Struktur, nicht durch Härte.",
    e: [
      "Reibungsdesign: Umgebung so gestalten, dass gutes Verhalten leicht und schlechtes schwer wird.",
      "Wenn–Dann-Regeln: Klare Auslöser definieren, die Verhalten automatisch starten.",
      "5-Minuten-Regel: Aufgabe 5 Minuten beginnen, danach bewusst entscheiden.",
      "Minimum-Standard: Kleinste Version definieren, die auch an schlechten Tagen gilt.",
      "One-Big-Thing-Regel: Pro Tag genau 1 wichtige Aufgabe priorisieren.",
      "Start-First-Prinzip: Erst anfangen, dann entscheiden, ob man weitermacht.",
      "Discipline by Default: Standards festlegen, die nicht täglich neu entschieden werden.",
"Decision Batching: Entscheidungen bündeln statt ständig umzuschalten.",
      "Friction for Bad Habits: Schlechte Gewohnheiten bewusst umständlich machen.",
  "Energy Cut-Off: Nach einer Uhrzeit keine anspruchsvollen Aufgaben mehr starten.",
  "Stop-Rule: Klar definieren, wann genug ist, statt endlos zu optimieren.",
    ],
    p: "Sehr systemisch und nachhaltig",
    c: "Zu hohe Standards brechen Konsistenz"
  }

  ],
  off: [
{
  n: "Nervensystemregulation",
  z: "Off",
  v: "Vom Leistungs- in den Erholungsmodus wechseln.",
  d: "Methoden, die dem Körper Sicherheit signalisieren und Stressreaktionen herunterfahren.",
  h: "Abends Struktur statt Disziplin. Gleiche Signale jeden Tag.",
  e: [
    "Abend-Routine: Fester Ablauf (Licht runter, ruhige Tätigkeiten, gleiche Uhrzeit).",
    "Digital Curfew: Bildschirme 60–90 Minuten vor dem Schlafen bewusst beenden.",
    "Licht-Dimming: Abends warmes, gedimmtes Licht als biologisches Shutdown-Signal.",
    "Physiologischer Seufzer: Zwei kurze Nasenatemzüge + langer Ausatem zur schnellen Beruhigung.",
    "Langer Ausatem (4–6): Ausatmen länger als Einatmen, um das parasympathische System zu aktivieren.",
    "Consistent Sleep Window: Feste Schlaf- und Aufstehzeit statt variabler Einschlafversuche."
  ],
  p: "Stärkster Hebel für Schlaf & Erholung",
  c: "Abendliche Reizüberflutung sabotiert Wirkung"
},

/* =========================
   OFF – REGENERATION
========================= */

{
  n: "Regeneration",
  z: "Off",
  v: "Energie wieder aufladen ohne neue Belastung.",
  d: "Regeneration heißt Nervensystem entlasten – nicht optimieren oder pushen.",
  h: "Low Intensity, kein Leistungsanspruch.",
  e: [
    "Aktive Erholung: Lockere Bewegung ohne Ziel (Spaziergang, Mobility, leichtes Radeln).",
    "NSDR / Powernap: 10–20 Minuten Tiefenentspannung oder kurzer Schlaf mit Timer.",
    "Midday Reset: Kurze Regenerationspause zwischen zwei Belastungsblöcken.",
    "Passive Recovery Slots: Bewusst nichts tun – kein Input, kein Scrollen.",
    "Deload / Entlastungswoche: Alle 4–6 Wochen Volumen und Intensität reduzieren.",
    "Sleep Extension Days: Einzelne Tage gezielt länger schlafen, um Defizite auszugleichen."
  ],
  p: "Sofort spürbar + langfristig stabilisierend",
  c: "Wird oft mit Faulheit verwechselt"
},

/* =========================
   OFF – RESILIENZ
========================= */

{
  n: "Resilienz",
  z: "Off",
  v: "Belastbar bleiben, ohne härter zu werden.",
  d: "Resilienz entsteht durch Regulation, Grenzen und sauberes Wiederhochfahren.",
  h: "Erst Sicherheit herstellen, dann fordern.",
  e: [
    "Grenzen setzen (Nein sagen): Klare Regeln zum Schutz von Energie und Erholung definieren.",
    "Selbstmitgefühl (MSC): In Stressmomenten bewusst freundlich mit sich sprechen.",
    "Fight–Flight–Freeze-Check: Eigenes Stressmuster erkennen und benennen.",
    "Bounce-Back-Ritual: Nach Rückschlägen sofort zur kleinsten stabilen Routine zurückkehren.",
    "Failure Resume: Rückschläge sammeln + jeweiliges Learning dokumentieren.",
    "Stress dosieren: Kleine, kontrollierte Belastungen statt Dauerstress."
  ],
  p: "Sehr starker Schutz vor Erschöpfung",
  c: "Ego verwechselt Resilienz mit Härte"
},

/* =========================
   OFF – ACHTSAMKEIT & REFLEXION
========================= */

{
  n: "Achtsamkeit & Reflexion",
  z: "Off",
  v: "Mentale Weite, Präsenz und emotionale Stabilität.",
  d: "Achtsamkeit reduziert Reizüberlastung und verbessert Selbstwahrnehmung.",
  h: "Kurz, regelmäßig, ohne Leistungsanspruch.",
  e: [
    "Naturmoment: 10–20 Minuten draußen ohne Handy, Musik oder Podcast.",
    "Gratitude Journal: Täglich 3 Dinge notieren und kurz fühlen.",
    "Body Scan: Aufmerksamkeit langsam durch den Körper wandern lassen.",
    "Emotion Labeling: Gefühle benennen („Ich spüre Anspannung“), ohne sie zu bewerten.",
    "Mindful Transition: Kurze Pause zwischen zwei Aktivitäten bewusst wahrnehmen.",
    "Evening Reflection Light: 1 Frage am Abend („Was darf heute enden?“)."
  ],
  p: "Sehr zugänglich, große Wirkung",
  c: "Wird im Stress zuerst gestrichen"
},
  ]
};



// ===============================
// UI: PILLARS RENDER
// ===============================
function renderPillars() {
  const grid = safeGetElement("pillar-grid");
  if (!grid) return;

  // Validierung: Prüfe ob pillarsData existiert und Array ist
  if (!Array.isArray(pillarsData) || pillarsData.length === 0) {
    console.warn('renderPillars: pillarsData ist kein Array oder leer.');
    grid.innerHTML = '<div class="col-span-2 card" style="padding: var(--space-4); text-align: left; color: var(--text-muted);">Keine Pillar-Daten verfügbar.</div>';
    return;
  }

  // Finde aktiven Index basierend auf activePillarTab
  const activeIndex = pillarsData.findIndex(p => p && p.k === activePillarTab);

  // Render mit Error-Handling und XSS-Schutz
  try {
    grid.innerHTML = pillarsData.map((p, i) => {
      if (!p) return '';
      
      // Fallback-Werte für fehlende Properties mit XSS-Schutz
      const tag = (p.tag) ? escapeHtml(String(p.tag)) : '';
      const title = (p.t) ? escapeHtml(String(p.t)) : '';
      const icon = (p.icon) ? escapeHtml(String(p.icon)) : '';
      const lvl = (p.lvl) ? escapeHtml(String(p.lvl)) : '';
      const isActive = i === activeIndex;
      const activeClass = isActive ? 'pillar-card-active' : '';
      
      return `
<div data-pillar-key="${escapeHtml(String(p.k || ''))}"
     data-pillar-index="${i}"
     onclick="setPillarTab('${p.k ? p.k.replace(/'/g, "\\'") : ''}')"
     class="card pillar-card ${activeClass}"
     role="button"
     tabindex="0"
     style="cursor: pointer; transition: all 0.15s ease; padding: var(--space-5); display: flex; flex-direction: column; gap: var(--space-3); min-height: 140px;">
  <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-3);">
    <div style="flex: 1;">
      <div class="badge-label" style="margin-bottom: var(--space-2);">${tag}</div>
      <h4 style="font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: var(--space-1);">${title}</h4>
      <p class="text-secondary" style="font-size: 13px; line-height: 1.4;">${lvl}</p>
    </div>
    <div style="width: 48px; height: 48px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; background: var(--primary-light); color: var(--accent); font-weight: 800; font-size: 20px; flex-shrink: 0;">
      ${icon}
    </div>
  </div>
</div>
      `;
    }).filter(html => html !== '').join("");
  } catch (error) {
    console.error('Fehler beim Rendern der Pillars:', error);
    grid.innerHTML = '<div class="col-span-2 card" style="padding: var(--space-4); text-align: left; color: #f43f5e;">Fehler beim Laden der Pillars.</div>';
  }
}

function updatePillar(index) {
  // Validierung: Prüfe ob Index und Daten existieren
  if (!Array.isArray(pillarsData) || index < 0 || index >= pillarsData.length) {
    console.warn(`updatePillar: Ungültiger Index ${index} oder pillarsData-Array nicht verfügbar.`);
    return;
  }
  
  const p = pillarsData[index];
  if (!p) {
    console.warn(`updatePillar: Pillar bei Index ${index} ist undefined.`);
    return;
  }

  // Helper-Funktion für sichere Text-Setzung
  const setText = (id, val) => {
    const el = safeGetElement(id);
    if (el) el.textContent = val || '';
  };

  // Setze alle Text-Inhalte
  setText("pillar-icon", p.icon);
  setText("pillar-title", p.t);
  setText("pillar-level", p.lvl);
  setText("pillar-desc", p.d);
  setText("pillar-signs", p.signs);
  setText("pillar-pitfall", p.pitfall);
  setText("pillar-next", p.next);
  setText("methods-pillar-label", p.t);

    // Aktualisiere visuelle Auswahl-Markierung mit Error-Handling und sicheren Selektoren
    try {
        const pillarElements = safeQuerySelectorAll("[data-pillar-index]");
        if (pillarElements.length > 0) {
            pillarElements.forEach(el => {
                if (el && typeof el.dataset !== 'undefined' && typeof el.classList !== 'undefined') {
                    const pillarIndex = el.dataset.pillarIndex;
                    const isActive = (pillarIndex !== undefined && Number(pillarIndex) === index);
                    el.classList.toggle("ring-2", isActive);
                    el.classList.toggle("ring-amber-500", isActive);
                }
            });
        } else {
            console.warn(`updatePillar: Keine Pillar-Elemente mit data-pillar-index gefunden für Index ${index}.`);
        }
    } catch (error) {
        console.error('Fehler bei Pillar-Auswahl-Update in updatePillar:', error);
    }
}

// ===============================
// RENDER LOOP TABS
// ===============================
function renderLoopTabs() {
  const tablist = safeGetElement('loop-tabs');
  if (!tablist) {
    console.warn('renderLoopTabs: loop-tabs Element nicht gefunden.');
    return;
  }
  
  // Validierung: Prüfe ob pillarsData existiert
  if (!Array.isArray(pillarsData) || pillarsData.length === 0) {
    console.warn('renderLoopTabs: pillarsData ist kein Array oder leer.');
    tablist.innerHTML = '';
    return;
  }
  
  try {
    const tabsHTML = pillarsData.map((p, i) => {
      if (!p || !p.k || !p.t) return '';
      
      const safeKey = escapeHtml(String(p.k));
      const safeTitle = escapeHtml(String(p.t));
      const isActive = i === 0; // Load ist default
      
      return `
        <button
          type="button"
          data-loop-tab="${safeKey}"
          onclick="setLoopTab('${safeKey}')"
          role="tab"
          aria-selected="${isActive ? 'true' : 'false'}"
          tabindex="${isActive ? '0' : '-1'}"
          class="${isActive ? 'active' : ''}"
          onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();setLoopTab('${safeKey}')}"
        >
          ${safeTitle}
        </button>
      `;
    }).filter(html => html !== '').join('');
    
    tablist.innerHTML = tabsHTML;
    
    // Initialisiere ersten Tab
    if (pillarsData.length > 0 && pillarsData[0].k) {
      setLoopTab(pillarsData[0].k);
    }
  } catch (error) {
    console.error('Fehler beim Rendern der Loop-Tabs:', error);
    tablist.innerHTML = '';
  }
}

// ===============================
// SET LOOP TAB
// ===============================
function setLoopTab(key) {
  // Vibration für App-Gefühl
  vibrate(5);
  
  // Validierung
  if (!key) {
    console.warn('setLoopTab: key fehlt.');
    return;
  }
  
  // Finde Pillar-Daten
  const pillar = pillarsData.find(p => p && p.k === key);
  if (!pillar) {
    console.warn(`setLoopTab: Pillar mit Key "${key}" nicht gefunden.`);
    return;
  }
  
  // Update Tab-Buttons
  try {
    const tabButtons = safeQuerySelectorAll('[data-loop-tab]');
    tabButtons.forEach(btn => {
      if (btn && btn.dataset.loopTab === key) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        btn.setAttribute('tabindex', '0');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
      }
    });
  } catch (error) {
    console.error('Fehler bei Tab-Button-Update in setLoopTab:', error);
  }
  
  // Rendere Content
  renderLoopContent(key);
}

// ===============================
// RENDER LOOP CONTENT
// ===============================
function renderLoopContent(key) {
  const content = safeGetElement('loop-content');
  if (!content) {
    console.warn('renderLoopContent: loop-content Element nicht gefunden.');
    return;
  }
  
  // Finde Pillar-Daten
  const pillar = pillarsData.find(p => p && p.k === key);
  if (!pillar) {
    console.warn(`renderLoopContent: Pillar mit Key "${key}" nicht gefunden.`);
    content.innerHTML = '<p class="text-secondary">Content nicht verfügbar.</p>';
    return;
  }
  
  // Validierung: Prüfe ob methodsData existiert
  if (!methodsData || typeof methodsData !== 'object') {
    console.warn('renderLoopContent: methodsData ist kein Objekt oder nicht verfügbar.');
    content.innerHTML = '<p class="text-secondary">Methoden-Daten nicht verfügbar.</p>';
    return;
  }
  
  const methods = methodsData[key] || [];
  const safePillarDesc = (pillar.d) ? escapeHtml(String(pillar.d)) : '';
  
  // Rendere Methods (immer vertikal als Liste)
  let methodsHTML = '';
  
  if (Array.isArray(methods) && methods.length > 0) {
    try {
      methodsHTML = methods.map((m, index) => {
        if (!m) return '';
        
        const safeKey = escapeHtml(String(key));
        const safeName = (m.n) ? escapeHtml(String(m.n)) : '';
        const safeMethodDesc = (m.d) ? escapeHtml(String(m.d)) : '';
        
        // 1-liner: Erste ~80 Zeichen der Beschreibung
        const oneliner = safeMethodDesc.length > 80 ? safeMethodDesc.substring(0, 80).replace(/\s+\S*$/, '') + '...' : safeMethodDesc;
        
        return `
          <div class="card method-card"
               onclick="openMethodModal('${safeKey}', ${index})"
               role="button" tabindex="0"
               style="cursor: pointer; transition: all 0.15s ease; padding: var(--space-4);"
               onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openMethodModal('${safeKey}', ${index})}">
            <h4 style="font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: var(--space-2); line-height: 1.3;">${safeName}</h4>
            <p class="text-secondary" style="font-size: 14px; line-height: 1.5; margin: 0;">${oneliner}</p>
          </div>
        `;
      }).filter(html => html !== '').join('');
    } catch (error) {
      console.error('Fehler beim Rendern der Methoden:', error);
      methodsHTML = '<p class="text-secondary">Fehler beim Laden der Methoden.</p>';
    }
  } else {
    methodsHTML = '<p class="text-secondary">Keine Methoden verfügbar.</p>';
  }
  
  // Container für Methods (immer vertikal als Liste)
  const methodsContainerClass = 'stack';
  
  // Rendere Content
  content.innerHTML = `
    <div>
      <p class="text-secondary" style="font-size: 14px; line-height: 1.6; margin-bottom: var(--space-5);">
        ${safePillarDesc}
      </p>
    </div>
    
    <div>
      <div class="section-label" style="margin-bottom: var(--space-3);">Methoden</div>
      <div class="${methodsContainerClass}">
        ${methodsHTML}
      </div>
    </div>
  `;
}

// ===============================
// UI: METHODS GRID (Legacy - für Kompatibilität)
// ===============================
function updateMethods(key) {
  const grid = safeGetElement("method-grid");
  if (!grid) return;

  // Validierung: Prüfe ob methodsData existiert
  if (!methodsData || typeof methodsData !== 'object') {
    console.warn('updateMethods: methodsData ist kein Objekt oder nicht verfügbar.');
    grid.innerHTML = '<div class="app-card" style="grid-column: 1 / -1; padding: var(--spacing-md); text-align: center; color: var(--app-text-muted);">Keine Methoden-Daten verfügbar.</div>';
    return;
  }

  const methods = methodsData[key] || [];
  if (!Array.isArray(methods) || methods.length === 0) {
    const safeKey = (key) ? escapeHtml(String(key)) : 'unbekannt';
    grid.innerHTML = `
      <div class="app-card" style="grid-column: 1 / -1; padding: var(--spacing-md); text-align: center; color: var(--app-text-muted);">
        Keine Methoden für <strong style="color: var(--app-text);">${safeKey}</strong> gefunden (prüfe methodsData Keys).
      </div>`;
    return;
  }

  // Render mit Error-Handling - 2-spaltiges Grid (desktop) / 1-spaltig (mobile) mit Name + 1-liner
  try {
    grid.innerHTML = methods.map((m, index) => {
      if (!m) {
        console.warn('updateMethods: Methode ist undefined, überspringe.');
        return '';
      }
      
      // XSS-Schutz: Escape alle Werte konsistent mit escapeHtml()
      const safeKey = (key) ? escapeHtml(String(key)) : "";
      const safeName = (m.n) ? escapeHtml(String(m.n)) : "";
      const safeDesc = (m.d) ? escapeHtml(String(m.d)) : "";
      
      // 1-liner: Erste ~80 Zeichen der Beschreibung
      const oneliner = safeDesc.length > 80 ? safeDesc.substring(0, 80).replace(/\s+\S*$/, '') + '...' : safeDesc;
      
      return `
<div class="card method-card"
     onclick="openMethodModal('${safeKey}', ${index})"
     role="button" tabindex="0"
     style="cursor: pointer; transition: all 0.15s ease; padding: var(--space-4);"
     onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openMethodModal('${safeKey}', ${index})}">
  <h4 style="font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: var(--space-2); line-height: 1.3;">${safeName}</h4>
  <p class="text-secondary" style="font-size: 14px; line-height: 1.5; margin: 0;">${oneliner}</p>
</div>
      `;
    }).filter(html => html !== '').join("");
  } catch (error) {
    console.error('Fehler beim Rendern der Methoden:', error);
    grid.innerHTML = '<div class="card" style="grid-column: 1 / -1; padding: var(--space-4); text-align: center; color: #f43f5e;">Fehler beim Laden der Methoden.</div>';
  }
}

// ===============================
// OPEN BOTTOM SHEET (Generic)
// ===============================
function openBottomSheet({ category, title, subtitle, sections }) {
  // Vibration für App-Gefühl
  vibrate(5);
  
  // Validierung
  if (!title) {
    console.warn('openBottomSheet: title fehlt.');
    return;
  }
  
  // Finde Bottom-Sheet
  const bottomSheet = safeGetElement('method-modal');
  if (!bottomSheet) {
    console.error('openBottomSheet: method-modal Element nicht gefunden.');
    return;
  }
  
  // Finde Content-Container
  const content = safeQuerySelector('.bottom-sheet__content', bottomSheet);
  if (!content) {
    console.error('openBottomSheet: .bottom-sheet__content nicht gefunden.');
    return;
  }
  
  // XSS-Schutz: Escape alle Werte
  const safeCategory = (category) ? escapeHtml(String(category)) : '';
  const safeTitle = escapeHtml(String(title));
  const safeSubtitle = (subtitle) ? escapeHtml(String(subtitle)) : '';
  
  // Rendere Sections
  let sectionsHTML = '';
  if (Array.isArray(sections) && sections.length > 0) {
    sectionsHTML = sections.map(section => {
      if (!section || !section.label || !section.text) return '';
      
      const safeLabel = escapeHtml(String(section.label));
      const safeText = escapeHtml(String(section.text));
      
      // Bestimme Icon und Label-Style basierend auf key
      let iconSVG = '';
      let labelClass = 'detail-row__label';
      
      if (section.k === 'error') {
        iconSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
        labelClass = 'detail-row__label detail-row__label--error';
      } else if (section.k === 'help') {
        iconSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        labelClass = 'detail-row__label detail-row__label--accent';
      } else {
        iconSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg>';
      }
      
      return `
        <div class="detail-row">
          <div class="detail-row__icon">
            ${iconSVG}
          </div>
          <div class="detail-row__content">
            <span class="${labelClass}">${safeLabel}</span>
            <p class="detail-row__text">${safeText}</p>
          </div>
        </div>
      `;
    }).filter(html => html !== '').join('');
  }
  
  // Rendere Content in Bottom-Sheet
  content.innerHTML = `
    <button type="button"
            onclick="closeModal()"
            class="bottom-sheet__close"
            aria-label="Schließen">
      ✕
    </button>

    <!-- HEADER -->
    <div class="space-y-1">
      ${safeCategory ? `
      <span class="text-secondary" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 800;">
        ${safeCategory}
      </span>
      ` : ''}
      <h3 class="text-primary" style="font-size: 24px; font-weight: 800; margin-top: 8px;">
        ${safeTitle}
      </h3>
      ${safeSubtitle ? `
      <p class="text-secondary" style="margin-top: 4px;">
        ${safeSubtitle}
      </p>
      ` : ''}
    </div>

    <!-- BODY (scrollable) -->
    <div class="space-y-6" style="margin-top: 32px;">
      ${sectionsHTML}
    </div>
  `;
  
  // Öffne Bottom-Sheet und Backdrop
  try {
    const backdrop = document.querySelector('.bottom-sheet-backdrop');
    if (backdrop) {
      backdrop.classList.add('active');
      backdrop.setAttribute('aria-hidden', 'false');
    }
    
    bottomSheet.classList.add('open');
    bottomSheet.setAttribute('aria-hidden', 'false');
    
    // Body overflow: hidden für Bottom-Sheet
    if (document.body && typeof document.body.style !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
    
    // Scroll-Fix: Setze Scroll-Position auf 0
    if (content && typeof content.scrollTop !== 'undefined') {
      content.scrollTop = 0;
    }
  } catch (error) {
    console.error('Fehler beim Öffnen des Bottom-Sheets:', error);
    if (document.body && typeof document.body.style !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}

// ===============================
// OPEN METHOD SHEET
// ===============================
function openMethodSheet(category, index) {
  // Vibration für App-Gefühl
  vibrate(5);
  
  // Validierung: Prüfe ob Parameter existieren
  if (!category || typeof index !== 'number' || index < 0) {
    console.warn(`openMethodSheet: Ungültige Parameter category="${category}" oder index=${index}.`);
    return;
  }
  
  // Validierung: Prüfe ob methodsData existiert
  if (!methodsData || typeof methodsData[category] === 'undefined') {
    console.warn(`openMethodSheet: Kategorie "${category}" nicht in methodsData gefunden.`);
    return;
  }
  
  const list = methodsData[category] || [];
  if (!Array.isArray(list) || index >= list.length) {
    console.warn(`openMethodSheet: Index ${index} außerhalb des Arrays oder Liste leer.`);
    return;
  }
  
  const m = list[index];
  if (!m) {
    console.warn(`openMethodSheet: Methode bei Index ${index} ist undefined.`);
    return;
  }

  // Finde Bottom-Sheet
  const bottomSheet = safeGetElement('method-modal');
  if (!bottomSheet) {
    console.error('openMethodSheet: method-modal Element nicht gefunden.');
    return;
  }

  // Finde Content-Container
  const content = safeQuerySelector('.bottom-sheet__content', bottomSheet);
  if (!content) {
    console.error('openMethodSheet: .bottom-sheet__content nicht gefunden.');
    return;
  }

  // XSS-Schutz: Escape alle Werte
  const safeName = (m.n) ? escapeHtml(String(m.n)) : '';
  const safeDesc = (m.d) ? escapeHtml(String(m.d)) : '';
  const safeHow = (m.h) ? escapeHtml(String(m.h)) : '';
  const safePro = (m.p) ? escapeHtml(String(m.p)) : '';
  const safeVision = (m.v) ? escapeHtml(String(m.v)) : '';
  const safeContra = (m.c) ? escapeHtml(String(m.c)) : '';
  
  // Category label (from category key)
  const categoryLabels = {
    'load': 'Load',
    'output': 'Output',
    'off': 'Off',
    'progress': 'Progress'
  };
  const safeCategory = categoryLabels[category] || category || '';

  // Rendere Praxis/Beispiel (e) als vertikale Liste mit Dividern
  let praxisHTML = '';
  if (Array.isArray(m.e) && m.e.length > 0) {
    const items = m.e.map((item, index) => {
      const text = String(item || "");
      const parts = text.split(':');
      const title = parts.shift()?.trim() || "";
      const rest = parts.join(':').trim();
      const escapedTitle = escapeHtml(title);
      const escapedRest = escapeHtml(rest);
      
      let itemHTML = '';
      if (title && rest) {
        itemHTML = `
          <div class="practice-item">
            <div class="text-primary" style="font-weight: 700; font-size: 14px; margin-bottom: var(--space-1);">${escapedTitle}</div>
            <div class="text-secondary" style="font-size: 14px; line-height: 1.6;">${escapedRest}</div>
          </div>
        `;
      } else {
        itemHTML = `
          <div class="practice-item">
            <div class="text-secondary" style="font-size: 14px; line-height: 1.6;">${escapeHtml(text)}</div>
          </div>
        `;
      }
      
      // Divider nach jedem Item außer dem letzten
      if (index < m.e.length - 1) {
        itemHTML += '<div class="divider"></div>';
      }
      
      return itemHTML;
    }).join('');
    
    praxisHTML = `<div class="practice-list">${items}</div>`;
  } else if (typeof m.e === "string" && m.e.trim()) {
    praxisHTML = `<p class="detail-row__text">${escapeHtml(m.e)}</p>`;
  }

  // Rendere Content in Bottom-Sheet - Strukturierte Sections
  content.innerHTML = `
    <button type="button"
            onclick="closeModal()"
            class="bottom-sheet__close"
            aria-label="Schließen">
      ✕
    </button>

    <!-- HEADER -->
    <div class="bottom-sheet__header space-y-1">
      ${safeCategory ? `
      <span class="text-secondary" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 800;">
        ${escapeHtml(safeCategory)}
      </span>
      ` : ''}
      <h3 class="bottom-sheet__title text-primary">
        ${safeName}
      </h3>
      ${safeDesc ? `
      <p class="bottom-sheet__description text-secondary">
        ${safeDesc}
      </p>
      ` : ''}
    </div>

    <!-- BODY (scrollable) -->
    <div class="bottom-sheet__body">
      <div class="space-y-6">
      ${safeHow ? `
      <div class="sheet-section">
        <div class="detail-row">
          <div class="detail-row__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4M12 8h.01"></path>
            </svg>
          </div>
          <div class="detail-row__content">
            <span class="detail-row__label">Warum das wirkt</span>
            <p class="detail-row__text">${safeHow}</p>
          </div>
        </div>
      </div>
      ` : ''}

      ${safePro || safeVision ? `
      <div class="sheet-section">
        <div class="detail-row">
          <div class="detail-row__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="detail-row__content">
            <span class="detail-row__label detail-row__label--accent">Nutzen</span>
            <p class="detail-row__text">${safePro || safeVision}</p>
          </div>
        </div>
      </div>
      ` : ''}

      ${safeContra ? `
      <div class="sheet-section">
        <div class="detail-row">
          <div class="detail-row__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div class="detail-row__content">
            <span class="detail-row__label detail-row__label--error">Typischer Fehler</span>
            <p class="detail-row__text">${safeContra}</p>
          </div>
        </div>
      </div>
      ` : ''}

      ${praxisHTML ? `
      <div class="sheet-section">
        <div class="detail-row">
          <div class="detail-row__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div class="detail-row__content">
            <span class="detail-row__label">Praxis / Beispiel</span>
            ${praxisHTML}
          </div>
        </div>
      </div>
      ` : ''}

      ${Array.isArray(m.research) && m.research.length > 0 ? renderResearchWithToggle(m.research, `${category}-${index}`) : ''}
      </div>
    </div>
  `;

  // Öffne Bottom-Sheet und Backdrop
  try {
    const backdrop = document.querySelector('.bottom-sheet-backdrop');
    if (backdrop) {
      backdrop.classList.add('active');
      backdrop.setAttribute('aria-hidden', 'false');
    }
    
    bottomSheet.classList.add('open');
    bottomSheet.setAttribute('aria-hidden', 'false');
    
    // Body overflow: hidden für Bottom-Sheet
    if (document.body && typeof document.body.style !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }

    // Scroll-Fix: Setze Scroll-Position auf 0
    if (content && typeof content.scrollTop !== 'undefined') {
      content.scrollTop = 0;
    }
  } catch (error) {
    console.error('Fehler beim Öffnen des Bottom-Sheets:', error);
    if (document.body && typeof document.body.style !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}

// ===============================
// OPEN PHASE SHEET
// ===============================
function openPhaseSheet(index) {
  // Vibration für App-Gefühl
  vibrate(5);
  
  // Validierung: Prüfe ob Parameter existieren
  if (typeof index !== 'number' || index < 0) {
    console.warn(`openPhaseSheet: Ungültiger Index ${index}.`);
    return;
  }
  
  // Validierung: Prüfe ob phasesData existiert
  if (!Array.isArray(phasesData) || index >= phasesData.length) {
    console.warn(`openPhaseSheet: Index ${index} außerhalb des phasesData-Arrays.`);
    return;
  }
  
  const p = phasesData[index];
  if (!p) {
    console.warn(`openPhaseSheet: Phase bei Index ${index} ist undefined.`);
    return;
  }
  
  // Finde Bottom-Sheet
  const bottomSheet = safeGetElement('method-modal');
  if (!bottomSheet) {
    console.error('openPhaseSheet: method-modal Element nicht gefunden.');
    return;
  }
  
  // Finde Content-Container
  const content = safeQuerySelector('.bottom-sheet__content', bottomSheet);
  if (!content) {
    console.error('openPhaseSheet: .bottom-sheet__content nicht gefunden.');
    return;
  }
  
  // XSS-Schutz: Escape alle Werte
  const safeKicker = (p.m) ? escapeHtml(String(p.m)) : '';
  const safeTitle = (p.n) ? escapeHtml(String(p.n)) : '';
  const safeDesc = (p.d) ? escapeHtml(String(p.d)) : '';
  
  // Rendere Verlauf-Liste aus val-Objekt (mit stabilem Mapping)
  let verlaufHTML = '';
  if (p.val && typeof p.val === 'object') {
    const verlaufItems = CHART_DATASET_ORDER.map(key => {
      const config = CHART_DATASET_CONFIG[key];
      if (!config || p.val[key] === undefined) return '';
      
      const safeLabel = escapeHtml(String(config.label));
      const safeVal = escapeHtml(String(p.val[key] || 0));
      return `<li style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-2) 0; border-bottom: 1px solid var(--border);">
        <span class="text-secondary" style="font-size: 14px;">${safeLabel}</span>
        <span class="text-primary" style="font-size: 14px; font-weight: 600;">${safeVal}</span>
      </li>`;
    }).filter(item => item !== '').join('');
    
    if (verlaufItems) {
      verlaufHTML = `
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${verlaufItems}
        </ul>
      `;
    }
  }
  
  // Rendere Content in Bottom-Sheet
  content.innerHTML = `
    <button type="button"
            onclick="closeModal()"
            class="bottom-sheet__close"
            aria-label="Schließen">
      ✕
    </button>

    <!-- HEADER -->
    <div class="space-y-1">
      <span class="text-secondary" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 800;">
        ${safeKicker}
      </span>
      <h3 class="bottom-sheet__title text-primary">
        ${safeTitle}
      </h3>
      <p class="bottom-sheet__description text-secondary">
        Tal der Wiederholung
      </p>
    </div>

    <!-- BODY (scrollable) -->
    <div class="bottom-sheet__body">
      <div class="space-y-6">
      ${safeDesc ? `
      <div class="sheet-section">
        <div class="sheet-label">Beschreibung</div>
        <p class="detail-row__text">${safeDesc}</p>
      </div>
      ` : ''}

      ${verlaufHTML ? `
      <div class="sheet-section">
        <div class="sheet-label">Verlauf</div>
        ${verlaufHTML}
      </div>
      ` : ''}
      </div>
    </div>
  `;
  
  // Öffne Bottom-Sheet und Backdrop
  try {
    const backdrop = document.querySelector('.bottom-sheet-backdrop');
    if (backdrop) {
      backdrop.classList.add('active');
      backdrop.setAttribute('aria-hidden', 'false');
    }
    
    bottomSheet.classList.add('open');
    bottomSheet.setAttribute('aria-hidden', 'false');
    
    // Body overflow: hidden für Bottom-Sheet
    if (document.body && typeof document.body.style !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
    
    // Scroll-Fix: Setze Scroll-Position auf 0
    if (content && typeof content.scrollTop !== 'undefined') {
      content.scrollTop = 0;
    }
  } catch (error) {
    console.error('Fehler beim Öffnen des Bottom-Sheets:', error);
    if (document.body && typeof document.body.style !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}

// ===============================
// RENDER RESEARCH LIST
// ===============================
/**
 * Render Research List as structured UI
 * @param {Array<string>|undefined} items - Array of research items
 * @returns {string} HTML string for research section, or empty string if no items
 */
function renderResearchList(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return '';
  }

  const listItemsHTML = items
    .map((item) => {
      if (!item) return '';
      
      // Bereinige den String: Entferne führende Bullet-Zeichen (•, -, –, *) und Whitespace
      let cleanItem = String(item).trim();
      // Entferne führende Bullets: •, -, –, *, etc.
      cleanItem = cleanItem.replace(/^[\u2022\u2023\u25E6\u2043\u2219\-\–\—\*•]\s*/, '');
      // Entferne auch weitere Whitespace nach dem Bullet
      cleanItem = cleanItem.trim();
      
      const safeItem = escapeHtml(cleanItem);
      
      // Rendere als <li> ohne Bullet
      return `<li class="list-item" style="list-style: none;">${safeItem}</li>`;
    })
    .filter((html) => html !== '')
    .join('');

  if (!listItemsHTML) {
    return '';
  }

  return `
    <div class="sheet-section">
      <div class="sheet-label">Research</div>
      <ul class="list" style="list-style: none; padding: 0; margin: 0;">
        ${listItemsHTML}
      </ul>
    </div>
  `;
}

// ===============================
// RENDER RESEARCH WITH TOGGLE (for Methods)
// ===============================
/**
 * Render Research List with Toggle for Method Details
 * @param {Array<string>|undefined} items - Array of research items
 * @param {string} uniqueId - Unique ID for this toggle instance
 * @returns {string} HTML string for research section with toggle, or empty string if no items
 */
function renderResearchWithToggle(items, uniqueId) {
  if (!Array.isArray(items) || items.length === 0) {
    return '';
  }

  const listItemsHTML = items
    .map((item) => {
      if (!item) return '';
      
      // Bereinige den String: Entferne führende Bullet-Zeichen
      let cleanItem = String(item).trim();
      cleanItem = cleanItem.replace(/^[\u2022\u2023\u25E6\u2043\u2219\-\–\—\*•]\s*/, '');
      cleanItem = cleanItem.trim();
      
      const safeItem = escapeHtml(cleanItem);
      
      return `<li class="research-list__item">${safeItem}</li>`;
    })
    .filter((html) => html !== '')
    .join('');

  if (!listItemsHTML) {
    return '';
  }

  const toggleId = `research-toggle-${uniqueId}`;
  const contentId = `research-content-${uniqueId}`;
  
  // Escape toggleId and contentId for safe use in onclick
  const safeToggleId = escapeHtml(toggleId);
  const safeContentId = escapeHtml(contentId);

  return `
    <div class="sheet-section research-toggle-section">
      <button type="button" 
              class="research-toggle js-research-toggle" 
              id="${safeToggleId}"
              aria-expanded="false" 
              aria-controls="${safeContentId}"
              onclick="toggleResearch('${safeToggleId}', '${safeContentId}')">
        Warum ist das so?
      </button>
      <div class="research-toggle__content" 
           id="${safeContentId}" 
           hidden>
        <ul class="research-list">
          ${listItemsHTML}
        </ul>
      </div>
    </div>
  `;
}

// ===============================
// OPEN STEP SHEET
// ===============================
function openStepSheet(index) {
  // Vibration für App-Gefühl
  vibrate(5);
  
  // Validierung: Prüfe ob Parameter existieren
  if (typeof index !== 'number' || index < 0) {
    console.warn(`openStepSheet: Ungültiger Index ${index}.`);
    return;
  }
  
  // Validierung: Prüfe ob steps-Array existiert
  if (!Array.isArray(steps) || index >= steps.length) {
    console.warn(`openStepSheet: Index ${index} außerhalb des steps-Arrays.`);
    return;
  }
  
  const s = steps[index];
  if (!s) {
    console.warn(`openStepSheet: Schritt bei Index ${index} ist undefined.`);
    return;
  }
  
  // Finde Bottom-Sheet
  const bottomSheet = safeGetElement('method-modal');
  if (!bottomSheet) {
    console.error('openStepSheet: method-modal Element nicht gefunden.');
    return;
  }
  
  // Finde Content-Container
  const content = safeQuerySelector('.bottom-sheet__content', bottomSheet);
  if (!content) {
    console.error('openStepSheet: .bottom-sheet__content nicht gefunden.');
    return;
  }
  
  // XSS-Schutz: Escape alle Werte
  const safeTitle = (s.t) ? escapeHtml(String(s.t)) : '';
  const safeDesc = (s.d) ? escapeHtml(String(s.d)) : '';
  const safeSource = (s.s) ? escapeHtml(String(s.s)) : '';
  const safeRole = (s.r) ? escapeHtml(String(s.r)) : '';
  
  // Rendere Research-Liste
  const researchHTML = renderResearchList(s.research);
  
  // Rendere Content in Bottom-Sheet
  content.innerHTML = `
    <button type="button"
            onclick="closeModal()"
            class="bottom-sheet__close"
            aria-label="Schließen">
      ✕
    </button>

    <!-- HEADER -->
    <div class="space-y-1">
      <span class="text-secondary" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 800;">
        Phase ${index + 1}
      </span>
      <h3 class="bottom-sheet__title text-primary">
        ${safeTitle}
      </h3>
    </div>

    <!-- BODY (scrollable) -->
    <div class="bottom-sheet__body">
      <div class="space-y-6">
      ${safeDesc ? `
      <div class="sheet-section">
        <div class="sheet-label">Beschreibung</div>
        <p class="detail-row__text">${safeDesc}</p>
      </div>
      ` : ''}

      ${safeSource ? `
      <div class="sheet-section">
        <div class="sheet-label text-accent">Schlüsselfaktor</div>
        <p class="detail-row__text">${safeSource}</p>
      </div>
      ` : ''}

      ${safeRole ? `
      <div class="sheet-section">
        <div class="sheet-label" style="color: #f43f5e;">Rolle</div>
        <p class="detail-row__text">${safeRole}</p>
      </div>
      ` : ''}

      ${researchHTML}
      </div>
    </div>
  `;
  
  // Öffne Bottom-Sheet und Backdrop
  try {
    const backdrop = document.querySelector('.bottom-sheet-backdrop');
    if (backdrop) {
      backdrop.classList.add('active');
      backdrop.setAttribute('aria-hidden', 'false');
    }
    
    bottomSheet.classList.add('open');
    bottomSheet.setAttribute('aria-hidden', 'false');
    
    // Body overflow: hidden für Bottom-Sheet
    if (document.body && typeof document.body.style !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
    
    // Scroll-Fix: Setze Scroll-Position auf 0
    if (content && typeof content.scrollTop !== 'undefined') {
      content.scrollTop = 0;
    }
  } catch (error) {
    console.error('Fehler beim Öffnen des Bottom-Sheets:', error);
    if (document.body && typeof document.body.style !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}

// Klick auf Säule => rechts + Methoden
function selectPillar(index) {
  // Vibration für App-Gefühl
  vibrate(5);
  
  // Validierung: Prüfe ob Index gültig ist
  if (typeof index !== 'number' || index < 0) {
    console.warn(`selectPillar: Ungültiger Index ${index}.`);
    return;
  }
  
  // Update Pillar (hat bereits eigene Validierung)
  updatePillar(index);
  
  // Prüfe ob pillarsData existiert und Index gültig
  if (!Array.isArray(pillarsData) || index >= pillarsData.length) {
    console.warn(`selectPillar: Index ${index} außerhalb des pillarsData-Arrays.`);
    return;
  }
  
  const p = pillarsData[index];
  if (p && p.k) {
    updateMethods(p.k);
  } else {
    console.warn(`selectPillar: Pillar bei Index ${index} hat keine 'k' Property.`);
  }
}

// renderPillars und selectPillar werden jetzt in initializeApp() aufgerufen

function updatePhaseUI(i) {
    // Chart-Update nur wenn Chart existiert und initialisiert ist
    if (window.energyChart && window.energyChart.data && window.energyChart.data.datasets && window.energyChart.data.datasets[0]) {
        try {
            window.energyChart.data.datasets[0].pointRadius = window.energyChart.data.datasets[0].data.map((_, idx) => idx === i ? 10 : 3);
            window.energyChart.update();
        } catch (error) {
            console.error('Fehler bei Chart-Update in updatePhaseUI:', error);
        }
    }
    
    // Update Phase-Button Active State
    try {
        const phaseButtons = safeQuerySelectorAll('#phase-container button[data-phase-index]');
        phaseButtons.forEach((btn, idx) => {
            if (btn) {
                if (idx === i) {
                    btn.classList.add('active');
                    btn.setAttribute('aria-selected', 'true');
                } else {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                }
            }
        });
    } catch (error) {
        console.error('Fehler bei Phase-Button-Update in updatePhaseUI:', error);
    }
}

// ===============================
// TRAP TOGGLE (Exkurs)
// ===============================
// ===============================
// SET METHODS TAB
// ===============================
function setMethodsTab(tabName) {
    // Vibration für App-Gefühl
    vibrate(5);
    
    // Validierung
    if (tabName !== 'methods' && tabName !== 'plan') {
        console.warn('setMethodsTab: Ungültiger Tab-Name:', tabName);
        return;
    }
    
    // Finde Content-Container
    const methodsContent = safeGetElement('methods-tab-methods');
    const planContent = safeGetElement('methods-tab-plan');
    
    if (!methodsContent || !planContent) {
        console.warn('setMethodsTab: Content-Container nicht gefunden.');
        return;
    }
    
    // Update Tab-Buttons
    try {
        const tabButtons = safeQuerySelectorAll('[data-methods-tab]');
        tabButtons.forEach(btn => {
            if (btn && btn.dataset.methodsTab === tabName) {
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            }
        });
    } catch (error) {
        console.error('Fehler bei Tab-Button-Update in setMethodsTab:', error);
    }
    
    // Update Sichtbarkeit
    if (tabName === 'methods') {
        methodsContent.hidden = false;
        planContent.hidden = true;
    } else {
        methodsContent.hidden = true;
        planContent.hidden = false;
    }
}

// ===============================
// SET DAY TAB (Do / Don't)
// ===============================
function setDayTab(tabName) {
    // Vibration für App-Gefühl
    vibrate(5);
    
    // Validierung
    if (tabName !== 'do' && tabName !== 'dont') {
        console.warn('setDayTab: Ungültiger Tab-Name:', tabName);
        return;
    }
    
    // Finde Content-Container
    const doContent = safeGetElement('day-tab-do');
    const dontContent = safeGetElement('day-tab-dont');
    
    if (!doContent || !dontContent) {
        console.warn('setDayTab: Content-Container nicht gefunden.');
        return;
    }
    
    // Update Tab-Buttons
    try {
        const tabButtons = safeQuerySelectorAll('[data-day-tab]');
        tabButtons.forEach(btn => {
            if (btn && btn.dataset.dayTab === tabName) {
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                btn.setAttribute('tabindex', '0');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
                btn.setAttribute('tabindex', '-1');
            }
        });
    } catch (error) {
        console.error('Fehler bei Tab-Button-Update in setDayTab:', error);
    }
    
    // Update Sichtbarkeit
    if (tabName === 'do') {
        doContent.hidden = false;
        dontContent.hidden = true;
    } else {
        doContent.hidden = true;
        dontContent.hidden = false;
    }
}

function setTrapView(view) {
    // Vibration für App-Gefühl
    vibrate(5);
    
    const trapSuccess = safeGetElement('trap-success');
    const trapStagnation = safeGetElement('trap-stagnation');
    const toggleButtons = safeQuerySelectorAll('[data-trap-view]');
    
    if (!trapSuccess || !trapStagnation) {
        console.warn('setTrapView: Trap-Elemente nicht gefunden.');
        return;
    }
    
    // Update Toggle-Buttons
    toggleButtons.forEach(btn => {
        if (btn && btn.dataset.trapView === view) {
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        }
    });
    
    // Update Sichtbarkeit der Fallen
    if (view === 'success') {
        trapSuccess.classList.add('active');
        trapStagnation.classList.remove('active');
    } else if (view === 'stagnation') {
        trapSuccess.classList.remove('active');
        trapStagnation.classList.add('active');
    }
}

// ===============================
// FOUNDATION TAB SYSTEM
// ===============================
function setFoundationTab(tabName) {
    // Vibration für App-Gefühl
    vibrate(5);
    
    // State aktualisieren
    activeFoundationTab = tabName;
    
    // Tab-Buttons aktualisieren
    try {
        const tabButtons = safeQuerySelectorAll('[data-foundation-tab]');
        tabButtons.forEach(btn => {
            if (btn && btn.dataset.foundationTab === tabName) {
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            }
        });
    } catch (error) {
        console.error('Fehler bei Tab-Button-Update in setFoundationTab:', error);
    }
    
    // Foundation-Content rendern
    renderFoundationContent(tabName);
}

// ===============================
// RENDER FOUNDATION TABS
// ===============================
function renderFoundationGrid() {
    const tabsContainer = safeGetElement('foundation-tabs');
    if (!tabsContainer) {
        console.warn('renderFoundationGrid: foundation-tabs Element nicht gefunden.');
        return;
    }
    
    // Validierung: Prüfe ob foundationData existiert
    if (!Array.isArray(foundationData) || foundationData.length === 0) {
        console.warn('renderFoundationGrid: foundationData ist kein Array oder leer.');
        tabsContainer.innerHTML = '';
        return;
    }
    
    try {
        // Render Tabs
        tabsContainer.innerHTML = foundationData.map((f) => {
            if (!f || !f.t) return '';
            const safeTitle = escapeHtml(String(f.t));
            const isActive = activeFoundationTab === f.t;
            return `
              <button 
                type="button"
                role="tab"
                data-foundation-tab="${escapeHtml(String(f.t))}"
                aria-selected="${isActive ? 'true' : 'false'}"
                class="${isActive ? 'active' : ''}"
                onclick="setFoundationTab('${f.t.replace(/'/g, "\\'")}')"
                style="flex: 0 0 auto; min-width: fit-content;">
                ${safeTitle}
              </button>
            `;
        }).filter(html => html !== '').join('');
        
        // Render initial content
        renderFoundationContent(activeFoundationTab);
    } catch (error) {
        console.error('Fehler beim Rendern der Foundation-Tabs:', error);
        tabsContainer.innerHTML = '';
    }
}

// ===============================
// RENDER FOUNDATION CONTENT
// ===============================
function renderFoundationContent(tabName) {
    const contentContainer = safeGetElement('foundation-content');
    if (!contentContainer) {
        console.warn('renderFoundationContent: foundation-content Element nicht gefunden.');
        return;
    }
    
    // Finde das passende Foundation-Objekt
    const f = foundationData.find(item => item && item.t === tabName);
    if (!f) {
        console.warn(`renderFoundationContent: Foundation mit Titel "${tabName}" nicht gefunden.`);
        contentContainer.innerHTML = '<p class="text-secondary">Content nicht verfügbar.</p>';
        return;
    }
    
    try {
        const safeTitle = escapeHtml(String(f.t || ''));
        const safeDesc = f.d ? escapeHtml(String(f.d)) : '';
        const safePro = f.p ? escapeHtml(String(f.p)) : '';
        const safeContra = f.c ? escapeHtml(String(f.c)) : '';
        const safeExample = f.e ? escapeHtml(String(f.e)) : '';
        
        contentContainer.innerHTML = `
          <div style="padding: var(--space-5);">
            <h3 class="h3" style="margin-bottom: var(--space-4);">${safeTitle}</h3>
            ${safeDesc ? `<div style="margin-bottom: var(--space-4);"><p class="text-secondary" style="line-height: 1.6; font-size: 14px;">${safeDesc}</p></div>` : ''}
            ${safePro ? `<div style="margin-bottom: var(--space-4); padding: var(--space-4); background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; border-radius: var(--radius);"><p class="text-primary" style="font-size: 13px; font-weight: 600; margin-bottom: var(--space-1); color: #10b981;">Nutzen & Unterstützung</p><p class="text-secondary" style="font-size: 14px; line-height: 1.6;">${safePro}</p></div>` : ''}
            ${safeContra ? `<div style="margin-bottom: var(--space-4); padding: var(--space-4); background: rgba(244, 63, 94, 0.1); border-left: 3px solid #f43f5e; border-radius: var(--radius);"><p class="text-primary" style="font-size: 13px; font-weight: 600; margin-bottom: var(--space-1); color: #f43f5e;">Hindernis</p><p class="text-secondary" style="font-size: 14px; line-height: 1.6;">${safeContra}</p></div>` : ''}
            ${safeExample ? `<div style="margin-top: var(--space-6); padding: var(--space-4); background: var(--primary-light); border-radius: var(--radius);"><p class="text-primary" style="font-size: 13px; font-weight: 600; margin-bottom: var(--space-2); color: var(--accent);">Beispiel</p><p class="text-secondary" style="font-size: 14px; line-height: 1.6;">${safeExample}</p></div>` : ''}
          </div>
        `;
    } catch (error) {
        console.error('Fehler beim Rendern des Foundation-Contents:', error);
        contentContainer.innerHTML = '<p class="text-secondary">Fehler beim Laden des Contents.</p>';
    }
}

// ===============================
// OPEN FOUNDATION DETAIL
// ===============================
function openFoundationDetail(index) {
    // Vibration für App-Gefühl
    vibrate(5);
    
    // Validierung
    if (typeof index !== 'number' || index < 0 || index >= foundationData.length) {
        console.warn('openFoundationDetail: Ungültiger index.');
        return;
    }
    
    const f = foundationData[index];
    if (!f) {
        console.warn('openFoundationDetail: Foundation ist undefined.');
        return;
    }
    
    // Erstelle vollständigen Content
    const content = `
        ${f.d ? `<p style="margin-bottom: 16px; text-align: left; line-height: 1.5;"><strong>Beschreibung:</strong><br>${escapeHtml(String(f.d))}</p>` : ''}
        ${f.p ? `<p style="margin-bottom: 16px; color: #10b981; text-align: left; line-height: 1.5;"><strong>Nutzen & Unterstützung:</strong><br>${escapeHtml(String(f.p))}</p>` : ''}
        ${f.c ? `<p style="margin-bottom: 16px; color: #f43f5e; text-align: left; line-height: 1.5;"><strong>Hindernis:</strong><br>${escapeHtml(String(f.c))}</p>` : ''}
        ${f.e ? `<div class="app-card" style="background: rgba(251, 191, 36, 0.1); border-left: 4px solid var(--accent); padding: 16px; margin-top: 16px; text-align: left;"><p style="font-size: 14px; line-height: 1.5;"><strong>Praxis & Zyklus-Support:</strong><br>${escapeHtml(String(f.e))}</p></div>` : ''}
    `;
    
    // Öffne Detail-Modal
    openDetail(f.t || 'Foundation', content, 'Foundation');
}

// Legacy-Funktion für Kompatibilität (wird bei Initialisierung aufgerufen)
function updateFoundation(i) {
    // Validierung: Prüfe ob Index und Daten existieren
    if (!Array.isArray(foundationData) || i < 0 || i >= foundationData.length) {
        console.warn(`updateFoundation: Ungültiger Index ${i} oder foundationData-Array nicht verfügbar.`);
        return;
    }
    
    const f = foundationData[i];
    if (!f || !f.t) {
        console.warn(`updateFoundation: Foundation bei Index ${i} ist undefined oder hat keinen Titel.`);
        return;
    }
    
    // Nutze die neue Tab-Funktion
    setFoundationTab(f.t);
}

// ===============================
// PILLAR TAB SYSTEM
// ===============================
function setPillarTab(key) {
    // Vibration für App-Gefühl
    vibrate(5);
    
    // State aktualisieren
    activePillarTab = key;
    
    // Finde den Index des aktiven Pillars
    const activeIndex = pillarsData.findIndex(p => p && p.k === key);
    
    // Pillar Cards aktualisieren (Selected-State)
    try {
        const pillarCards = safeQuerySelectorAll('[data-pillar-key]');
        pillarCards.forEach(card => {
            if (card && card.dataset.pillarKey === key) {
                card.classList.add('pillar-card-active');
            } else {
                card.classList.remove('pillar-card-active');
            }
        });
    } catch (error) {
        console.error('Fehler bei Pillar-Card-Update in setPillarTab:', error);
    }
    
    // Methoden rendern
    updateMethods(key);
}

function renderPillarContent(key) {
    // Validierung: Prüfe ob pillarsData existiert
    if (!Array.isArray(pillarsData) || pillarsData.length === 0) {
        console.warn('renderPillarContent: pillarsData ist kein Array oder leer.');
        return;
    }
    
    // Finde das passende Objekt anhand des Keys
    const p = pillarsData.find(item => item && item.k === key);
    
    if (!p) {
        console.warn(`renderPillarContent: Pillar mit Key "${key}" nicht gefunden.`);
        return;
    }
    
    // Sichere DOM-Zugriffe mit Helper-Funktion
    const pillarIcon = safeGetElement('pillar-icon');
    const pillarTitle = safeGetElement('pillar-title');
    const pillarLevel = safeGetElement('pillar-level');
    const pillarDesc = safeGetElement('pillar-desc');
    const pillarSigns = safeGetElement('pillar-signs');
    const pillarPitfall = safeGetElement('pillar-pitfall');
    const methodsPillarLabel = safeGetElement('methods-pillar-label');
    
    // Setze Inhalte nur wenn Elemente existieren
    if (pillarIcon) pillarIcon.textContent = p.icon || '';
    if (pillarTitle) pillarTitle.textContent = p.t || '';
    if (pillarLevel) pillarLevel.textContent = p.lvl || '';
    if (pillarDesc) pillarDesc.textContent = p.d || '';
    if (pillarSigns) pillarSigns.textContent = p.signs || '';
    if (pillarPitfall) pillarPitfall.textContent = p.pitfall || '';
    if (methodsPillarLabel) methodsPillarLabel.textContent = p.t || '';
    
    // Icon-Hintergrundfarbe setzen basierend auf Key
    if (pillarIcon) {
        if (key === 'load') {
            pillarIcon.style.background = 'rgba(251, 191, 36, 0.2)';
            pillarIcon.style.color = 'var(--accent)';
        } else if (key === 'output') {
            pillarIcon.style.background = 'rgba(14, 165, 233, 0.2)';
            pillarIcon.style.color = '#0ea5e9';
        } else if (key === 'off') {
            pillarIcon.style.background = 'rgba(16, 185, 129, 0.2)';
            pillarIcon.style.color = '#10b981';
        } else if (key === 'progress') {
            pillarIcon.style.background = 'rgba(139, 92, 246, 0.2)';
            pillarIcon.style.color = '#8b5cf6';
        }
    }
}

// Legacy-Funktion für Kompatibilität
function selectPillar(index) {
    // Validierung: Prüfe ob Index und Daten existieren
    if (!Array.isArray(pillarsData) || index < 0 || index >= pillarsData.length) {
        console.warn(`selectPillar: Ungültiger Index ${index} oder pillarsData-Array nicht verfügbar.`);
        return;
    }
    
    const p = pillarsData[index];
    if (!p || !p.k) {
        console.warn(`selectPillar: Pillar bei Index ${index} ist undefined oder hat keinen Key.`);
        return;
    }
    
    // Nutze die neue Tab-Funktion
    setPillarTab(p.k);
}

function showSummaryDetail(key) {
    // Validierung: Prüfe ob key existiert
    if (!key || !summaryDetails || typeof summaryDetails[key] === 'undefined') {
        console.warn(`showSummaryDetail: Key "${key}" nicht in summaryDetails gefunden.`);
        return;
    }
    
    const info = summaryDetails[key];
    if (!info) {
        console.warn(`showSummaryDetail: Info für Key "${key}" ist undefined.`);
        return;
    }
    
    // Sichere DOM-Zugriffe mit Helper-Funktion
    const content = safeGetElement('info-content');
    const placeholder = safeGetElement('info-placeholder');
    
    // Prüfe ob beide Elemente existieren
    if (!content || !placeholder) {
        console.warn('showSummaryDetail: info-content oder info-placeholder nicht gefunden.');
        return;
    }
    
    // Setze Platzhalter aus und Content unsichtbar
    placeholder.style.display = 'none';
    content.style.opacity = '0';
    
    // Setze Inhalte nach kurzer Verzögerung
    setTimeout(() => {
        const infoTitle = safeGetElement('info-title');
        const infoDesc = safeGetElement('info-desc');
        const infoExample = safeGetElement('info-example');
        const infoIcon = safeGetElement('info-icon');
        
        // Setze Inhalte nur wenn Elemente existieren
        if (infoTitle) infoTitle.textContent = info.t || '';
        if (infoDesc) infoDesc.textContent = info.d || '';
        if (infoExample) infoExample.textContent = info.e || '';
        if (infoIcon) {
            infoIcon.textContent = (info.t && info.t[0]) || '';
            if (info.c) {
                infoIcon.style.backgroundColor = info.c;
            }
        }
        
        // Setze Content wieder sichtbar
        if (content) content.style.opacity = '1';
    }, 150);
}

 function openModal(cat, name) {
  // Vibration für App-Gefühl
  vibrate(5);
  
  // Validierung: Prüfe ob Parameter existieren
  if (!cat || !name) {
    console.warn(`openModal: Parameter cat="${cat}" oder name="${name}" fehlt.`);
    return;
  }
  
  // Validierung: Prüfe ob methodsData existiert
  if (!methodsData || typeof methodsData[cat] === 'undefined') {
    console.warn(`openModal: Kategorie "${cat}" nicht in methodsData gefunden.`);
    return;
  }
  
  const list = methodsData[cat] || [];
  if (!Array.isArray(list) || list.length === 0) {
    console.warn(`openModal: Liste für Kategorie "${cat}" ist leer oder kein Array.`);
    return;
  }
  
  const m = list.find(x => x && x.n === name);
  if (!m) {
    console.warn(`openModal: Methode "${name}" nicht in Kategorie "${cat}" gefunden.`);
    return;
  }

  // Sichere DOM-Zugriffe mit Helper-Funktion
  const modalCategory = safeGetElement('modal-category');
  const modalTitle = safeGetElement('modal-title');
  const modalDesc = safeGetElement('modal-desc');
  const modalPro = safeGetElement('modal-pro');
  const modalContra = safeGetElement('modal-contra');
  const modalHow = safeGetElement('modal-how');
  const exampleEl = safeGetElement('modal-example');

  // Setze Modal-Header nur wenn Elemente existieren
  if (modalCategory) modalCategory.textContent = String(cat).toUpperCase();
  if (modalTitle) modalTitle.textContent = m.n || '';
  if (modalDesc) modalDesc.textContent = m.d || '';
  if (modalPro) modalPro.textContent = m.p || m.v || '';
  if (modalContra) modalContra.textContent = m.c || '';
  if (modalHow) modalHow.textContent = m.h || '';

  // Setze Beispiel-Content mit Error-Handling
  if (exampleEl) {
    try {
      if (Array.isArray(m.e) && m.e.length) {
exampleEl.innerHTML = `
  <ul class="space-y-3">
    ${m.e.map(item => {
      const text = String(item || "");
      const parts = text.split(':');
      const title = parts.shift()?.trim() || "";
      const rest = parts.join(':').trim();

      return `
        <li class="flex items-start gap-3">
          <span class="mt-1 text-amber-600">▢</span>
          <span>
            ${title ? `<strong>${escapeHtml(title)}</strong>` : ""}
            ${rest ? `: ${escapeHtml(rest)}` : escapeHtml(text)}
          </span>
        </li>
      `;
    }).join('')}
  </ul>
`;
      } else if (typeof m.e === "string" && m.e.trim()) {
exampleEl.textContent = m.e;
      } else {
exampleEl.textContent = '';
      }
    } catch (error) {
      console.error('Fehler beim Setzen von modal-example:', error);
      exampleEl.textContent = '';
    }
  }

    // Öffne Bottom-Sheet - mit Error-Handling und sicheren Selektoren
    const modal = safeGetElement('method-modal');
    if (!modal) {
      console.error('openModal: method-modal Element nicht gefunden. Bottom-Sheet kann nicht geöffnet werden.');
      return;
    }
    
    try {
      // Neue Bottom-Sheet Klasse statt 'show'
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');

      // Body overflow: hidden für Bottom-Sheet
      if (document.body && typeof document.body.style !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }

      // Scroll-Fix: Setze Scroll-Position auf 0 mit sicherem Selektor
      const scroller = safeQuerySelector('.bottom-sheet__content', modal);
      if (scroller && typeof scroller.scrollTop !== 'undefined') {
        scroller.scrollTop = 0;
      }
    } catch (error) {
      console.error('Fehler beim Öffnen des Bottom-Sheets:', error);
      // Fallback: Versuche zumindest body.overflow zurückzusetzen bei Fehler
      if (document.body && typeof document.body.style !== 'undefined') {
        try {
          document.body.style.overflow = '';
        } catch (fallbackError) {
          console.error('Auch Fallback body.overflow Reset fehlgeschlagen:', fallbackError);
        }
      }
    }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function closeModal() {
    const modal = safeGetElement('method-modal');
    if (!modal) {
        console.warn('closeModal: method-modal Element nicht gefunden.');
        return;
    }
    
    try {
        // Schließe Backdrop
        const backdrop = document.querySelector('.bottom-sheet-backdrop');
        if (backdrop) {
            backdrop.classList.remove('active');
            backdrop.setAttribute('aria-hidden', 'true');
        }
        
        // Neue Bottom-Sheet Klasse statt 'show'
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        
        // Body overflow zurücksetzen
        if (document.body && typeof document.body.style !== 'undefined') {
            document.body.style.overflow = '';
        }
    } catch (error) {
        console.error('Fehler beim Schließen des Bottom-Sheets:', error);
        // Fallback: Versuche zumindest body.overflow zurückzusetzen
        if (document.body && typeof document.body.style !== 'undefined') {
            document.body.style.overflow = '';
        }
    }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeDetailModal();
        closeAppModal();
    }
});

// Close modal on backdrop click
document.addEventListener('click', (e) => {
    const detailModal = safeGetElement('detail-modal');
    const appModal = safeGetElement('app-modal');
    const bottomSheetBackdrop = document.querySelector('.bottom-sheet-backdrop');
    
    if (detailModal && detailModal.classList.contains('active') && e.target === detailModal) {
        closeDetailModal();
    }
    
    if (appModal && appModal.classList.contains('active') && e.target === appModal) {
        closeAppModal();
    }
    
    if (bottomSheetBackdrop && bottomSheetBackdrop.classList.contains('active') && e.target === bottomSheetBackdrop) {
        closeModal();
    }
});

// ===============================
// OPEN MODAL (app-modal - Deep Dive)
// ===============================
function openModal(title, content) {
    // Vibration für App-Gefühl
    vibrate(5);
    
    // Validierung
    if (!title || !content) {
        console.warn('openModal: title oder content fehlt.');
        return;
    }
    
    // Sichere DOM-Zugriffe
    const modal = safeGetElement('app-modal');
    const titleEl = safeGetElement('app-modal-title');
    const bodyEl = safeGetElement('app-modal-body');
    
    if (!modal || !titleEl || !bodyEl) {
        console.error('openModal: app-modal Elemente nicht gefunden.');
        return;
    }
    
    // XSS-Schutz: Escape Titel, Content ist bereits HTML
    const safeTitle = escapeHtml(String(title));
    
    // Setze Titel und Content
    titleEl.textContent = safeTitle;
    bodyEl.innerHTML = content; // Content kann HTML sein
    
    // Öffne Modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    
    // Verhindere Body-Scroll
    document.body.style.overflow = 'hidden';
}

// ===============================
// CLOSE APP MODAL
// ===============================
function closeAppModal() {
    // Vibration für App-Gefühl
    vibrate(5);
    
    const modal = safeGetElement('app-modal');
    if (!modal) {
        console.warn('closeAppModal: app-modal Element nicht gefunden.');
        return;
    }
    
    try {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    } catch (error) {
        console.error('Fehler beim Schließen des app-modal:', error);
        document.body.style.overflow = '';
    }
}

// ===============================
// OPEN METHOD MODAL (Wrapper für Methods)
// ===============================
function openMethodModal(category, index) {
    // Delegiere an openMethodSheet für konsistente Bottom-Sheet-Darstellung
    openMethodSheet(category, index);
}

// ===============================
// OPEN DETAIL MODAL (Full Screen)
// ===============================
function openDetail(title, content, category) {
    // Vibration für App-Gefühl
    vibrate(5);
    
    // Validierung
    if (!title || !content) {
        console.warn('openDetail: title oder content fehlt.');
        return;
    }
    
    const modal = safeGetElement('detail-modal');
    const categoryEl = safeGetElement('detail-category');
    const titleEl = safeGetElement('detail-title');
    const contentEl = safeGetElement('detail-content');
    
    if (!modal || !titleEl || !contentEl) {
        console.error('openDetail: Modal-Elemente nicht gefunden.');
        return;
    }
    
    // XSS-Schutz: Escape Titel und Kategorie (Content ist bereits escaped HTML-String)
    const safeTitle = escapeHtml(String(title));
    const safeCategory = category ? escapeHtml(String(category)) : '';
    
    // Setze Kategorie (optional)
    if (categoryEl) {
        if (safeCategory) {
            categoryEl.textContent = safeCategory;
            categoryEl.style.display = 'block';
        } else {
            categoryEl.style.display = 'none';
        }
    }
    
    // Setze Titel und Content
    titleEl.innerHTML = safeTitle;
    contentEl.innerHTML = content;
    
    // Öffne Modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    
    // Verhindere Body-Scroll
    document.body.style.overflow = 'hidden';
}

// ===============================
// RENDER PHASES (Teaser-Only)
// ===============================
function renderPhases() {
    const container = safeGetElement('phase-container');
    if (!container) {
        console.warn('renderPhases: phase-container Element nicht gefunden.');
        return;
    }
    
    // Validierung: Prüfe ob phasesData existiert
    if (!Array.isArray(phasesData) || phasesData.length === 0) {
        console.warn('renderPhases: phasesData ist kein Array oder leer.');
        container.innerHTML = '';
        return;
    }
    
    try {
        // Rendere kompakte Pill-Buttons
        const phaseButtons = phasesData.map((p, i) => {
            if (!p) {
                console.warn(`renderPhases: Phase bei Index ${i} ist undefined.`);
                return '';
            }
            
            const phaseName = escapeHtml(String(p.n || 'Phase'));
            
            return `
              <button
                type="button"
                role="tab"
                data-phase-index="${i}"
                aria-selected="false"
                onclick="openPhaseSheet(${i})"
                style="flex: 1;"
              >
                ${phaseName}
              </button>
            `;
        }).filter(html => html !== '').join('');
        
        container.innerHTML = phaseButtons;
        
    } catch (error) {
        console.error('Fehler beim Rendern der Phasen:', error);
        container.innerHTML = '';
    }
}

// ===============================
// OPEN RESEARCH DETAIL (Wrapper für openDetail)
// ===============================
function openResearchDetail(stepIndex, researchIndex) {
    // Vibration für App-Gefühl
    vibrate(5);
    
    // Validierung
    if (typeof stepIndex !== 'number' || stepIndex < 0 || stepIndex >= steps.length) {
        console.warn('openResearchDetail: Ungültiger stepIndex.');
        return;
    }
    
    const step = steps[stepIndex];
    if (!step || !Array.isArray(step.research) || researchIndex < 0 || researchIndex >= step.research.length) {
        console.warn('openResearchDetail: Ungültiger researchIndex oder keine Research-Daten.');
        return;
    }
    
    const fullText = step.research[researchIndex];
    if (!fullText || typeof fullText !== 'string') {
        console.warn('openResearchDetail: Research-Text ist ungültig.');
        return;
    }
    
    // Erstelle Content mit escaped Text
    const content = `<p style="font-size: 14px; line-height: 1.5; text-align: left;">${escapeHtml(String(fullText))}</p>`;
    
    // Öffne Detail-Modal mit Kategorie
    openDetail('Forschung', content, 'Forschung');
}

// ===============================
// OPEN METHOD DETAIL (Wrapper für openDetail)
// ===============================
function openMethodDetail(category, index) {
    // Vibration für App-Gefühl
    vibrate(5);
    
    // Validierung
    if (!category || typeof index !== 'number' || index < 0) {
        console.warn('openMethodDetail: Ungültige Parameter.');
        return;
    }
    
    if (!methodsData || typeof methodsData[category] === 'undefined') {
        console.warn('openMethodDetail: Kategorie nicht gefunden.');
        return;
    }
    
    const list = methodsData[category] || [];
    if (!Array.isArray(list) || index >= list.length) {
        console.warn('openMethodDetail: Index außerhalb des Arrays.');
        return;
    }
    
    const m = list[index];
    if (!m) {
        console.warn('openMethodDetail: Methode ist undefined.');
        return;
    }
    
    // Erstelle vollständigen Content mit linksbündigem Text und line-height: 1.5
    const fullContent = `
        ${m.d ? `<p style="margin-bottom: 16px; text-align: left; line-height: 1.5;"><strong>Beschreibung:</strong><br>${escapeHtml(String(m.d))}</p>` : ''}
        ${m.h ? `<p style="margin-bottom: 16px; text-align: left; line-height: 1.5;"><strong>Wie:</strong><br>${escapeHtml(String(m.h))}</p>` : ''}
        ${m.e && Array.isArray(m.e) ? `<div style="margin-bottom: 16px; text-align: left;"><strong style="display: block; margin-bottom: 8px;">Elemente:</strong><ul style="margin: 0; padding-left: 20px; line-height: 1.5;">${m.e.map(item => `<li style="line-height: 1.5; text-align: left;">${escapeHtml(String(item))}</li>`).join('')}</ul></div>` : ''}
        ${m.p ? `<p style="margin-bottom: 16px; color: var(--accent); text-align: left; line-height: 1.5;"><strong>Pro:</strong><br>${escapeHtml(String(m.p))}</p>` : ''}
        ${m.c ? `<p style="margin-bottom: 16px; color: #f43f5e; text-align: left; line-height: 1.5;"><strong>Contra:</strong><br>${escapeHtml(String(m.c))}</p>` : ''}
        ${m.v ? `<p style="margin-bottom: 16px; text-align: left; line-height: 1.5;"><strong>Vision:</strong><br>${escapeHtml(String(m.v))}</p>` : ''}
    `;
    
    // Kategorie aus methodsData bestimmen (z.B. "Load", "Output", "Off", "Progress")
    const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
    
    // Öffne Detail-Modal mit Kategorie
    openDetail(m.n || 'Methode', fullContent, categoryLabel);
}

// ===============================
// CLOSE DETAIL MODAL
// ===============================
function closeDetailModal() {
    // Vibration für App-Gefühl
    vibrate(5);
    
    const modal = safeGetElement('detail-modal');
    if (!modal) {
        console.warn('closeDetailModal: detail-modal Element nicht gefunden.');
        return;
    }
    
    try {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    } catch (error) {
        console.error('Fehler beim Schließen des Detail-Modals:', error);
    }
}

// ===================================================================
// 4. CHART FUNCTIONS
// ===================================================================
// Chart.js Initialisierung, Management und Error-Handling
// ===================================================================

// Chart-Initialisierungs-Funktion - wartet auf Chart.js falls nötig
function initializeCharts() {
    // Prüfe ob Chart.js geladen ist, sonst warte kurz und versuche erneut
    if (!isChartJsReady()) {
        // Versuche nach kurzer Verzögerung nochmal (Race Condition: CDN könnte noch laden)
        let retries = 0;
        const maxRetries = 5;
        const checkInterval = setInterval(() => {
            retries++;
            if (isChartJsReady()) {
                clearInterval(checkInterval);
                initializeChartsNow();
            } else if (retries >= maxRetries) {
                clearInterval(checkInterval);
                console.error('Chart.js konnte nach ' + maxRetries + ' Versuchen nicht geladen werden. Charts werden nicht initialisiert.');
                // Fallback: Zeige Fehlermeldung in Canvas-Bereichen
                showChartError('evolutionCircle');
                showChartError('energyChart');
            }
        }, 200); // Prüfe alle 200ms
        return;
    }
    
    // Chart.js ist bereit, initialisiere sofort
    initializeChartsNow();
}

// Hilfsfunktion: Zeigt Fehler-Meldung wenn Chart nicht initialisiert werden kann
function showChartError(canvasId) {
    const canvas = safeGetElement(canvasId);
    if (canvas) {
        const parent = canvas.parentElement;
        if (parent) {
            parent.innerHTML = '<div class="flex items-center justify-center h-full text-stone-500 text-sm p-4">Chart konnte nicht geladen werden. Bitte Seite neu laden.</div>';
        }
    }
}

// Eigentliche Chart-Initialisierung
function initializeChartsNow() {
    // Evolution Circle Chart - mit vollständigem Error-Handling
    const evolutionCanvas = safeGetElement('evolutionCircle');
    if (evolutionCanvas) {
        try {
            // Prüfe ob Chart.js bereit ist
            if (!isChartJsReady()) {
                throw new Error('Chart.js ist nicht verfügbar.');
            }

            // Prüfe ob DataLabels Plugin verfügbar ist (optional, aber sollte vorhanden sein)
            if (isChartDataLabelsReady()) {
                Chart.register(ChartDataLabels);
            } else {
                console.warn('Chart.js DataLabels Plugin fehlt. Chart wird ohne Labels initialisiert.');
            }

            const ctxC = evolutionCanvas.getContext('2d');
            if (!ctxC) {
                throw new Error('Canvas 2D Context konnte nicht erstellt werden.');
            }

            // Validierung: Prüfe ob steps-Array existiert
            if (!Array.isArray(steps) || steps.length === 0) {
                throw new Error('steps-Array ist leer oder nicht verfügbar.');
            }

            new Chart(ctxC, {
                type: 'doughnut',
                data: {
                    labels: steps.map(s => s && s.t ? s.t : ''),
                    datasets: [
                        {
                            data: [1,1,1,1,1,1,1],
                            backgroundColor: ['#f59e0b', '#44403c', '#d97706', '#b45309', '#78716c', '#059669', '#10b981'],
                            borderWidth: 4,
                            borderColor: '#fdfbf7',
                            hoverOffset: 0
                        }
                    ]
                },
                options: {
                    cutout: '50%',
                    backgroundColor: 'transparent',
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                        datalabels: {
                            color: '#fff',
                            font: { weight: 'bold', size: 10 },
                            formatter: (val, ctx) => {
                                try {
                                    return ctx.chart.data.labels[ctx.dataIndex] || '';
                                } catch (e) {
                                    return '';
                                }
                            }
                        }
                    },
                    onClick: (e, active) => {
                        try {
                            if (active && active.length > 0 && active[0].index !== undefined) {
                                openStepSheet(active[0].index);
                            }
                        } catch (error) {
                            console.error('Fehler bei Chart-Click-Handler:', error);
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Fehler bei Evolution Circle Chart-Initialisierung:', error);
            showChartError('evolutionCircle');
        }
    }

    // Energy Chart - mit vollständigem Error-Handling
    const energyCanvas = safeGetElement('energyChart');
    if (energyCanvas) {
        try {
            // Prüfe ob Chart.js bereit ist
            if (!isChartJsReady()) {
                throw new Error('Chart.js ist nicht verfügbar.');
            }

            const ctxE = energyCanvas.getContext('2d');
            if (!ctxE) {
                throw new Error('Canvas 2D Context konnte nicht erstellt werden.');
            }

            // Validierung: Prüfe ob phasesData existiert
            if (!Array.isArray(phasesData) || phasesData.length === 0) {
                throw new Error('phasesData-Array ist leer oder nicht verfügbar.');
            }

            // Validierung: Prüfe ob alle Phasen val-Objekte haben
            const validPhases = phasesData.filter(p => p && p.val && typeof p.val === 'object' && p.val.motivation !== undefined && p.val.discipline !== undefined && p.val.habit !== undefined);
            if (validPhases.length === 0) {
                throw new Error('Keine gültigen Phasen-Daten gefunden.');
            }

            // Erstelle Datasets basierend auf stabilem Mapping
            const datasets = CHART_DATASET_ORDER.map(key => {
                const config = CHART_DATASET_CONFIG[key];
                if (!config) {
                    console.warn(`Chart-Dataset-Config für Key "${key}" nicht gefunden.`);
                    return null;
                }
                
                return {
                    label: config.label,
                    data: validPhases.map(p => p.val[key] || 0),
                    borderColor: config.borderColor,
                    tension: 0.4,
                    borderWidth: key === 'habit' ? 4 : undefined // Gewohnheit dicker
                };
            }).filter(dataset => dataset !== null); // Entferne null-Einträge

            window.energyChart = new Chart(ctxE, {
                type: 'line',
                data: {
                    labels: validPhases.map(p => (p && p.n) ? p.n : ''),
                    datasets: datasets
                },
                options: { 
                    maintainAspectRatio: false,
                    backgroundColor: 'transparent',
                    scales: { 
                        y: { 
                            display: false,
                            grid: {
                                color: 'rgba(255,255,255,0.05)'
                            },
                            ticks: {
                                color: 'var(--text-secondary)'
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(255,255,255,0.05)'
                            },
                            ticks: {
                                color: 'var(--text-secondary)'
                            }
                        }
                    }, 
                    plugins: { 
                        datalabels: { display: false },
                        legend: {
                            labels: {
                                color: 'var(--text-secondary)'
                            }
                        }
                    } 
                }
            });
        } catch (error) {
            console.error('Fehler bei Energy Chart-Initialisierung:', error);
            showChartError('energyChart');
        }
    }
}

// Accordion-Initialisierung - mit sicheren Selektoren und Error-Handling
function initializeAccordions() {
    const triggers = safeQuerySelectorAll('[data-acc-trigger]');

    if (triggers.length > 0) {
        triggers.forEach((btn) => {
            if (!btn) return;
            
            // Sichere Suche nach Accordion-Body innerhalb des parent section
            const section = btn.closest('section');
            if (!section) {
                console.warn('Accordion-Trigger: Kein parent section gefunden.');
                return;
            }
            
            const body = safeQuerySelector('[data-acc-body]', section);
            if (!body) {
                console.warn('Accordion-Trigger: Kein data-acc-body in section gefunden.');
                return;
            }

            // Initialisiere Zustand
            try {
                const expanded = btn.getAttribute('aria-expanded') === 'true';
                body.hidden = !expanded;
            } catch (error) {
                console.error('Fehler bei Accordion-Initialisierung:', error);
            }

            // Event-Listener mit Error-Handling
            btn.addEventListener('click', () => {
                try {
                    // Vibration für App-Gefühl
                    vibrate(5);
                    
                    const isOpen = btn.getAttribute('aria-expanded') === 'true';

                    // Close all accordions
                    triggers.forEach((b) => {
                        if (!b) return;
                        const sec = b.closest('section');
                        if (!sec) return;
                        
                        const bd = safeQuerySelector('[data-acc-body]', sec);
                        if (!bd) return;
                        
                        b.setAttribute('aria-expanded', 'false');
                        bd.hidden = true;
                    });

                    // Open clicked accordion (if it was closed)
                    if (!isOpen && section) {
                        btn.setAttribute('aria-expanded', 'true');
                        body.hidden = false;
                    }
                } catch (error) {
                    console.error('Fehler im Accordion-Click-Handler:', error);
                }
            });
        });
    } else {
        console.warn('Keine Accordion-Trigger mit data-acc-trigger gefunden.');
    }
}

// ===================================================================
// 5. INITIALIZATION
// ===================================================================
// App-Start, Validierung, Event-Handler und Initialisierung
// ===================================================================

// Validierungs-Funktion: Prüft ob alle kritischen IDs vorhanden sind
function validateCriticalIds() {
    const criticalIds = [
        'evolutionCircle',
        'energyChart',
        'phase-container',
        'phase-detail',
        'pd-name',
        'pd-meta',
        'pd-desc',
        'step-title',
        'step-desc',
        'step-source',
        'step-risk',
        'step-num',
        'deep-points',
        'fd-title',
        'fd-desc',
        'fd-pro',
        'fd-contra',
        'fd-example',
        'pillar-icon',
        'pillar-title',
        'pillar-level',
        'pillar-desc',
        'pillar-signs',
        'pillar-pitfall',
        'methods-pillar-label',
        'method-grid',
        'method-modal',
        'modal-category',
        'modal-title',
        'modal-desc',
        'modal-pro',
        'modal-contra',
        'modal-how',
        'modal-example',
        'self-check-grid',
        'self-check-result'
    ];
    
    const missingIds = [];
    criticalIds.forEach(id => {
        const element = safeGetElement(id);
        if (!element) {
            missingIds.push(id);
        }
    });
    
    if (missingIds.length > 0) {
        console.warn('validateCriticalIds: Folgende kritische IDs fehlen:', missingIds);
        console.warn('Dies könnte zu Funktionsstörungen führen. Prüfe HTML-Struktur.');
        return false;
    }
    
    return true;
}

// Haupt-Initialisierung: Wartet auf DOM und Chart.js
function initializeApp() {
    // Validierung: Prüfe kritische IDs beim Start
    const allCriticalIdsPresent = validateCriticalIds();
    if (!allCriticalIdsPresent) {
        console.warn('initializeApp: Einige kritische IDs fehlen. App wird trotzdem initialisiert, aber einige Funktionen könnten nicht arbeiten.');
    }

    // Render-Funktionen aufrufen (mit Error-Handling)
    try {
        renderSelfCheckQuick();
    } catch (error) {
        console.error('Fehler bei renderSelfCheckQuick:', error);
    }

    try {
        renderPillars();
        setPillarTab('load'); // Load Tab + Methoden sofort sichtbar
    } catch (error) {
        console.error('Fehler bei renderPillars/setPillarTab:', error);
    }
    
    // Loop Tabs initialisieren
    try {
        renderLoopTabs(); // Tab-Navigation + Content rendern
    } catch (error) {
        console.error('Fehler bei renderLoopTabs:', error);
    }
    
    // Foundation Grid initialisieren
    try {
        renderFoundationGrid(); // 2x2 Grid rendern
    } catch (error) {
        console.error('Fehler bei renderFoundationGrid:', error);
    }

    // Accordion-Initialisierung
    try {
        initializeAccordions();
    } catch (error) {
        console.error('Fehler bei initializeAccordions:', error);
    }

    // Phase Container initialisieren
    try {
        renderPhases();
    } catch (error) {
        console.error('Fehler bei renderPhases:', error);
    }

    // Initialisiere Charts (wartet auf Chart.js wenn nötig)
    initializeCharts();

    // Initialisierung mit Error-Handling - jede Funktion einzeln abgesichert
    // damit bei Fehlern in einer Funktion die anderen trotzdem ausgeführt werden
    try {
        updateStep(0);
    } catch (error) {
        console.error('Fehler bei updateStep(0) Initialisierung:', error);
    }
    
    // Initialisiere erste Phase als aktiv (Index 0) - NACH Chart-Initialisierung
    try {
        if (Array.isArray(phasesData) && phasesData.length > 0) {
            // Warte kurz, damit Charts initialisiert sind
            setTimeout(() => {
                updatePhaseUI(0);
            }, 100);
        }
    } catch (error) {
        console.error('Fehler bei updatePhaseUI(0) Initialisierung:', error);
    }
    
    // Trap-View initialisieren (Mobile: Erfolgs-Spirale als Default)
    try {
        const trapSuccess = safeGetElement('trap-success');
        if (trapSuccess) {
            trapSuccess.classList.add('active');
        }
    } catch (error) {
        console.error('Fehler bei Trap-View Initialisierung:', error);
    }
    
    // Methods wird bereits durch setPillarTab('load') initialisiert
    
    // Foundation wird bereits durch setFoundationTab('Werte') initialisiert
    
    // Initialisiere Lern-Navigation
    try {
        initializeLearnNav();
    } catch (error) {
        console.error('Fehler bei initializeLearnNav:', error);
    }
    
    // Initialisiere Card-Active-State (Apple-like Scroll-Effekt)
    try {
        initializeCardActiveState();
    } catch (error) {
        console.error('Fehler bei initializeCardActiveState:', error);
    }
    
    // Read More Toggles initialisieren (nur anzeigen, wenn expandierter Text vorhanden)
    try {
        const identityExpanded = safeGetElement('identity-intro-expanded');
        const identityToggle = safeGetElement('identity-read-more');
        if (identityExpanded && identityToggle) {
            // Zeige Toggle nur, wenn expandierter Text vorhanden ist
            if (identityExpanded.innerHTML.trim().length > 0) {
                identityToggle.style.display = 'inline';
            }
        }
        
        const leitbildExpanded = safeGetElement('leitbild-intro-expanded');
        const leitbildToggle = safeGetElement('leitbild-read-more');
        if (leitbildExpanded && leitbildToggle) {
            // Zeige Toggle nur, wenn expandierter Text vorhanden ist
            if (leitbildExpanded.innerHTML.trim().length > 0) {
                leitbildToggle.style.display = 'inline';
            }
        }
    } catch (error) {
        console.error('Fehler bei Read More Toggle Initialisierung:', error);
    }
}

// ===================================================================
// LERN-NAVIGATION (IntersectionObserver + Weiter-Button)
// ===================================================================

// Initialisiert die Lern-Navigation mit IntersectionObserver
function initializeLearnNav() {
    // Finde alle Sections mit data-learn Attribut
    const learnSections = safeQuerySelectorAll('[data-learn]');
    
    if (learnSections.length === 0) {
        console.warn('initializeLearnNav: Keine Sections mit data-learn Attribut gefunden.');
        return;
    }
    
    // Sortiere Sections nach data-learn Wert
    const sortedSections = Array.from(learnSections).sort((a, b) => {
        const aVal = parseInt(a.getAttribute('data-learn'), 10) || 0;
        const bVal = parseInt(b.getAttribute('data-learn'), 10) || 0;
        return aVal - bVal;
    });
    
    // Hole DOM-Elemente
    const learnTitle = safeQuerySelector('.learn-title');
    const learnDots = safeQuerySelector('.learn-dots');
    const nextBtn = safeGetElement('learn-next-btn');
    
    if (!learnTitle || !learnDots || !nextBtn) {
        console.warn('initializeLearnNav: Erforderliche DOM-Elemente nicht gefunden.');
        return;
    }
    
    // Erstelle Dots für jede Section
    try {
        learnDots.innerHTML = sortedSections.map((section, index) => {
            const learnNum = section.getAttribute('data-learn') || (index + 1).toString();
            const title = section.getAttribute('data-title') || `Abschnitt ${learnNum}`;
            const safeTitle = escapeHtml(String(title));
            return `<button type="button" class="dot-hit" data-learn-num="${learnNum}" aria-label="${safeTitle}" title="${safeTitle}">
              <span class="learn-dot"></span>
            </button>`;
        }).join('');
        
        // Add click handlers for dots
        const dotButtons = safeQuerySelectorAll('.dot-hit');
        dotButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const learnNum = btn.getAttribute('data-learn-num');
                const targetSection = sortedSections.find(s => s.getAttribute('data-learn') === learnNum);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
            
            // Keyboard accessibility: Enter and Space
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const learnNum = btn.getAttribute('data-learn-num');
                    const targetSection = sortedSections.find(s => s.getAttribute('data-learn') === learnNum);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    } catch (error) {
        console.error('Fehler beim Erstellen der Dots:', error);
        return;
    }
    
    let currentActiveIndex = 0;
    
    // IntersectionObserver Setup
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Section gilt als aktiv, wenn sie im oberen 20% des Viewports ist
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        // Finde die Section, die am oberen Rand des Viewports ist (innerhalb rootMargin)
        const visibleSections = entries
            .filter(entry => entry.isIntersecting)
            .map(entry => ({
                element: entry.target,
                top: entry.boundingClientRect.top,
                ratio: entry.intersectionRatio
            }))
            .sort((a, b) => a.top - b.top); // Sortiere nach Position (oberste zuerst)
        
        if (visibleSections.length > 0) {
            // Nimm die oberste sichtbare Section
            const mostVisible = visibleSections[0].element;
            const learnNum = mostVisible.getAttribute('data-learn');
            const title = mostVisible.getAttribute('data-title') || '';
            const sectionIndex = sortedSections.indexOf(mostVisible);
            
            if (sectionIndex !== -1 && sectionIndex !== currentActiveIndex) {
                currentActiveIndex = sectionIndex;
                updateLearnNav(learnNum, title, sortedSections, nextBtn);
            }
        }
    }, observerOptions);
    
    // Beobachte alle Sections
    sortedSections.forEach(section => {
        try {
            observer.observe(section);
        } catch (error) {
            console.error('Fehler beim Beobachten einer Section:', error);
        }
    });
    
    // Initiale Aktualisierung
    if (sortedSections.length > 0) {
        const firstSection = sortedSections[0];
        const firstLearnNum = firstSection.getAttribute('data-learn');
        const firstTitle = firstSection.getAttribute('data-title') || '';
        updateLearnNav(firstLearnNum, firstTitle, sortedSections, nextBtn);
    }
    
    // Weiter-Button Handler - bestimmt aktuellen Index basierend auf aktivem Dot
    nextBtn.addEventListener('click', () => {
        try {
            // Finde aktiven Dot und bestimme Index
            const activeDot = safeQuerySelector('.dot-hit .learn-dot.active');
            const activeHitArea = activeDot?.closest('.dot-hit');
            if (activeHitArea) {
                const activeNum = activeHitArea.getAttribute('data-learn-num');
                const activeIndex = sortedSections.findIndex(s => s.getAttribute('data-learn') === activeNum);
                if (activeIndex !== -1) {
                    scrollToNextSection(sortedSections, activeIndex);
                } else {
                    // Fallback: verwende currentActiveIndex
                    scrollToNextSection(sortedSections, currentActiveIndex);
                }
            } else {
                // Fallback: verwende currentActiveIndex
                scrollToNextSection(sortedSections, currentActiveIndex);
            }
        } catch (error) {
            console.error('Fehler beim Scrollen zur nächsten Section:', error);
        }
    });
}

// Aktualisiert Titel und aktive Dot
function updateLearnNav(learnNum, title, sortedSections, nextBtn) {
    try {
        const learnTitle = safeQuerySelector('.learn-title');
        if (learnTitle) {
            learnTitle.textContent = title || '';
        }
        
        // Update Dots
        const hitAreas = safeQuerySelectorAll('.dot-hit');
        hitAreas.forEach(hitArea => {
            if (hitArea) {
                const dot = hitArea.querySelector('.learn-dot');
                const dotNum = hitArea.getAttribute('data-learn-num');
                if (dot && typeof dot.classList !== 'undefined') {
                    if (dotNum === learnNum) {
                        dot.classList.add('active');
                        hitArea.setAttribute('aria-selected', 'true');
                    } else {
                        dot.classList.remove('active');
                        hitArea.setAttribute('aria-selected', 'false');
                    }
                }
            }
        });
        
        // Update Weiter-Button (deaktivieren, wenn letzte Section)
        if (nextBtn) {
            const currentIndex = sortedSections.findIndex(s => s.getAttribute('data-learn') === learnNum);
            const isLast = currentIndex === sortedSections.length - 1;
            nextBtn.disabled = isLast;
            if (isLast) {
                nextBtn.textContent = 'Fertig';
            } else {
                nextBtn.textContent = 'Weiter →';
            }
        }
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Lern-Navigation:', error);
    }
}

// Scrollt zur nächsten data-learn Section (smooth scroll)
function scrollToNextSection(sortedSections, currentIndex) {
    if (!Array.isArray(sortedSections) || currentIndex < 0 || currentIndex >= sortedSections.length - 1) {
        return;
    }
    
    const nextSection = sortedSections[currentIndex + 1];
    if (!nextSection) {
        return;
    }
    
    try {
        // Smooth scroll zur nächsten Section
        const headerOffset = 100; // Offset für sticky Navigation
        const elementPosition = nextSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    } catch (error) {
        console.error('Fehler beim Smooth-Scroll:', error);
        // Fallback: Normales Scrollen
        try {
            nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (fallbackError) {
            console.error('Auch Fallback-Scroll fehlgeschlagen:', fallbackError);
        }
    }
}

// ===================================================================
// CARD ACTIVE STATE (Apple-like Scroll-Effekt)
// ===================================================================

// Initialisiert den Card-Active-State Observer (Apple-like Effekt)
function initializeCardActiveState() {
    // Finde alle Cards mit data-learn-card Attribut
    const learnCards = safeQuerySelectorAll('[data-learn-card]');
    
    if (learnCards.length === 0) {
        console.warn('initializeCardActiveState: Keine Cards mit data-learn-card Attribut gefunden.');
        return;
    }
    
    let currentActiveCard = null;
    
    // Berechnet den Viewport-Overlap einer Card (wie viel % der Card im Viewport ist)
    function getViewportOverlap(entry) {
        const rect = entry.boundingClientRect;
        const viewportHeight = window.innerHeight;
        
        // Berechne sichtbaren Bereich (wie viel von der Card im Viewport ist)
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        // Overlap = sichtbare Höhe / Card-Höhe
        if (rect.height === 0) return 0;
        return visibleHeight / rect.height;
    }
    
    // IntersectionObserver Setup - beobachtet alle Cards gleichzeitig
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] // Viele Thresholds für präzise Overlap-Berechnung
    };
    
    const observer = new IntersectionObserver((entries) => {
        // Finde die Card mit dem größten Viewport-Overlap
        let maxOverlap = 0;
        let mostVisibleCard = null;
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const overlap = getViewportOverlap(entry);
                
                // Wenn Card größeren Overlap hat, wird sie zur aktivsten
                if (overlap > maxOverlap) {
                    maxOverlap = overlap;
                    mostVisibleCard = entry.target;
                }
            }
        });
        
        // Setze nur eine Card als active (die mit dem größten Overlap)
        if (mostVisibleCard && mostVisibleCard !== currentActiveCard) {
            // Entferne active-State von vorheriger Card
            if (currentActiveCard && typeof currentActiveCard.classList !== 'undefined') {
                currentActiveCard.classList.remove('is-active');
                currentActiveCard.classList.add('is-inactive');
            }
            
            // Setze neue Card als active
            currentActiveCard = mostVisibleCard;
            if (typeof currentActiveCard.classList !== 'undefined') {
                currentActiveCard.classList.add('is-active');
                currentActiveCard.classList.remove('is-inactive');
            }
            
            // Markiere alle anderen sichtbaren Cards als inactive
            entries.forEach(entry => {
                if (entry.target !== mostVisibleCard && entry.isIntersecting) {
                    if (typeof entry.target.classList !== 'undefined') {
                        entry.target.classList.remove('is-active');
                        entry.target.classList.add('is-inactive');
                    }
                }
            });
        } else if (!mostVisibleCard && currentActiveCard) {
            // Wenn keine Card mehr sichtbar ist, entferne active-State
            if (typeof currentActiveCard.classList !== 'undefined') {
                currentActiveCard.classList.remove('is-active');
                currentActiveCard.classList.add('is-inactive');
            }
            currentActiveCard = null;
        }
    }, observerOptions);
    
    // Beobachte alle Cards
    learnCards.forEach(card => {
        try {
            // Initial: Alle Cards als inactive markieren (außer die erste)
            if (card && typeof card.classList !== 'undefined') {
                const cardIndex = Array.from(learnCards).indexOf(card);
                if (cardIndex === 0) {
                    // Erste Card initial als active (wird vom Observer überschrieben wenn nötig)
                    card.classList.add('is-active');
                } else {
                    card.classList.add('is-inactive');
                }
            }
            
            observer.observe(card);
        } catch (error) {
            console.error('Fehler beim Beobachten einer Card:', error);
        }
    });
    
    // Initiale Prüfung: Finde die Card, die aktuell am meisten sichtbar ist
    setTimeout(() => {
        try {
            let maxOverlap = 0;
            let mostVisible = null;
            
            learnCards.forEach(card => {
                if (card) {
                    const rect = card.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;
                    
                    const visibleTop = Math.max(0, rect.top);
                    const visibleBottom = Math.min(viewportHeight, rect.bottom);
                    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
                    
                    if (rect.height > 0) {
                        const overlap = visibleHeight / rect.height;
                        if (overlap > maxOverlap) {
                            maxOverlap = overlap;
                            mostVisible = card;
                        }
                    }
                }
            });
            
            if (mostVisible) {
                // Setze initiale active Card
                learnCards.forEach(card => {
                    if (card && typeof card.classList !== 'undefined') {
                        if (card === mostVisible) {
                            card.classList.add('is-active');
                            card.classList.remove('is-inactive');
                            currentActiveCard = card;
                        } else {
                            card.classList.remove('is-active');
                            card.classList.add('is-inactive');
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Fehler bei initialer Card-Prüfung:', error);
        }
    }, 100); // Kurze Verzögerung, damit DOM vollständig gerendert ist
}

// ===============================
// DAYFLOW CAROUSEL
// ===============================
let dayflowActiveIndex = 0;

/**
 * Render Day Flow carousel: Set .is-active only on activeIndex, remove from others
 */
function renderDayFlow() {
  const slides = Array.from(document.querySelectorAll('.dayflow-slide'));
  
  if (slides.length === 0) {
    console.warn('renderDayFlow: Keine .dayflow-slide Elemente gefunden.');
    return;
  }

  // Ensure activeIndex is within bounds
  if (dayflowActiveIndex < 0) {
    dayflowActiveIndex = 0;
  } else if (dayflowActiveIndex >= slides.length) {
    dayflowActiveIndex = slides.length - 1;
  }

  // Remove all hidden attributes and inline display styles, then toggle .is-active
  slides.forEach((slide, index) => {
    if (!slide) return;
    
    // Remove hidden attribute and inline display styles
    slide.removeAttribute('hidden');
    if (slide.style && slide.style.display) {
      slide.style.display = '';
    }
    
    // Toggle .is-active class
    if (index === dayflowActiveIndex) {
      slide.classList.add('is-active');
    } else {
      slide.classList.remove('is-active');
    }
  });

  // Update counter
  const counter = document.querySelector('.dayflow-counter');
  if (counter && slides.length > 0) {
    counter.textContent = `${dayflowActiveIndex + 1} / ${slides.length}`;
  }
}

/**
 * Initialize Day Flow carousel with event delegation
 */
function initDayflowCarousel() {
  // Query slides and ensure they're clean
  const slides = Array.from(document.querySelectorAll('.dayflow-slide'));
  
  if (slides.length === 0) {
    console.warn('initDayflowCarousel: Keine .dayflow-slide Elemente gefunden.');
    return;
  }

  // Reset activeIndex
  dayflowActiveIndex = 0;

  // Remove all hidden attributes and inline display styles from slides
  slides.forEach((slide) => {
    if (!slide) return;
    slide.removeAttribute('hidden');
    if (slide.style && slide.style.display) {
      slide.style.display = '';
    }
  });

  // Use event delegation on the carousel container
  const carousel = document.querySelector('.dayflow-carousel');
  if (!carousel) {
    console.warn('initDayflowCarousel: .dayflow-carousel nicht gefunden.');
    return;
  }

  // Event delegation for navigation buttons
  carousel.addEventListener('click', (e) => {
    const target = e.target;
    if (!target) return;

    // Check if clicked element or its parent is a navigation button
    const prevBtn = target.closest('.dayflow-prev');
    const nextBtn = target.closest('.dayflow-next');

    if (prevBtn) {
      e.preventDefault();
      const slides = Array.from(document.querySelectorAll('.dayflow-slide'));
      if (slides.length > 0) {
        dayflowActiveIndex = (dayflowActiveIndex - 1 + slides.length) % slides.length;
        renderDayFlow();
      }
    } else if (nextBtn) {
      e.preventDefault();
      const slides = Array.from(document.querySelectorAll('.dayflow-slide'));
      if (slides.length > 0) {
        dayflowActiveIndex = (dayflowActiveIndex + 1) % slides.length;
        renderDayFlow();
      }
    }
  });

  // Initial render
  renderDayFlow();
}

/**
 * Initialize Dayflow Legend: Update summary text on toggle
 */
function initDayflowLegend() {
  const legend = document.querySelector('.dayflow-legend');
  if (!legend) return;
  
  const summaryText = legend.querySelector('.dayflow-legend__summary-text');
  if (!summaryText) return;
  
  // Update text based on open state
  function updateSummaryText() {
    if (legend.hasAttribute('open')) {
      summaryText.textContent = 'Legende verbergen';
    } else {
      summaryText.textContent = 'Legende anzeigen';
    }
  }
  
  // Listen for toggle events
  legend.addEventListener('toggle', updateSummaryText);
  
  // Set initial text
  updateSummaryText();
}

// Warte auf DOM-Content-Loaded, dann initialisiere
// DOMContentLoaded ist besser als window.onload, da es früher feuert
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initializeApp();
      initDayflowCarousel();
      initDayflowLegend();
    });
} else {
    // DOM ist bereits geladen, initialisiere sofort
    initializeApp();
    initDayflowCarousel();
    initDayflowLegend();
}

(() => {
  const steps = ["start","innen","identitaet","system","exkurs","methoden","wrapup"];

  const stepBtns = Array.from(document.querySelectorAll("#stepbar button, #stepbar [role='tab']"));
  const pages = Array.from(document.querySelectorAll("#step-pages .step-page"));

  const learnTitleEl = document.querySelector(".learn-title");
  const dotsEl = document.querySelector(".learn-dots");
  const nextBtn = document.getElementById("learn-next-btn");

  // Helpers
  const getActiveStep = () => (document.querySelector("#stepbar button.active, #stepbar [role='tab'][aria-selected='true']")?.dataset.step) || "start";

  function showStep(stepKey, { scrollTop = true } = {}) {
    // Finde aktive und Ziel-Page
    const activePage = pages.find(p => !p.hidden);
    const targetPage = pages.find(p => p.dataset.stepPage === stepKey);
    
    // Verstecke alle Pages
    pages.forEach(p => {
      const isTarget = p.dataset.stepPage === stepKey;
      p.hidden = !isTarget;
    });

    // Trigger Animation nur wenn tatsächlich ein Wechsel passiert
    if (targetPage && activePage !== targetPage) {
      // Entferne alte entering-Klasse
      pages.forEach(p => p.classList.remove('step-entering'));
      
      // Setze Animation-Klasse für neue Page (nach kurzem Delay, damit DOM-Update fertig ist)
      requestAnimationFrame(() => {
        if (targetPage && !targetPage.hidden) {
          targetPage.classList.add('step-entering');
          
          // Entferne Klasse nach Animation (für zukünftige Wechsel)
          setTimeout(() => {
            targetPage.classList.remove('step-entering');
          }, 300); // Match animation duration (300ms)
        }
      });
    }

    // set active btn - CSS-Klassen werden automatisch über .active Klasse angewendet
    stepBtns.forEach(b => {
      const on = b.dataset.step === stepKey;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });

    // update learn nav for this step
    renderDotsForStep(stepKey);
    updateLearnNavByScroll(stepKey);

    if (scrollTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function getLearnCardsInStep(stepKey) {
    const page = pages.find(p => p.dataset.stepPage === stepKey);
    if (!page) return [];
    // learn-card Marker: class learn-card ODER data-learn-card
    return Array.from(page.querySelectorAll("[data-learn-card]"));
  }

  function renderDotsForStep(stepKey) {
    if (!dotsEl) return;
    const cards = getLearnCardsInStep(stepKey);

    dotsEl.innerHTML = cards.map((c, idx) => {
      const t = c.dataset.title || `Abschnitt ${idx+1}`;
      const safeTitle = escapeHtml(String(t));
      return `<button type="button" class="dot-hit" data-dot="${idx}" aria-label="${safeTitle}" title="${safeTitle}">
        <span class="learn-dot"></span>
      </button>`;
    }).join("");

    // dot click => scroll to learn card
    const dotBtns = Array.from(dotsEl.querySelectorAll(".dot-hit"));
    dotBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.dot);
        const el = cards[i];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      
      // Keyboard accessibility: Enter and Space
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const i = Number(btn.dataset.dot);
          const el = cards[i];
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  function setActiveDot(stepKey, index) {
    const dots = Array.from(dotsEl?.querySelectorAll(".dot-hit") || []);
    dots.forEach((d, i) => {
      const dot = d.querySelector(".learn-dot");
      if (dot) dot.classList.toggle("active", i === index);
      d.setAttribute("aria-selected", i === index ? "true" : "false");
    });
  }

  function updateLearnNavByScroll(stepKey) {
    const cards = getLearnCardsInStep(stepKey);
    if (!cards.length) {
      if (learnTitleEl) learnTitleEl.textContent = "—";
      return;
    }

    // find currently most visible card
    const top = window.scrollY + 140; // offset under sticky nav
    let activeIndex = 0;

    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      const y = rect.top + window.scrollY;
      if (y <= top) activeIndex = i;
    }

    const activeCard = cards[activeIndex];
    const title = activeCard?.dataset.title || "Abschnitt";
    if (learnTitleEl) learnTitleEl.textContent = title;

    setActiveDot(stepKey, activeIndex);
  }

  function goNext() {
    const stepKey = getActiveStep();
    const cards = getLearnCardsInStep(stepKey);

    // If no cards: next step
    if (!cards.length) {
      const idx = steps.indexOf(stepKey);
      showStep(steps[Math.min(idx + 1, steps.length - 1)]);
      return;
    }

    const top = window.scrollY + 140;
    let activeIndex = 0;
    for (let i = 0; i < cards.length; i++) {
      const y = cards[i].getBoundingClientRect().top + window.scrollY;
      if (y <= top) activeIndex = i;
    }

    const nextCard = cards[activeIndex + 1];
    if (nextCard) {
      nextCard.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // next step
      const idx = steps.indexOf(stepKey);
      if (idx < steps.length - 1) showStep(steps[idx + 1]);
    }
  }

  // Stepbar click - mit Vibration
  stepBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      vibrate(5);
      showStep(btn.dataset.step);
    });
  });

  // Next button - mit Vibration
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      vibrate(5);
      goNext();
    });
  }

  // Scroll listener to update title + dots
  window.addEventListener("scroll", () => {
    const stepKey = getActiveStep();
    // only update for visible step
    updateLearnNavByScroll(stepKey);
  }, { passive: true });

  // ===============================
  // MOBILE: Auto-hide learn-nav on scroll down (DESKTOP ONLY)
  // ===============================
  (function initMobileNavHide() {
    let lastScrollY = window.scrollY || window.pageYOffset;
    let ticking = false;
    const learnNav = safeQuerySelector('.learn-nav');
    
    if (!learnNav) return; // Exit early if learn-nav doesn't exist
    
    // Check if mobile (under 768px) - on mobile, learn-nav is hidden via CSS
    const isMobile = () => window.matchMedia('(max-width: 767px)').matches;
    
    // Check if learn-nav is visible (not hidden via CSS display:none)
    const isNavVisible = () => {
      if (!learnNav) return false;
      const style = window.getComputedStyle(learnNav);
      return style.display !== 'none';
    };
    
    function handleScroll() {
      // Skip if learn-nav is not visible (mobile or hidden)
      if (!isNavVisible()) {
        return;
      }
      
      if (!isMobile()) {
        // Desktop: handle scroll-hide behavior
        const currentScrollY = window.scrollY || window.pageYOffset;
        const scrollDelta = currentScrollY - lastScrollY;
        
        // Threshold: only hide/show if scrolled more than 5px
        if (Math.abs(scrollDelta) < 5) {
          lastScrollY = currentScrollY;
          return;
        }
        
        if (scrollDelta > 0 && currentScrollY > 100) {
          // Scrolling down: hide nav
          learnNav.classList.add('is-hidden');
        } else if (scrollDelta < 0) {
          // Scrolling up: show nav
          learnNav.classList.remove('is-hidden');
        }
        
        // Always show at top of page
        if (currentScrollY < 50) {
          learnNav.classList.remove('is-hidden');
        }
        
        lastScrollY = currentScrollY;
      }
      
      ticking = false;
    }
    
    // Throttle scroll events
    function onScroll() {
      if (!ticking && isNavVisible()) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Handle resize: reset state on desktop
    window.addEventListener('resize', () => {
      if (!isMobile() && isNavVisible() && learnNav) {
        learnNav.classList.remove('is-hidden');
      }
    }, { passive: true });
  })();

  // Init: show first active step (ohne Animation beim initialen Laden)
  const initial = stepBtns.find(b => b.classList.contains("active"))?.dataset.step || "start";
  const initialPage = pages.find(p => p.dataset.stepPage === initial);
  
  // Setze initiale Page ohne Animation
  pages.forEach(p => {
    p.hidden = p.dataset.stepPage !== initial;
  });
  
  // Setze active button - CSS-Klassen werden automatisch über .active Klasse angewendet
  stepBtns.forEach(b => {
    const on = b.dataset.step === initial;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", on ? "true" : "false");
  });
  
  // Initialisiere Learn Nav
  if (initialPage) {
    renderDotsForStep(initial);
    updateLearnNavByScroll(initial);
  }

})();


/*
 * ===================================================================
 * ENDE STRUKTURIERTER SCRIPT-BLOCK
 * ===================================================================
 * 
 * STRUKTUR ZUSAMMENFASSUNG:
 * - DATA LAYER: steps, phasesData, foundationData, methodsData, etc.
 * - HELPER FUNCTIONS: safeGetElement, safeQuerySelector, isChartJsReady
 * - UI FUNCTIONS: updateStep, updatePhaseUI, updateFoundation, etc.
 * - CHART FUNCTIONS: initializeCharts, initializeChartsNow, showChartError
 * - INITIALIZATION: validateCriticalIds, initializeApp, initializeAccordions
 * 
 * Alle Funktionen sind jetzt klar strukturiert und dokumentiert.
 * ===================================================================
 */
