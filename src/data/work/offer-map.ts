import type { CaseStudy } from './types';

// Offer-map demonstrator. Anonymized Arbeitsprobe (win-flip flag below).
// Alt text copied verbatim from public/work/INVENTORY.md (C1 verified strip-list-clean).
// Gallery order follows the approach narrative: map + clustering, filtering, radius
// search, accessible list, mobile.

export const offerMap: CaseStudy = {
  key: 'offer-map',
  slug: { de: 'angebotskarte', en: 'offer-map' },
  anonymized: true,
  // On award, set anonymized:false and fill these (single-file change):
  // liveUrl: 'https://...',
  // buyerName: '...',
  // namedTitle: { de: '...', en: '...' },
  images: [
    {
      src: '/work/offer-map-overview.png',
      width: 2560,
      height: 1396,
      alt: {
        en: 'Interactive offer map of Germany with clustered location markers; each cluster shows the number of offers it contains.',
        de: 'Interaktive Angebotskarte von Deutschland mit gebündelten Standort-Markern; jeder Cluster zeigt die Anzahl der enthaltenen Angebote.',
      },
      caption: {
        en: 'Country-wide map with category-aware marker clustering.',
        de: 'Bundesweite Karte mit kategorienbewusster Bündelung der Marker.',
      },
    },
    {
      src: '/work/offer-map-filters.png',
      width: 2560,
      height: 1396,
      alt: {
        en: 'Offer map with the filter bar showing active modality and target-group filters; the clustered markers update to the filtered subset.',
        de: 'Angebotskarte mit der Filterleiste, in der Modalitäts- und Zielgruppen-Filter aktiv sind; die Cluster aktualisieren sich auf die gefilterte Teilmenge.',
      },
      caption: {
        en: 'Filtering by modality and target group narrows the map live.',
        de: 'Filter nach Modalität und Zielgruppe grenzen die Karte live ein.',
      },
    },
    {
      src: '/work/offer-map-radius.png',
      width: 2560,
      height: 1396,
      alt: {
        en: 'Offer map showing a postal-code radius search: a 50-kilometre search circle around a city centre with the matching markers inside it.',
        de: 'Angebotskarte mit Umkreissuche nach Postleitzahl: ein 50-Kilometer-Suchradius um ein Stadtzentrum mit den darin liegenden Markern.',
      },
      caption: {
        en: 'Postal-code and radius search with a visible search circle.',
        de: 'Umkreissuche nach Postleitzahl mit sichtbarem Suchradius.',
      },
    },
    {
      src: '/work/offer-map-list.png',
      width: 2560,
      height: 1396,
      alt: {
        en: 'Offer map with the list-view panel open beside it, presenting the same results as a keyboard- and screen-reader-accessible list.',
        de: 'Angebotskarte mit geöffnetem Listen-Panel daneben, das dieselben Ergebnisse als tastatur- und screenreader-zugängliche Liste darstellt.',
      },
      caption: {
        en: 'Accessible list view as an equal-rank alternative to the map.',
        de: 'Barrierearme Listenansicht als gleichwertige Alternative zur Karte.',
      },
    },
    {
      src: '/work/offer-map-mobile.png',
      width: 1170,
      height: 1362,
      alt: {
        en: 'The offer map on a phone-width screen: the filter controls stack vertically above the map.',
        de: 'Die Angebotskarte auf einem Smartphone-Bildschirm: die Filtersteuerung stapelt sich vertikal über der Karte.',
      },
      caption: {
        en: 'Responsive mobile layout: filter controls stack above the map.',
        de: 'Responsives mobiles Layout: die Filtersteuerung stapelt sich über der Karte.',
      },
    },
  ],
};
