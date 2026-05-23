import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground mt-24">
      <div className="container mx-auto px-4 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/favicon.png" alt="Oakwood Hospital" width={40} height={40} loading="lazy" className="w-10 h-10 object-contain" />
            <span className="font-display text-xl text-gold">Oakwood Hospital</span>
          </div>
          <p className="text-sm text-primary-foreground/80 leading-relaxed">
            Compassionate, personalized health care for every family. Trusted care, closer to you.
          </p>
        </div>
        <div>
          <h4 className="text-gold font-display text-base mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/about" className="hover:text-gold">About</Link></li>
            <li><Link to="/services" className="hover:text-gold">Services</Link></li>
            <li><Link to="/team" className="hover:text-gold">Our Team</Link></li>
            <li><Link to="/courses" className="hover:text-gold">Training Institute</Link></li>
            <li><Link to="/insurance" className="hover:text-gold">Insurance Partners</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gold font-display text-base mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li className="flex gap-2"><Phone className="h-4 w-4 text-gold mt-0.5" /> +254 720 126 297</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 text-gold mt-0.5" /> +254 705 185 429</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 text-gold mt-0.5" /> oakwoodhospital@outlook.com</li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 text-gold mt-0.5" /> P.O. Box 395-10230, Nairobi</li>
          </ul>
        </div>
        <div>
          <h4 className="text-gold font-display text-base mb-3">Hours</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li className="flex gap-2"><Clock className="h-4 w-4 text-gold mt-0.5" /> Emergency: 24 / 7</li>
            <li>Outpatient: Mon–Sat 8am–8pm</li>
            <li>Specialist clinics: by day</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-5 flex flex-wrap justify-between gap-2 text-xs text-primary-foreground/60">
          <span>© {new Date().getFullYear()} Oakwood Hospital Ltd. All rights reserved.</span>
          <span>Designed with care · Built on Lovable</span>
        </div>
      </div>
    </footer>
  );
}
