// Single source of truth for the legal entity (Impressum, footer, JSON-LD).
// Editing the register line is a one-line change here.
//
// Register fact per the Handelsregisterauszug (Abruf 2026-05-09): seat München,
// Registergericht Amtsgericht München, HRB 287814. The Düsseldorf Fährstraße address
// is the Geschäftsanschrift only. This is NOT "Handelsregister Düsseldorf".
// Confirm against handelsregister.de immediately before the Impressum goes public (G1).
//
// No phone field: per the USER OVERRIDE the mobile number must not appear on any public
// surface. The Impressum's second contact means is email + a monitored contact form.

export const legal = {
  legalName: '9592 Solutions UG (haftungsbeschränkt)',
  street: 'Fährstraße 217',
  postalCode: '40221',
  city: 'Düsseldorf',
  countryCode: 'DE',
  managingDirector: 'Christo Wilken',
  registerCourt: 'Amtsgericht München',
  registerNumber: 'HRB 287814',
  vatId: 'DE364316497',
  email: 'christo@9592.tech',
  // Legal seat (Sitz) per the register; distinct from the Geschäftsanschrift (city).
  seat: 'München',
  // Operative base, used in narrative copy only (outward "based in Berlin" convention).
  operativeCity: 'Berlin',
} as const;
