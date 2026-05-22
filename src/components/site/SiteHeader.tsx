import { Link, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, User as UserIcon } from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/maternity", label: "Maternity" },
  { to: "/team", label: "Our Team" },
  { to: "/courses", label: "Training" },
  { to: "/insurance", label: "Insurance" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { user, role, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const portalPath = role === "admin" ? "/portal/admin" : role === "doctor" ? "/portal/doctor" : "/portal/patient";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-cream/80 border-b border-border/60">
      <div className="bg-primary text-primary-foreground text-xs">
        <div className="container mx-auto px-4 py-1.5 flex flex-wrap justify-between gap-2">
          <span className="flex items-center gap-2"><Phone className="h-3 w-3 text-gold" /> +254 720 126 297 · +254 705 185 429</span>
          <span className="text-gold font-medium tracking-wide">24/7 Trusted Care, Closer to You</span>
        </div>
      </div>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="grid place-items-center w-10 h-10 rounded-lg gradient-purple text-gold font-display font-bold text-lg">O</span>
          <span className="flex flex-col leading-none">
            <span className="font-display font-bold text-lg text-primary">Oakwood Hospital</span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-gold">Trusted Care · Closer to You</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(i => (
            <Link key={i.to} to={i.to}
              activeOptions={{ exact: i.to === "/" }}
              activeProps={{ className: "text-primary bg-secondary" }}
              className="px-3 py-2 rounded-md text-sm font-medium text-foreground/80 hover:text-primary hover:bg-secondary transition-colors">
              {i.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to={portalPath}><UserIcon className="h-4 w-4 mr-1" /> {role === "admin" ? "Admin" : role === "doctor" ? "Doctor" : "Patient"} Portal</Link>
              </Button>
              <Button size="sm" variant="ghost" onClick={() => signOut().then(() => router.navigate({ to: "/" }))}>Sign out</Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/auth">Sign in</Link></Button>
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground"><Link to="/auth" search={{ mode: "signup" }}>Book Appointment</Link></Button>
            </>
          )}
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-cream">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navItems.map(i => (
              <Link key={i.to} to={i.to} onClick={() => setOpen(false)} className="px-3 py-2 rounded-md text-sm hover:bg-secondary">{i.label}</Link>
            ))}
            <div className="border-t my-2" />
            {user ? (
              <Button asChild className="w-full"><Link to={portalPath} onClick={() => setOpen(false)}>Go to Portal</Link></Button>
            ) : (
              <Button asChild className="w-full"><Link to="/auth" onClick={() => setOpen(false)}>Sign in / Book</Link></Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
