-- ============================================================
-- CLARITY APP – Seed Data
-- Ausführen NACH 01_schema.sql
-- ============================================================

-- ── WERTE ────────────────────────────────────────────────────
insert into public.inner_values (label, description, icon, sort_order) values
('Freiheit',       'Selbstbestimmung und Unabhängigkeit in Entscheidungen',    '🕊️', 1),
('Verantwortung',  'Verlässlichkeit und Übernahme von Konsequenzen',           '⚖️', 2),
('Wachstum',       'Kontinuierliche Entwicklung und Lernen',                   '🌱', 3),
('Authentizität',  'Im Einklang mit sich selbst handeln',                      '💎', 4),
('Integrität',     'Ehrlichkeit und Konsistenz zwischen Wort und Tat',         '🏔️', 5),
('Verbindung',     'Tiefe Beziehungen und echtes Miteinander',                 '🤝', 6),
('Exzellenz',      'Höchste Qualität in allem was man tut',                    '⭐', 7),
('Gesundheit',     'Körperliches und mentales Wohlbefinden als Basis',         '💚', 8),
('Kreativität',    'Ideen entwickeln und etwas Neues erschaffen',              '✨', 9),
('Mut',            'Handeln trotz Unsicherheit und Risiko',                    '🦁', 10),
('Fairness',       'Gerechtigkeit und gleiche Chancen für alle',               '⚡', 11),
('Beständigkeit',  'Langfristige Verlässlichkeit und Stabilität',              '🧱', 12)
on conflict do nothing;

-- ── STÄRKEN ──────────────────────────────────────────────────
insert into public.inner_strengths (label, description, icon, sort_order) values
('Analytik',       'Komplexe Zusammenhänge durchdringen und strukturieren',    '🔍', 1),
('Empathie',       'Emotionen anderer wahrnehmen und verstehen',               '💛', 2),
('Strategie',      'Langfristig denken und klare Pläne entwickeln',            '♟️', 3),
('Kommunikation',  'Ideen klar und überzeugend vermitteln',                    '💬', 4),
('Umsetzung',      'Ideen schnell und konsequent in Handlungen überführen',    '🚀', 5),
('Kreativität',    'Neue Ideen und ungewöhnliche Lösungen entwickeln',         '🎨', 6),
('Fokus',          'Prioritäten setzen und tief in Aufgaben eintauchen',       '🎯', 7),
('Führung',        'Andere inspirieren, motivieren und begleiten',             '👑', 8),
('Resilienz',      'Nach Rückschlägen schnell zurückfinden',                   '💪', 9),
('Lernen',         'Wissen schnell aufnehmen und anwenden',                    '📚', 10),
('Disziplin',      'Konsistent handeln auch ohne Motivation',                  '⚙️', 11),
('Neugier',        'Tief in neue Themen eintauchen und hinterfragen',          '🔭', 12)
on conflict do nothing;

-- ── ANTREIBER ────────────────────────────────────────────────
insert into public.inner_drivers (label, description, icon, sort_order) values
('Sei perfekt',     'Hoher Qualitätsanspruch, Detailverliebtheit',             '✅', 1),
('Sei stark',       'Unabhängigkeit, Probleme alleine lösen',                  '💪', 2),
('Beeil dich',      'Schnelligkeit, viel erledigen, ungeduldig bei Langsamkeit','⚡', 3),
('Streng dich an', 'Fleiß und harte Arbeit als Selbstzweck',                  '🔥', 4),
('Mach es recht',  'Harmonie, Konflikte vermeiden, es allen recht machen',     '🕊️', 5),
('Sei der Beste',  'Wettbewerb, Vergleich, besser sein als andere',            '🏆', 6),
('Sei vorsichtig', 'Risiken minimieren, absichern bevor handeln',              '🛡️', 7),
('Sei beliebt',    'Anerkennung und Zugehörigkeit suchen',                     '🌟', 8)
on conflict do nothing;

-- ── PERSÖNLICHKEIT (Big Five) ────────────────────────────────
insert into public.inner_personality_dimensions (label, low_label, high_label, description, sort_order) values
('Offenheit',        'Konservativ & routiniert',    'Kreativ & neugierig',      'Bereitschaft für neue Erfahrungen, Kreativität', 1),
('Gewissenhaftigkeit','Spontan & flexibel',          'Organisiert & diszipliniert','Planung, Zuverlässigkeit, Selbstkontrolle',   2),
('Extraversion',     'Introvertiert & still',        'Extrovertiert & aktiv',    'Energie aus sozialen Kontakten oder Einsamkeit', 3),
('Verträglichkeit',  'Kompetitiv & direkt',          'Kooperativ & fürsorglich', 'Mitgefühl, Kooperation, Vertrauen',             4),
('Neurotizismus',    'Stabil & gelassen',             'Sensibel & reaktiv',       'Emotionale Stabilität vs. Reaktivität',         5)
on conflict do nothing;

-- ── IDENTITY PILLARS & ROLES ─────────────────────────────────
insert into public.identity_pillars (label, icon, sort_order) values
('Beruf & Leistung', '💼', 1),
('Beziehungen',      '🤝', 2),
('Gesundheit',       '💚', 3),
('Wachstum',         '🌱', 4),
('Beitrag',          '🌍', 5)
on conflict do nothing;

-- Roles per pillar (using subquery for pillar_id)
insert into public.identity_roles (pillar_id, label, description, sort_order)
select p.id, r.label, r.description, r.sort_order
from public.identity_pillars p
join (values
  ('Beruf & Leistung', 'Unternehmer',   'Du erschaffst etwas Eigenes und trägst Verantwortung', 1),
  ('Beruf & Leistung', 'Experte',       'Du vertiefst dein Wissen und wirst zur Autorität',     2),
  ('Beruf & Leistung', 'Gestalter',     'Du bringst Ideen in die Welt und veränderst Abläufe',  3),
  ('Beruf & Leistung', 'Problemlöser',  'Du findest Lösungen wo andere aufgeben',               4),
  ('Beziehungen',      'Partner',       'Du pflegst tiefe, verlässliche Beziehungen',           5),
  ('Beziehungen',      'Mentor',        'Du begleitest andere auf ihrem Weg',                   6),
  ('Beziehungen',      'Connector',     'Du verbindest Menschen und schaffst Gemeinschaft',     7),
  ('Gesundheit',       'Athlet',        'Du trainierst bewusst und lebst körperlich aktiv',     8),
  ('Gesundheit',       'Regenerator',   'Du schützt deine Energie und erholst dich bewusst',   9),
  ('Wachstum',         'Lernender',     'Du konsumierst Wissen aktiv und wendest es an',       10),
  ('Wachstum',         'Reflektierer',  'Du hinterfragst dich und entwickelst dich weiter',    11),
  ('Beitrag',          'Vorbild',       'Du lebst die Werte, die du dir von anderen wünschst', 12)
) as r(pillar, label, description, sort_order)
on p.label = r.pillar
on conflict do nothing;

-- ── KNOWLEDGE SNACKS ─────────────────────────────────────────
insert into public.knowledge_snacks (title, preview, content, tags, loop_area, read_time_minutes) values
('Warum Willenskraft keine Strategie ist',
 'Willenskraft ist eine endliche Ressource. Wer darauf baut, scheitert täglich.',
 'Willenskraft verhält sich wie ein Muskel: Sie ermüdet mit jeder Entscheidung, die du im Laufe des Tages triffst. Forscher nennen das "Decision Fatigue". Die gute Nachricht: Du brauchst keine unendliche Willenskraft – du brauchst ein System, das Entscheidungen im Voraus trifft.\n\nDas LOOP-Prinzip: Lass Strukturen für dich arbeiten statt gegen deine Biologie zu kämpfen. Wer seinen Tag vorplant, Routinen verankert und Umgebungen gestaltet, muss weniger "wollen" – er handelt einfach.',
 ARRAY['willenskraft','system','gewohnheit'], 'output', 4),

('Die 66-Tage-Wahrheit über Gewohnheiten',
 'Vergiss 21 Tage. Die Wissenschaft sagt: echte Automatisierung braucht mehr.',
 'Der Mythos der 21 Tage stammt aus einer Fehlinterpretation. Dr. Phillippa Lally (UCL) zeigte in ihrer Studie, dass es durchschnittlich 66 Tage dauert, bis eine Handlung zur echten Gewohnheit wird – und bei komplexen Verhaltensweisen bis zu 254 Tage.\n\nWas das bedeutet: Gib dir Zeit. Die ersten 3 Wochen sind nicht das Ende – sie sind der Anfang des schwierigsten Abschnitts. Der Widerstand zwischen Tag 11 und 30 ist biologisch normal, kein Versagen.',
 ARRAY['gewohnheit','wissenschaft','geduld'], 'progress', 3),

('Das Nervensystem zuerst',
 'Du kannst nicht produktiv sein, wenn dein Nervensystem auf Alarm steht.',
 'Das autonome Nervensystem kennt zwei Modi: Sympathikus (Kampf/Flucht, Leistung) und Parasympathikus (Ruhe, Erholung). Moderner Dauerstress hält viele dauerhaft im Sympathikus-Modus – mit Folgen für Fokus, Schlaf und Entscheidungsqualität.\n\nWas hilft: Gezieltes Runterfahren durch Atemübungen (langer Ausatem aktiviert den Parasympathikus), Natur, Wärme und soziale Sicherheit. Off ist kein Luxus – es ist die Voraussetzung für stabilen Output.',
 ARRAY['nervensystem','erholung','stress'], 'off', 3),

('Dopamin richtig nutzen',
 'Nicht das Erreichen des Ziels, sondern der Weg dorthin aktiviert Dopamin.',
 'Dopamin ist kein "Belohnungshormon" – es ist ein "Erwartungshormon". Es wird ausgeschüttet, wenn wir auf ein Ziel zusteuern, nicht erst wenn wir ankommen. Das erklärt, warum das Erreichen von Zielen oft leer wirkt.\n\nFür dein System bedeutet das: Mach den Prozess sichtbar. Fortschrittsbalken, Streaks, Check-ins – sie alle aktivieren Dopamin auf dem Weg, nicht erst am Ende. Belohne das Tun, nicht nur das Ergebnis.',
 ARRAY['dopamin','motivation','biologie'], 'load', 4),

('Identitätsbasierte Gewohnheiten',
 'Der stärkste Hebel für dauerhafte Veränderung: Wer du bist, nicht was du tust.',
 'James Clear (Atomic Habits) beschreibt drei Ebenen der Veränderung: Ergebnisse, Prozesse und Identität. Die meisten starten bei Ergebnissen ("Ich will abnehmen"). Identitätsveränderung startet innen: "Ich bin jemand, der sich bewegt."\n\nJede Handlung ist eine Stimme für dein Selbstbild. Wenn du zweimal trainierst, bist du kein Sportler. Wenn du zehnmal trainierst, fängst du an, dich als Sportler zu fühlen. Identität entsteht durch Beweis, nicht durch Entscheidung.',
 ARRAY['identitaet','gewohnheit','selbstbild'], 'progress', 4),

('Warum Morgenroutinen oft scheitern',
 'Nicht fehlende Disziplin – falsche Erwartungen ruinieren die meisten Routinen.',
 'Die meisten Morgenroutinen scheitern aus demselben Grund: Sie werden zu groß gebaut. 90-Minuten-Morgenroutinen, die Meditation, Sport, Journaling und Planung kombinieren, sind fragil – jede Störung bricht sie zusammen.\n\nDie Alternative: Baseline zuerst. Definiere das Minimum, das jeden Tag gilt. 2 Dinge statt 8. Wenn mehr geht, gut. Wenn nicht, ist die Baseline gehalten. Konsistenz schlägt Perfektionismus bei Gewohnheiten immer.',
 ARRAY['morgenroutine','konsistenz','baseline'], 'output', 3),

('Fokus als erschöpfliche Ressource',
 'Deep Work ist limitiert. Wer das ignoriert, produziert Quantität statt Qualität.',
 'Cal Newport und neurowissenschaftliche Forschung zeigen: Echter tiefer Fokus ist auf 3–5 Stunden pro Tag begrenzt. Danach sinkt die kognitive Leistungsfähigkeit dramatisch – auch wenn man sich beschäftigt fühlt.\n\nDie Konsequenz: Plane deine wichtigsten Aufgaben in deine Hochenergiezeit. Schütze diese Fenster vor Meetings und Ablenkungen. Erkenne, dass "mehr Stunden" selten mehr Output bedeutet – aber bessere Energie fast immer.',
 ARRAY['fokus','deep-work','produktivitaet'], 'load', 4),

('Off ist produktiv',
 'Erholung ist keine Pause von der Arbeit – sie ist ein Teil davon.',
 'Leistungssportler wissen es längst: Regeneration ist Teil des Trainingsplans, nicht eine Pause davon. Übertraining ohne ausreichende Erholung führt zu Leistungsabfall, nicht -steigerung.\n\nDasselbe gilt für mentale Arbeit. Schlaf konsolidiert Lernprozesse, aktiviert das Default Mode Network (kreatives Denken) und reguliert Emotionen. Wer Off systematisch plant, arbeitet langfristig produktiver als jemand, der immer "on" ist.',
 ARRAY['erholung','schlaf','regeneration'], 'off', 3)
on conflict do nothing;
