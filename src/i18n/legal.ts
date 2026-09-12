// Single source of truth for the legal entity (Impressum, footer, JSON-LD).
// Editing the register line is a one-line change here.
//
// Register fact per the Handelsregisterauszug (Abruf 2026-05-09): seat München,
// Registergericht Amtsgericht München, HRB 287814. The Düsseldorf Fährstraße address
// is the Geschäftsanschrift only. This is NOT "Handelsregister Düsseldorf".
// Confirm against handelsregister.de immediately before the Impressum goes public (G1).
//
// Phone: the 9592 business line (Vodafone CallYa, set up 2026-07-15), published 2026-09-12 on
// Christo's "publish". The USER OVERRIDE it replaces is still live and still load-bearing — the
// PERSONAL mobile (+49 172 767 7643) must not appear on any public surface — and the reason the
// Impressum ran on email + contact form for months was that no other number existed. A dedicated
// business line is what makes publishing a phone possible at all.
// Why publish rather than keep the form: § 5 (1) no. 2 DDG wants a second means of fast electronic
// contact, and a contact form alone has been litigated as borderline (research/presence-findings.md).
// Email + phone is unambiguous. The form stays offered alongside it.

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
  // Display form (German convention) and E.164 for tel: links and structured data.
  phone: '+49 1523 3527612',
  phoneE164: '+4915233527612',
  // Legal seat (Sitz) per the register; distinct from the Geschäftsanschrift (city).
  seat: 'München',
  // Operative base, used in narrative copy only (outward "based in Berlin" convention).
  operativeCity: 'Berlin',
} as const;
