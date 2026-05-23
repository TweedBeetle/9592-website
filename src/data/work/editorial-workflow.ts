import type { CaseStudy } from './types';

// Editorial-CMS demonstrator. Anonymized Arbeitsprobe (win-flip flag below).
// Alt text copied verbatim from public/work/INVENTORY.md (C1 verified strip-list-clean).
// Gallery order follows the approach narrative: persona switch, contributor submission,
// editor intake queue, change diff, reminder pipeline, audit log.

export const editorialWorkflow: CaseStudy = {
  key: 'editorial-workflow',
  slug: { de: 'redaktions-workflow', en: 'editorial-workflow' },
  anonymized: true,
  // On award, set anonymized:false and fill these (single-file change):
  // liveUrl: 'https://...',
  // buyerName: '...',
  // namedTitle: { de: '...', en: '...' },
  images: [
    {
      src: '/work/editorial-personas.png',
      width: 2560,
      height: 1120,
      alt: {
        en: 'Editorial CMS header with a demo persona selector for the public view, a contributor, and an editor, above the public list of published offers.',
        de: 'Kopfzeile des Redaktions-CMS mit einer Demo-Persona-Auswahl für öffentliche Ansicht, Eintragende und Redaktion, über der öffentlichen Liste veröffentlichter Angebote.',
      },
      caption: {
        en: 'A demo persona switch between the public view, a contributor, and an editor.',
        de: 'Eine Demo-Persona-Auswahl zwischen öffentlicher Ansicht, Eintragenden und Redaktion.',
      },
    },
    {
      src: '/work/editorial-submit.png',
      width: 2048,
      height: 2154,
      alt: {
        en: "A contributor's five-step \"new offer\" form, on the first step, with title, description, category and target-group selectors.",
        de: 'Das fünfstufige Formular „Neues Angebot" der Eintragenden, im ersten Schritt, mit Titel, Beschreibung, Kategorie und Zielgruppen-Auswahl.',
      },
      caption: {
        en: 'Contributor submission: a five-step offer form with conditional fields.',
        de: 'Einreichung: ein fünfstufiges Angebotsformular mit bedingten Feldern.',
      },
    },
    {
      src: '/work/editorial-intake-queue.png',
      width: 2560,
      height: 1720,
      alt: {
        en: "The editor's intake queue showing a submitted offer expanded into a preview, with publish, return-with-note and edit actions.",
        de: 'Die Eingangs-Queue der Redaktion mit einem zur Vorschau ausgeklappten eingereichten Angebot und Aktionen zum Veröffentlichen, Zurücksenden und Bearbeiten.',
      },
      caption: {
        en: 'Editor intake queue: a submitted offer expanded for review.',
        de: 'Eingangs-Queue der Redaktion: ein eingereichtes Angebot zur Prüfung ausgeklappt.',
      },
    },
    {
      src: '/work/editorial-diff.png',
      width: 1968,
      height: 786,
      alt: {
        en: 'A change request to a published offer, shown as a before-and-after comparison of the title and description fields.',
        de: 'Ein Änderungswunsch zu einem veröffentlichten Angebot, dargestellt als Vorher-Nachher-Vergleich der Felder Titel und Beschreibung.',
      },
      caption: {
        en: 'A change request shown as a before-and-after field comparison.',
        de: 'Ein Änderungswunsch als Vorher-Nachher-Vergleich der Felder.',
      },
    },
    {
      src: '/work/editorial-reminders.png',
      width: 2560,
      height: 1720,
      alt: {
        en: "The reminder pipeline's preview outbox: generated reminder emails for an offer across the day-0 / 30 / 60 / 90 escalation stages.",
        de: 'Der Vorschau-Postausgang der Reminder-Pipeline: erzeugte Reminder-Mails für ein Angebot über die Eskalationsstufen Tag 0 / 30 / 60 / 90.',
      },
      caption: {
        en: 'The reminder pipeline: generated reminder emails in the preview outbox.',
        de: 'Die Reminder-Pipeline: erzeugte Reminder-Mails im Vorschau-Postausgang.',
      },
    },
    {
      src: '/work/editorial-audit-log.png',
      width: 2048,
      height: 1160,
      alt: {
        en: 'The audit log for a single offer: a chronological timeline of state transitions (created, submitted, published) with actor and timestamp.',
        de: 'Das Audit-Log eines einzelnen Angebots: eine chronologische Zeitleiste der Statusübergänge (erstellt, eingereicht, veröffentlicht) mit Akteur und Zeitstempel.',
      },
      caption: {
        en: 'The audit log: a chronological timeline of state transitions for one entry.',
        de: 'Das Audit-Log: eine chronologische Zeitleiste der Statusübergänge eines Eintrags.',
      },
    },
  ],
};
