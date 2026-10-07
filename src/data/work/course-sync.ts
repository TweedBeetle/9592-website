import type { CaseStudy } from './types';

// CourseSync (Make.com) demonstrator. Anonymized Arbeitsprobe (win-flip flag below).
// Everything here is true of the public demo page (course-sync-demo.9592.tech,
// invented data) and its build history; nothing comes from a client's production
// system. Screenshots: scripts/capture-work-screenshots.mjs coursesync, which
// neutralizes the spec poster's list naming before each shot.
// Gallery order follows the approach narrative: whole flow, list match, duplicate
// check, staff-approved confirmation.

export const courseSync: CaseStudy = {
  key: 'course-sync',
  slug: { de: 'make-kursanmeldungen', en: 'make-course-enrollments' },
  anonymized: true,
  // On permission to name the client, set anonymized:false and fill these:
  // liveUrl: 'https://...',
  // buyerName: '...',
  // namedTitle: { de: '...', en: '...' },
  labelDef: {
    en: 'A working Make.com build on invented data, with a walkthrough page and an importable blueprint. It is a work sample, not a customer project and not a product.',
    de: 'Ein lauffähiger Make.com-Aufbau mit erfundenen Daten, mit Begleitseite und importierbarem Blueprint. Es ist eine Arbeitsprobe, kein Kundenprojekt und kein Produkt.',
  },
  images: [
    {
      src: '/work/coursesync-flow.png',
      width: 1360,
      height: 1402,
      alt: {
        en: 'Flowchart of the scenario: a MindBody purchase webhook, an override check, a ten-minute wait, a read-only booking check, the date-range list match and a duplicate check, ending in steps 2 to 6. Three side branches stop the run: no session booked (email the parents), no single matching list (flag the admin), and already processed.',
        de: 'Ablaufdiagramm des Szenarios: Kauf-Webhook aus MindBody, Prüfung des Häkchens, zehn Minuten Wartezeit, Buchungsabfrage ohne Änderungen in MindBody, Listenauswahl über den Zeitraum und Duplikatprüfung, am Ende die Schritte 2 bis 6. Drei Seitenzweige beenden den Lauf: kein Termin gebucht (E-Mail an die Eltern), keine eindeutige Liste (Meldung an die Verwaltung) und bereits verarbeitet.',
      },
      caption: {
        en: 'The whole flow, with the three places where the scenario stops. Two of them hand the case to a person.',
        de: 'Der ganze Ablauf mit den drei Stellen, an denen das Szenario anhält. An zwei davon übernimmt ein Mensch.',
      },
    },
    {
      src: '/work/coursesync-segment-match.png',
      width: 1280,
      height: 492,
      alt: {
        en: 'Timeline from June to August with a booked session on July 13 and three class lists. The HS list running July 6 to 17 matches. A June list ends too early, and a list starting July 13 is for the MS level, so neither matches.',
        de: 'Zeitleiste von Juni bis August mit einem gebuchten Termin am 13. Juli und drei Klassenlisten. Die HS-Liste vom 6. bis 17. Juli passt. Eine Juni-Liste endet zu früh, und eine Liste ab dem 13. Juli gehört zur Stufe MS, also passen beide nicht.',
      },
      caption: {
        en: 'Choosing the class list: only one list covers the booked date and matches the course level.',
        de: 'Auswahl der Klassenliste: Nur eine Liste deckt das Buchungsdatum ab und passt zur Stufe des Kurses.',
      },
    },
    {
      src: '/work/coursesync-dedup.png',
      width: 1640,
      height: 864,
      alt: {
        en: 'Walkthrough card for the duplicate check, showing the HubSpot list-membership call and the simplified logic: if the contact is already in the target list, stop.',
        de: 'Karte der Begleitseite zur Duplikatprüfung mit dem Aufruf der HubSpot-Listenmitgliedschaft und der vereinfachten Logik: Steht der Kontakt schon auf der Zielliste, endet der Lauf.',
      },
      caption: {
        en: 'The duplicate check: a student already on the class list means the purchase has been handled.',
        de: 'Die Duplikatprüfung: Steht der Kontakt schon auf der Klassenliste, ist der Kauf bereits verarbeitet.',
      },
    },
    {
      src: '/work/coursesync-draft-confirmation.png',
      width: 1640,
      height: 536,
      alt: {
        en: 'Walkthrough card for step 6: the confirmation is built from a HubSpot template and sent to an admin as a draft with the subject prefix DRAFT COURSE CONF, not straight to the family.',
        de: 'Karte der Begleitseite zu Schritt 6: Die Bestätigung entsteht aus einer HubSpot-Vorlage und geht als Entwurf mit dem Betreff-Präfix DRAFT COURSE CONF an die Verwaltung, nicht direkt an die Familie.',
      },
      caption: {
        en: 'The confirmation to the parents goes to an admin as a draft first.',
        de: 'Die Bestätigung an die Eltern geht zuerst als Entwurf an die Verwaltung.',
      },
    },
  ],
};
