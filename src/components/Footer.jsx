import React from 'react';

const FacebookIcon = ({ size = 16 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = ({ size = 16 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const InstagramIcon = ({ size = 16 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ size = 16 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1 */}
          <div className="footer-col">
            <a href="#" className="logo-container" style={{ marginBottom: '8px', display: 'inline-flex', alignItems: 'center' }}>
              <img src="/logo.svg" alt="OLX Luxe Logo" style={{ height: '32px', width: '32px', objectFit: 'contain', marginRight: '6px' }} />
              <span>OLX<span className="logo-highlight">Luxe</span></span>
            </a>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              The world's premier classified marketplace for buying and selling high-end luxury assets, premium motors, architectural properties, and elite tech accessories.
            </p>
          </div>
          {/* Col 2 */}
          <div className="footer-col">
            <h4 className="footer-col-title">Popular Locations</h4>
            <ul className="footer-links">
              <li><a href="#">Beverly Hills, LA</a></li>
              <li><a href="#">Malibu Coastline, CA</a></li>
              <li><a href="#">Manhattan, New York</a></li>
              <li><a href="#">Miami Beach, Florida</a></li>
            </ul>
          </div>
          {/* Col 3 */}
          <div className="footer-col">
            <h4 className="footer-col-title">Trending Categories</h4>
            <ul className="footer-links">
              <li><a href="#">Luxury Cars</a></li>
              <li><a href="#">Architectural Villas</a></li>
              <li><a href="#">Executive Mobiles</a></li>
              <li><a href="#">Elite Watches</a></li>
            </ul>
          </div>
          {/* Col 4 */}
          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links">
              <li><a href="#">About OLX Luxe</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press Relations</a></li>
              <li><a href="#">Help & Support</a></li>
            </ul>
          </div>
        </div>
        {/* Bottom footer */}
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} OLX Luxe Inc. All Rights Reserved.</span>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook"><FacebookIcon size={16} /></a>
            <a href="#" className="social-link" aria-label="Twitter"><TwitterIcon size={16} /></a>
            <a href="#" className="social-link" aria-label="Instagram"><InstagramIcon size={16} /></a>
            <a href="#" className="social-link" aria-label="LinkedIn"><LinkedinIcon size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
