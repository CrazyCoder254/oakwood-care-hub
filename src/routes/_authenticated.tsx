import { createFileRoute, redirect, Outlet, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    // Skip auth check during SSR on server side
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw redirect({ to: "/auth", search: { mode: "login", redirect: location.pathname } });
    } catch (error) {
      // If it's a redirect error, re-throw it
      if (error && typeof error === 'object' && 'status' in error) {
        throw error;
      }
      console.error('[Auth Route] Error checking session:', error);
      throw redirect({ to: "/auth", search: { mode: "login", redirect: location.pathname } });
    }
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  const { role, user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <SiteHeader />
      <main className="flex-1">
        <div className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-6 flex flex-wrap justify-between items-center gap-3">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-gold">{role ?? "patient"} portal</p>
              <h1 className="font-display text-2xl text-gold">Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}</h1>
            </div>
            <nav className="flex gap-2 text-sm">
              <Link to="/portal/patient" className="px-3 py-1.5 rounded hover:bg-primary-foreground/10">Patient</Link>
              {(role === "doctor" || role === "admin") && <Link to="/portal/doctor" className="px-3 py-1.5 rounded hover:bg-primary-foreground/10">Doctor</Link>}
              {role === "admin" && <Link to="/portal/admin" className="px-3 py-1.5 rounded hover:bg-primary-foreground/10">Admin</Link>}
            </nav>
          </div>
        </div>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
