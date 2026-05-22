# Oakwood Hospital — Build Plan

A full multi-tenant hospital site with marketing pages, auth, and three role-based portals. Because this is large, I'll build it in clearly separated layers so each piece works end-to-end before stacking the next one.

## Design system

- **Palette**: deep royal purple (primary), warm cream (background/surfaces), antique gold (accents, headings, dividers). Soft rose for medical highlights (matching the banners).
- **Type**: Fraunces (display, gold headings) + Inter (body). Distinctive without being generic.
- **Feel**: Aesthetic, editorial-medical. Soft shadows, gold hairline dividers, rounded cards, subtle motion. Inspired by nwh.co.ke (clean booking flow) and knh.or.ke (contact + FAQ structure).

## Backend (Lovable Cloud)

Enable Cloud, then provision:

- **Auth**: Email/password + Google OAuth
- **Tables**:
  - `profiles` (id, full_name, phone, avatar_url)
  - `user_roles` (user_id, role enum: patient | doctor | admin) — separate table, security-definer `has_role()` function
  - `doctors` (id, name, title, specialty, bio, photo_url, schedule_days[])
  - `services` (id, title, category, description, icon)
  - `courses` (id, title, description, duration, modules[], price)
  - `course_enrollments` (user_id, course_id, status, created_at)
  - `appointments` (user_id, doctor_id, service, date, time, notes, status)
  - `team_sections` (admin-editable About/Team intro blocks)
- **RLS**: users see/edit own records; doctors see their appointments; admins manage everything.
- **Trigger**: auto-create profile + default `patient` role on signup.

## Public site (unauthenticated)

- `/` — Home: hero with hospital, services grid preview, "We Accept" insurance strip (text-badge placeholders until logos arrive), team preview, courses preview, 24/7 CTA.
- `/about` — Mission, Vision, Core Values, charter, history.
- `/services` — All services from images (Outpatient, Inpatient, Maternity, ICU/HDU, NBU, Surgeries, Lab, Radiology, Dental, Physio, Palliative, Nutrition + Specialist Clinics with days).
- `/maternity` — dedicated page (it has its own banner).
- `/team` — Our Team grid + "Book with this doctor" CTA → patient portal booking.
- `/courses` — Oakwood Training Institute, Healthcare Assistant certificate + course modules + "Enroll" CTA.
- `/contact` — Phone, email, address, embedded Google Map, contact form, FAQ accordion (KNH-inspired).
- `/insurance` — Full insurance partners list.
- `/auth` — Login / Signup (Google + email).

Unauthenticated users clicking "Book Appointment" or "Enroll" are routed to `/auth` then back to `/portal/patient`.

## Portals (role-gated under `/_authenticated`)

- **Patient portal** `/portal/patient`: book appointment (pick service → doctor → date/time), my appointments, my course enrollments, profile.
- **Doctor portal** `/portal/doctor`: today's appointments, patient list, mark appointment status.
- **Admin portal** `/portal/admin`: manage doctors, services, courses, team-section content, view all appointments & enrollments, manage user roles.

Role detection: on login, fetch `user_roles`; redirect to matching portal. Default new signups = `patient`.

## Build order (so each step is shippable)

1. Enable Cloud + design system + nav/footer shell
2. Public pages (Home, About, Services, Maternity, Team, Courses, Contact + FAQ, Insurance)
3. Auth (email + Google) + protected route layout + role redirects
4. Patient portal (bookings + enrollments)
5. Doctor portal
6. Admin portal (CMS for team/services/courses + role management)

I'll do steps 1–3 in this turn so you have a working, beautiful public site with login. Portals (4–6) will follow in subsequent turns to keep changes reviewable.

## Notes / placeholders

- Insurance logos: text-badge chips for now; swap to real logos when you upload them.
- Team photos: AI-generated portraits as placeholders; admin can replace via CMS.
- Phone/email from banners: +254 720 126 297 / +254 705 185 429 / oakwoodhospital@outlook.com / P.O. Box 395-10230.
- Google Maps embed for the provided location.
