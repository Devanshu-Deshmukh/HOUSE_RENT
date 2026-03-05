import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import p1 from "../../images/p1.jpg";
import p2 from "../../images/p2.jpg";
import p3 from "../../images/p3.jpg";
import p4 from "../../images/p4.jpg";
import AllPropertiesCards from "../user/AllPropertiesCards";

const images = [p1, p2, p3, p4];

/* ─── Animated Counter Hook ─── */
const useCounter = (target, duration = 2000, startCounting) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startCounting) return;
    let start = 0;
    const inc = target / (duration / 16);
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [startCounting, target, duration]);
  return count;
};

/* ─── Styles ─── */
const S = {
  page: { minHeight: '100vh', background: '#F5F0E8', fontFamily: "'DM Sans', sans-serif" },
  nav: {
    position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
    background: 'rgba(255,252,247,0.92)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid #E2DBD0', height: '68px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 2.5rem'
  },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: '#1C1C1E', letterSpacing: '-0.02em', textDecoration: 'none' },
  logoSpan: { color: '#C4622D' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '2rem' },
  navLink: { fontSize: '0.875rem', fontWeight: 500, color: '#7A7470', textDecoration: 'none', transition: 'color 0.2s' },
  btnPrimary: {
    background: '#C4622D', color: 'white', padding: '0.5rem 1.25rem',
    borderRadius: '6px', fontSize: '0.875rem', fontWeight: 500,
    textDecoration: 'none', border: 'none', cursor: 'pointer',
    transition: 'background 0.2s', fontFamily: "'DM Sans', sans-serif"
  },
  hero: { position: 'relative', width: '100%', height: '88vh', marginTop: '68px', overflow: 'hidden' },
  heroImg: { position: 'absolute', width: '100%', height: '100%', transition: 'opacity 1.2s ease' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,28,30,0.8) 0%, rgba(28,28,30,0.3) 50%, rgba(28,28,30,0.15) 100%)' },
  heroContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4rem 3rem' },
  heroEyebrow: { display: 'inline-block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D4A853', marginBottom: '1rem', borderBottom: '2px solid #D4A853', paddingBottom: '0.3rem' },
  heroTitle: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 700, color: 'white', lineHeight: 1.1, marginBottom: '1rem', maxWidth: '700px' },
  heroSub: { fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', fontWeight: 300, maxWidth: '500px', marginBottom: '2rem', lineHeight: 1.6 },
  heroCta: {
    background: '#C4622D', color: 'white', padding: '0.9rem 2.2rem',
    borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600,
    textDecoration: 'none', display: 'inline-block',
    transition: 'all 0.3s', fontFamily: "'DM Sans', sans-serif",
    boxShadow: '0 4px 20px rgba(196,98,45,0.4)'
  },
  dots: { position: 'absolute', bottom: '1.5rem', right: '3rem', display: 'flex', gap: '0.5rem', alignItems: 'center' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer', transition: 'all 0.3s' },

  /* Stats */
  statsBar: { background: '#1C1C1E', padding: '3rem 2.5rem' },
  statsInner: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' },
  statNum: { fontFamily: "'Playfair Display', serif", fontSize: '2.8rem', fontWeight: 700, color: '#D4A853', marginBottom: '0.3rem' },
  statLabel: { fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 },

  /* How It Works */
  howSection: { padding: '5rem 2.5rem', background: '#FFFCF7' },
  howInner: { maxWidth: '1000px', margin: '0 auto', textAlign: 'center' },
  howGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem', marginTop: '3rem' },
  howCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' },
  howIcon: { width: '72px', height: '72px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700, transition: 'transform 0.3s' },
  howStep: { fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C4622D' },
  howTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, color: '#1C1C1E' },
  howDesc: { fontSize: '0.875rem', color: '#7A7470', lineHeight: 1.6, maxWidth: '260px' },

  /* Section shared */
  sectionEyebrow: { fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C4622D', marginBottom: '0.6rem' },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, color: '#1C1C1E', lineHeight: 1.2, marginBottom: '0.5rem' },
  divider: { width: '60px', height: '3px', background: '#C4622D', margin: '0.75rem auto 0', borderRadius: '2px' },

  /* Features */
  featSection: { padding: '5rem 2.5rem', background: '#F5F0E8' },
  featInner: { maxWidth: '1100px', margin: '0 auto' },
  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '3rem' },
  featCard: {
    background: '#FFFCF7', border: '1.5px solid #E2DBD0', borderRadius: '14px',
    padding: '2rem 1.5rem', textAlign: 'center', transition: 'all 0.3s',
    cursor: 'default'
  },
  featIcon: { fontSize: '2rem', marginBottom: '0.8rem' },
  featTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 700, color: '#1C1C1E', marginBottom: '0.5rem' },
  featDesc: { fontSize: '0.82rem', color: '#7A7470', lineHeight: 1.6 },

  /* Testimonials */
  testSection: { padding: '5rem 2.5rem', background: '#FFFCF7' },
  testInner: { maxWidth: '1100px', margin: '0 auto' },
  testGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '3rem' },
  testCard: {
    background: '#F5F0E8', border: '1.5px solid #E2DBD0', borderRadius: '14px',
    padding: '2rem', transition: 'all 0.3s', cursor: 'default'
  },
  testStars: { color: '#D4A853', fontSize: '1rem', marginBottom: '1rem', letterSpacing: '0.15em' },
  testQuote: { fontSize: '0.9rem', color: '#1C1C1E', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.25rem' },
  testAuthor: { fontSize: '0.82rem', fontWeight: 600, color: '#1C1C1E' },
  testRole: { fontSize: '0.75rem', color: '#7A7470' },

  /* Properties section */
  section: { padding: '5rem 2.5rem', background: '#F5F0E8' },
  sectionInner: { maxWidth: '1200px', margin: '0 auto' },
  sectionHeader: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' },
  ownerLink: {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    fontSize: '0.875rem', fontWeight: 500, color: '#C4622D',
    textDecoration: 'none', border: '1.5px solid #C4622D',
    padding: '0.5rem 1rem', borderRadius: '6px', transition: 'all 0.2s'
  },

  /* CTA */
  ctaSection: { padding: '5rem 2.5rem', background: 'linear-gradient(135deg, #1C1C1E 0%, #2D1F17 50%, #3D2010 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' },
  ctaPattern: { position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'repeating-linear-gradient(45deg, #C4622D 0, #C4622D 1px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' },
  ctaInner: { position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' },
  ctaTitle: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: '1rem' },
  ctaSub: { fontSize: '1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', lineHeight: 1.6 },
  ctaBtn: {
    background: '#C4622D', color: 'white', padding: '0.9rem 2.5rem',
    borderRadius: '8px', fontSize: '1rem', fontWeight: 600,
    textDecoration: 'none', display: 'inline-block', transition: 'all 0.3s',
    fontFamily: "'DM Sans', sans-serif", boxShadow: '0 4px 24px rgba(196,98,45,0.5)'
  },

  /* Footer */
  footer: { background: '#1C1C1E', padding: '4rem 2.5rem 2rem', color: 'rgba(255,255,255,0.5)' },
  footerInner: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem' },
  footerLogo: { fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: 'white', marginBottom: '1rem' },
  footerDesc: { fontSize: '0.85rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.45)', maxWidth: '300px' },
  footerHeading: { fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4A853', marginBottom: '1.25rem' },
  footerLink: { display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: '0.6rem', transition: 'color 0.2s' },
  footerBottom: { maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' },
  socialIcons: { display: 'flex', gap: '1rem' },
  socialIcon: { width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.08)' },
};

/* ─── Data ─── */
const features = [
  { icon: '🛡️', title: 'Verified Listings', desc: 'Every property is verified by our team for quality and authenticity.' },
  { icon: '🔒', title: 'Secure Payments', desc: 'End-to-end encrypted transactions for your safety and peace of mind.' },
  { icon: '📞', title: '24/7 Support', desc: 'Round-the-clock assistance for tenants and property owners alike.' },
  { icon: '⚡', title: 'Instant Booking', desc: 'Browse, select, and book your dream property in just minutes.' },
];

const steps = [
  { icon: '🔍', bg: 'linear-gradient(135deg, rgba(196,98,45,0.1), rgba(196,98,45,0.05))', step: 'Step 01', title: 'Search', desc: 'Browse curated properties by location, price, and amenities.' },
  { icon: '📋', bg: 'linear-gradient(135deg, rgba(212,168,83,0.15), rgba(212,168,83,0.05))', step: 'Step 02', title: 'Book', desc: 'Select your dates and submit a booking request instantly.' },
  { icon: '🏡', bg: 'linear-gradient(135deg, rgba(21,128,61,0.1), rgba(21,128,61,0.05))', step: 'Step 03', title: 'Move In', desc: 'Get confirmed, sign the lease, and move into your new home.' },
];

const testimonials = [
  { stars: 5, text: '"RentEase made my house-hunting experience effortless. Found a beautiful 2BHK within a week!"', author: 'Priya Sharma', role: 'Tenant, Mumbai' },
  { stars: 5, text: '"As a property owner, managing bookings and tenants has never been this smooth. Highly recommended!"', author: 'Rajesh Patel', role: 'Property Owner, Indore' },
  { stars: 4, text: '"The support team is phenomenal. They helped me through the entire process from search to move-in."', author: 'Ananya Gupta', role: 'Tenant, Bangalore' },
];

/* ─── Component ─── */
const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  const prop = useCounter(500, 2000, statsVisible);
  const tenants = useCounter(1200, 2000, statsVisible);
  const cities = useCounter(50, 1800, statsVisible);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={S.page}>
      {/* ── Navbar ── */}
      <nav style={S.nav}>
        <Link to="/" style={S.logo}>Rent<span style={S.logoSpan}>Ease</span></Link>
        <div style={S.navLinks}>
          <Link to="/" style={{ ...S.navLink, color: '#1C1C1E' }}>Home</Link>
          <Link to="/login" style={S.navLink}>Login</Link>
          <Link to="/register" style={S.btnPrimary}>Get Started</Link>
        </div>
      </nav>

      {/* ── Hero Slideshow ── */}
      <div style={S.hero}>
        {images.map((img, idx) => (
          <div key={idx} style={{ ...S.heroImg, opacity: currentIndex === idx ? 1 : 0 }}>
            <img src={img} alt={`Slide ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
        <div style={S.heroOverlay}></div>
        <div style={S.heroContent}>
          <div style={S.heroEyebrow}>Premium Real Estate</div>
          <h1 style={S.heroTitle}>Find Your Perfect<br /><em>Rental Property</em></h1>
          <p style={S.heroSub}>Comfort, convenience & class — curated properties across prime locations in India's top cities.</p>
          <Link to="/register" style={S.heroCta}
            onMouseEnter={e => { e.target.style.background = '#9E4820'; e.target.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.target.style.background = '#C4622D'; e.target.style.transform = 'translateY(0)'; }}>
            Explore Properties →
          </Link>
        </div>
        <div style={S.dots}>
          {images.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentIndex(idx)} style={{
              ...S.dot,
              background: currentIndex === idx ? '#D4A853' : 'rgba(255,255,255,0.4)',
              width: currentIndex === idx ? '28px' : '8px',
              borderRadius: currentIndex === idx ? '4px' : '50%'
            }} />
          ))}
        </div>
      </div>

      {/* ── Stats Counter Bar ── */}
      <div ref={statsRef} style={S.statsBar}>
        <div style={S.statsInner}>
          <div><div style={S.statNum}>{prop}+</div><div style={S.statLabel}>Properties Listed</div></div>
          <div><div style={S.statNum}>{tenants}+</div><div style={S.statLabel}>Happy Tenants</div></div>
          <div><div style={S.statNum}>{cities}+</div><div style={S.statLabel}>Cities Covered</div></div>
          <div><div style={S.statNum}>4.9★</div><div style={S.statLabel}>User Rating</div></div>
        </div>
      </div>

      {/* ── How It Works ── */}
      <section style={S.howSection}>
        <div style={S.howInner}>
          <div style={S.sectionEyebrow}>Simple Process</div>
          <h2 style={S.sectionTitle}>How It Works</h2>
          <div style={S.divider}></div>
          <div style={S.howGrid}>
            {steps.map((s, i) => (
              <div key={i} style={S.howCard}>
                <div style={{ ...S.howIcon, background: s.bg }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>{s.icon}</div>
                <div style={S.howStep}>{s.step}</div>
                <div style={S.howTitle}>{s.title}</div>
                <p style={S.howDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Properties Section ── */}
      <section style={S.section}>
        <div style={S.sectionInner}>
          <div style={S.sectionHeader}>
            <div>
              <div style={S.sectionEyebrow}>Listed Properties</div>
              <h2 style={{ ...S.sectionTitle, textAlign: 'left' }}>Explore Premium Listings</h2>
              <div style={{ ...S.divider, margin: '0.75rem 0 0' }}></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#7A7470' }}>Looking to list your property?</p>
              <Link to="/register" style={S.ownerLink}
                onMouseEnter={e => { e.currentTarget.style.background = '#C4622D'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C4622D'; }}>
                Register as Owner →
              </Link>
            </div>
          </div>
          <AllPropertiesCards />
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section style={S.featSection}>
        <div style={S.featInner}>
          <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <div style={S.sectionEyebrow}>Our Advantages</div>
            <h2 style={S.sectionTitle}>Why Choose RentEase</h2>
            <div style={S.divider}></div>
          </div>
          <div style={S.featGrid}>
            {features.map((f, i) => (
              <div key={i} style={S.featCard}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(196,98,45,0.12)'; e.currentTarget.style.borderColor = '#C4622D'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E2DBD0'; }}>
                <div style={S.featIcon}>{f.icon}</div>
                <div style={S.featTitle}>{f.title}</div>
                <p style={S.featDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={S.testSection}>
        <div style={S.testInner}>
          <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <div style={S.sectionEyebrow}>Testimonials</div>
            <h2 style={S.sectionTitle}>What Our Users Say</h2>
            <div style={S.divider}></div>
          </div>
          <div style={S.testGrid}>
            {testimonials.map((t, i) => (
              <div key={i} style={S.testCard}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(28,28,30,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={S.testStars}>{'★'.repeat(t.stars)}{'☆'.repeat(5 - t.stars)}</div>
                <p style={S.testQuote}>{t.text}</p>
                <div style={S.testAuthor}>{t.author}</div>
                <div style={S.testRole}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={S.ctaSection}>
        <div style={S.ctaPattern}></div>
        <div style={S.ctaInner}>
          <div style={{ ...S.sectionEyebrow, color: '#D4A853' }}>Get Started Today</div>
          <h2 style={S.ctaTitle}>Ready to Find Your<br />Dream Home?</h2>
          <p style={S.ctaSub}>Join thousands of happy tenants and property owners on India's most trusted rental platform.</p>
          <Link to="/register" style={S.ctaBtn}
            onMouseEnter={e => { e.target.style.background = '#9E4820'; e.target.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.target.style.background = '#C4622D'; e.target.style.transform = 'translateY(0)'; }}>
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={S.footer}>
        <div style={S.footerInner}>
          <div>
            <div style={S.footerLogo}>Rent<span style={{ color: '#C4622D' }}>Ease</span></div>
            <p style={S.footerDesc}>
              India's trusted platform for finding and listing premium rental properties. Connecting tenants with verified homeowners since 2024.
            </p>
            <div style={{ ...S.socialIcons, marginTop: '1.25rem' }}>
              {['𝕏', 'in', 'f', '▶'].map((icon, i) => (
                <a key={i} href="#" style={S.socialIcon}
                  onMouseEnter={e => { e.currentTarget.style.background = '#C4622D'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#C4622D'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div style={S.footerHeading}>Quick Links</div>
            <Link to="/" style={S.footerLink}>Home</Link>
            <Link to="/login" style={S.footerLink}>Login</Link>
            <Link to="/register" style={S.footerLink}>Register</Link>
            <Link to="/forgotpassword" style={S.footerLink}>Reset Password</Link>
          </div>
          <div>
            <div style={S.footerHeading}>For Users</div>
            <Link to="/register" style={S.footerLink}>Become a Renter</Link>
            <Link to="/register" style={S.footerLink}>List as Owner</Link>
            <a href="#" style={S.footerLink}>Pricing</a>
            <a href="#" style={S.footerLink}>FAQs</a>
          </div>
          <div>
            <div style={S.footerHeading}>Contact</div>
            <a href="mailto:support@rentease.in" style={S.footerLink}>support@rentease.in</a>
            <a href="tel:+919876543210" style={S.footerLink}>+91 98765 43210</a>
            <span style={{ ...S.footerLink, cursor: 'default' }}>Mumbai, Maharashtra</span>
            <span style={{ ...S.footerLink, cursor: 'default' }}>India</span>
          </div>
        </div>
        <div style={S.footerBottom}>
          <span>© 2025 RentEase · All rights reserved</span>
          <span style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '0.78rem' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '0.78rem' }}>Terms of Service</a>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
