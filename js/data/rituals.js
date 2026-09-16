export const CAT_ORDER = ["Alltag","Schutz","Energie","Liebe","Trennung","Feld"];

export const RITUALS = [
  {
    "id": "dank",
    "t": "Tägliches Dankesritual",
    "s": "Gesundheit · Liebe · Geld · Schutz",
    "tag": "Alltag",
    "steps": [
      [
        "Ankommen",
        "Füße. Atem. Ich bin der Spieler. Der Beobachter ist wach."
      ],
      [
        "Dank",
        "Für jedes Thema dreimal: Danke für Gesundheit. Danke für Liebe. Danke für Geld und Versorgung. Danke für Schutz durch das Feld."
      ],
      [
        "Setzen",
        "Ich bin gesund. Es ist so. Ich bin geliebt. Es ist so. Ich bin versorgt. Es ist so. Ich bin geschützt. Es ist so."
      ],
      [
        "Siegel",
        "Optional Salz auf jede Kerze. Dies versiegelt und reinigt."
      ],
      [
        "Abschluss",
        "Dreimal: Danke für alles. Die Arbeit ist dem Feld übergeben."
      ]
    ]
  },
  {
    "id": "stopp",
    "t": "Schaden stoppen",
    "s": "Angriff endet. Feld zu.",
    "tag": "Schutz",
    "need": [
      "Name"
    ],
    "steps": [
      [
        "Schutz zuerst",
        "Ich bin in meiner Mitte. Mein Feld ist geschlossen. Nichts Fremdes hat Zutritt."
      ],
      [
        "Lage",
        "[Name] will schaden. Ich halte das hier auf. Ohne Hass. Ohne mich zu verlieren."
      ],
      [
        "Absicht",
        "Jeder Angriff von [Name] auf mich, mein Haus und meine Leute stoppt jetzt. Die Bahn ist zu."
      ],
      [
        "369",
        "3× Der Schaden stoppt. 6× Der Zugriff fällt ab. 9× Ich bin frei und geschützt. Es ist so."
      ],
      [
        "Grenze",
        "Kein Nachsetzen. Kein Zerlegen. Nur Stopp und Distanz."
      ],
      [
        "Rückkehr",
        "Ich bin nicht [Name]. Ich kehre vollständig zurück. Meine Energie gehört mir."
      ]
    ]
  },
  {
    "id": "schutz",
    "t": "Schutz selbst",
    "s": "Feld schliessen",
    "tag": "Schutz",
    "steps": [
      [
        "Ankommen",
        "Ich bin der Spieler. Der Beobachter ist wach. Ich handle aus klarer Mitte."
      ],
      [
        "Rahmen",
        "Ich öffne diesen Raum nur für Schutz. Nur das Stimmige und Reine darf hier sein."
      ],
      [
        "Absicht",
        "Ich schütze mich jetzt vollständig. Mein Feld ist geschlossen, klar und stabil. Jede fremde Energie prallt ab oder geht in die Erde. Meine Energie gehört allein mir."
      ],
      [
        "369",
        "3× Mein Schutz ist aktiv und stark. 6× Alles Fremde prallt ab und findet keinen Halt. 9× Ich bin klar, geschützt und bei mir."
      ],
      [
        "Abschluss",
        "Körpergrenze spüren. Der Schutz ist gesetzt und versiegelt."
      ]
    ]
  },
  {
    "id": "schutz2",
    "t": "Schutz für eine andere Person",
    "s": "Vor Arbeit oder Tag",
    "tag": "Schutz",
    "need": [
      "Name"
    ],
    "steps": [
      [
        "Mitte",
        "Ich bin in meiner Mitte. Ich richte mich auf [Name] aus, ohne mich zu verlieren."
      ],
      [
        "Absicht",
        "Das Feld von [Name] wird klar und geschützt. Die Energie bleibt bei [Name]. Alles Ziehende prallt ab."
      ],
      [
        "369",
        "3× Die Energie von [Name] ist geschützt. 6× Ihr Feld bleibt klar und geschlossen. 9× [Name] ist in der Kraft. Es ist so."
      ],
      [
        "Rückkehr",
        "Ich bin nicht [Name]. Ich kehre vollständig in mich zurück. Meine Energie gehört mir."
      ]
    ]
  },
  {
    "id": "heil",
    "t": "Heilung",
    "s": "Ergänzung zur Medizin",
    "tag": "Energie",
    "need": [
      "Name"
    ],
    "steps": [
      [
        "Rahmen",
        "Ich öffne nur für reine und stimmige Heilung. Arzt bleibt parallel."
      ],
      [
        "Absicht",
        "Die Wunde von [Name] findet jetzt natürliche, vollständige Heilung. Alles, was die Heilung behindert, löst sich."
      ],
      [
        "369",
        "3× Die Wunde von [Name] heilt vollständig. 6× Alles Störende löst sich. 9× Die Heilung ist im Gange."
      ],
      [
        "Rückkehr",
        "Ich bin nicht [Name]. Zum höchsten Wohl. Ich kehre vollständig zurück."
      ]
    ]
  },
  {
    "id": "trenn",
    "t": "Trennung — selbst",
    "s": "Nur der Faden",
    "tag": "Trennung",
    "need": [
      "Name"
    ],
    "steps": [
      [
        "Rahmen",
        "Ich öffne nur für klare Trennung. Ich bleibe in meiner Mitte."
      ],
      [
        "Absicht",
        "Die Verbindung zwischen mir und [Name] löst sich. Alle unstimmigen Fäden werden getrennt. Ich lasse frei und werde frei."
      ],
      [
        "Grenze",
        "Nur der Faden. Kein Urteil. Kein Nachsetzen."
      ],
      [
        "369",
        "3× Die Verbindung löst sich. 6× Fäden fallen ab und kehren zum Ursprung. 9× Die Trennung ist vollzogen."
      ],
      [
        "Rückkehr",
        "Ich bin nicht [Name]. Ich kehre vollständig in mich zurück. Meine Energie gehört mir."
      ]
    ]
  },
  {
    "id": "trenn2",
    "t": "Trennung zweier anderer",
    "s": "Nur der Faden",
    "tag": "Trennung",
    "need": [
      "A",
      "B"
    ],
    "steps": [
      [
        "Position",
        "Ich bleibe in meiner Mitte. Ihre Wege gehören ihnen. Den Faden zwischen ihnen wahrnehmen, nicht den zu dir."
      ],
      [
        "Absicht",
        "Die unstimmige Verbindung zwischen [A] und [B] löst sich. Jeder gehört wieder sich selbst. Ohne Hass, ohne Schaden."
      ],
      [
        "369",
        "3× Die Verbindung zwischen [A] und [B] löst sich. 6× Die Fäden fallen ab. 9× Sie sind voneinander frei."
      ],
      [
        "Rückkehr",
        "Ich bin nicht [A]. Ich bin nicht [B]. Ich kehre vollständig zurück."
      ]
    ]
  },
  {
    "id": "wesen",
    "t": "Nur wenn nötig — Wesenheit",
    "s": "Fragen, begrenzen, entlassen",
    "tag": "Feld",
    "need": [
      "A",
      "B"
    ],
    "steps": [
      [
        "Prüfen",
        "Nur wenn der einfache Faden nicht reicht. Sonst zurück zur Lösung ohne Wesenheit."
      ],
      [
        "Schutz",
        "Ich öffne nur für klare Hilfe. Unklares bleibt draußen. Ich behalte den Raum."
      ],
      [
        "Fragen",
        "Wer bereit und geeignet ist, die Verbindung zwischen [A] und [B] zu lösen, möge sich zeigen."
      ],
      [
        "Auftrag",
        "Nur Trennung. Kein unnötiger Schaden. Der Auftrag endet mit der Lösung."
      ],
      [
        "Entlassen",
        "Danke. Wenn erfüllt, bist du frei. Verbindungen zu mir lösen sich. Kontakt beendet."
      ],
      [
        "Rückkehr",
        "Ich bin nicht [A]. Ich bin nicht [B]. Ich kehre vollständig zurück. Meine Energie gehört mir."
      ]
    ]
  },
  {
    "id": "liebe",
    "t": "Liebesritual",
    "s": "Anziehung ohne Zwang",
    "tag": "Liebe",
    "need": [
      "Name"
    ],
    "steps": [
      [
        "Rahmen",
        "Ich öffne nur für stimmige Liebe. Kein Festhalten. Kein Brechen des Willens."
      ],
      [
        "Absicht",
        "Zwischen mir und [Name] darf sich stimmige Nähe zeigen. Wärme, Kontakt, Ehrlichkeit. Nur wenn es für beide wahr ist."
      ],
      [
        "369",
        "3× Die Anziehung ist klar. 6× Der Weg öffnet sich leicht. 9× Liebe findet uns, wenn sie stimmig ist."
      ],
      [
        "Grenze",
        "Kein Zwang. Kein Kleben. Jeder bleibt frei."
      ],
      [
        "Rückkehr",
        "Ich bin nicht [Name]. Ich kehre vollständig in mich zurück."
      ]
    ]
  },
  {
    "id": "anz",
    "t": "Anziehung und Kontakt",
    "s": "Nur wenn stimmig",
    "tag": "Liebe",
    "need": [
      "Name"
    ],
    "steps": [
      [
        "Rahmen",
        "Nur stimmiger Kontakt. Kein Festhalten."
      ],
      [
        "Absicht",
        "[Name] fühlt die Anziehung. Kontakt geschieht leicht und natürlich. Nur wenn es für beide stimmig ist."
      ],
      [
        "369",
        "3× Die Anziehung ist da. 6× Der Kontakt findet den Weg. 9× Es ist so."
      ],
      [
        "Rückkehr",
        "Ich kehre in mich zurück. Die Arbeit ist übergeben."
      ]
    ]
  },
  {
    "id": "karma",
    "t": "Karma-Ausgleich",
    "s": "Nicht Rache",
    "tag": "Energie",
    "steps": [
      [
        "Schutz",
        "Erst das eigene Feld schliessen."
      ],
      [
        "Absicht",
        "Was mir genommen oder aufgeladen wurde, kehrt in stimmiger Form zurück. Der Ausgleich geschieht ohne Hass. Die Last darf gehen."
      ],
      [
        "369",
        "3× Der Ausgleich geschieht. 6× Die Energie kehrt rein zurück. 9× Es ist vollendet."
      ],
      [
        "Abschluss",
        "Abgeben. Nicht nachkontrollieren."
      ]
    ]
  },
  {
    "id": "finst",
    "t": "Finsternis",
    "s": "Verstärken und versiegeln",
    "tag": "Feld",
    "steps": [
      [
        "Rahmen",
        "Ich öffne nur für klare Arbeit. Die Kraft darf lösen, klären und verstärken, was bereits im Feld ist."
      ],
      [
        "Absicht",
        "Was nicht mehr stimmig ist, darf abfallen. Was gesetzt und wahr ist, wird gestärkt. Mein Feld bleibt klar."
      ],
      [
        "369",
        "3× Altes löst sich. 6× Das Feld klärt und verstärkt. 9× Es ist gesetzt und vollendet."
      ],
      [
        "Abschluss",
        "Die Arbeit wirkt. Ich danke und schliesse."
      ]
    ]
  },
  {
    "id": "ahn",
    "t": "Ahnenkontakt",
    "s": "Ehren und begrenzen",
    "tag": "Feld",
    "need": [
      "Name"
    ],
    "steps": [
      [
        "Rahmen",
        "Nur für [Name], klar und stimmig. Last bleibt draußen."
      ],
      [
        "Einladung",
        "[Name], wenn du bereit und willens bist, zeige dich. Ich möchte verstehen, nicht übernehmen."
      ],
      [
        "Grenze",
        "Ich ehre dich und die Linie. Ich gehöre mir selbst. Ungesunde Muster lasse ich nicht in mein Leben."
      ],
      [
        "Schluss",
        "Danke. Du kannst in Frieden gehen. Ich schliesse den Kontakt. Meine Energie gehört mir."
      ]
    ]
  },
  {
    "id": "fremd",
    "t": "Fremde Wesenheit",
    "s": "Kurz. Hartes Ende",
    "tag": "Feld",
    "steps": [
      [
        "Rahmen",
        "Nur klare, erkennbare Wesenheit ohne Täuschung. Ich behalte den Raum."
      ],
      [
        "Einladung",
        "Wer bereit und in der Lage ist, sich klar zu zeigen, möge sich melden."
      ],
      [
        "Prüfen",
        "Bleibt die eigene Mitte? Klar oder neblig? Druck oder Ruhe? Bei Unklarheit sofort schliessen."
      ],
      [
        "Ende",
        "Der Kontakt ist beendet. Alle Verbindungen lösen sich. Du gehst und bleibst nicht. Der Raum gehört mir."
      ]
    ]
  },
  {
    "id": "zur",
    "t": "Energie zurückholen",
    "s": "Nach Kontakt",
    "tag": "Energie",
    "steps": [
      [
        "Absicht",
        "Alles, was von mir genommen wurde oder an mir hängt, kehrt jetzt rein und vollständig zu mir zurück. Fremde Energie löst sich und geht."
      ],
      [
        "Lage",
        "Ich bin klar, ruhig und bei mir."
      ],
      [
        "Abschluss",
        "Danach Wasser, Körper, Alltag."
      ]
    ]
  },
  {
    "id": "fil",
    "t": "Filterübung",
    "s": "Kein Auftrag",
    "tag": "Feld",
    "steps": [
      [
        "Filter",
        "Nur klare, stimmige Präsenz. Was drängt, bleibt draußen."
      ],
      [
        "Zeigen",
        "Nur zeigen. Nicht fragen. Nicht anfreunden. Kein Auftrag."
      ],
      [
        "Schliessen",
        "Kontakt beendet. Verbindungen lösen sich. Der Raum gehört mir."
      ]
    ]
  }
];

export function ritualById(id) {
  return RITUALS.find((r) => r.id === id);
}
