import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/portal/admin")({
  component: () => (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="font-display text-3xl text-primary">Admin Portal</h2>
      <p className="text-muted-foreground mt-3">Coming next: manage doctors, services, courses, team CMS, appointments, enrolments, and user roles.</p>
    </div>
  ),
});
