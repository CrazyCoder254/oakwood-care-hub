import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/portal/doctor")({
  component: () => (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="font-display text-3xl text-primary">Doctor Portal</h2>
      <p className="text-muted-foreground mt-3">Coming next: today's appointments, patient list, and status updates.</p>
    </div>
  ),
});
