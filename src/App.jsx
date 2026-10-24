import { useState, useEffect, useCallback, useRef } from "react"
import {
  ArrowRight,
  Check,
  Handshake,
  Leaf,
  Mail,
  Menu,
  Package,
  Phone,
  ShieldCheck,
  Truck,
  X,
  BadgePercent,
  Sparkles,
} from "lucide-react"
import { products } from "./products"
import CoconutLoader from "./components/CoconutLoader"

const BUSINESS_EMAIL = "venkatch.9640@gmail.com"
const BUSINESS_PHONE = "+91 93982 45558"
const BUSINESS_PHONE_RAW = "919398245558"

function WhatsAppIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  )
}

function getWhatsAppUrl(productName = "") {
  const text = encodeURIComponent(
    productName
      ? `Hello VRK Traders,\n\nI would like to enquire about bulk supply for ${productName}.\nPlease share your current daily market rate, minimum order quantity, and dispatch schedule.\n\nThank you.`
      : `Hello VRK Traders,\n\nI am interested in bulk coconut sourcing for my business. Please share your current wholesale rates and availability.\n\nThank you.`
  )
  return `https://wa.me/${BUSINESS_PHONE_RAW}?text=${text}`
}

function getEmailComposeUrl(subject = "", body = "") {
  const su = encodeURIComponent(subject || "Wholesale Coconut Enquiry - VRK Traders")
  const b = encodeURIComponent(
    body ||
      "Hello VRK Traders,\n\nI am interested in wholesale coconut supply for my business.\nPlease share your current daily market rate, availability, and minimum order quantity.\n\nThank you."
  )
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${BUSINESS_EMAIL}&su=${su}&body=${b}`
}

function handleEmailClick(e, subject = "", body = "") {
  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  if (!isMobile) {
    // Desktop: open Gmail compose directly in a new tab so it never depends on an installed mail client
    e.preventDefault()
    window.open(getEmailComposeUrl(subject, body), "_blank", "noopener,noreferrer")
  }
}

function EnquiryLink({ product, className = "", onClick, children }) {
  const subject = `Product enquiry: ${product || "VRK Traders coconuts"}`
  const body = `Hello VRK Traders,\n\nI would like to enquire about ${
    product || "your coconut products"
  }.\n\nPlease share your availability, wholesale pricing, and minimum order quantity.\n\nThank you.`

  const gmailUrl = getEmailComposeUrl(subject, body)
  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  const mailtoUrl = `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`

  return (
    <a
      href={isMobile ? mailtoUrl : gmailUrl}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={(e) => {
        if (onClick) onClick(e)
        handleEmailClick(e, subject, body)
      }}
      title={`Email ${BUSINESS_EMAIL}`}
    >
      {children || (
        <>
          <Mail size={16} /> Enquire now
        </>
      )}
    </a>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("Home")
  const [scrolled, setScrolled] = useState(false)
  const isClickLockRef = useRef(false)
  const clickLockTimerRef = useRef(null)

  const links = [
    ["Home", "#home"],
    ["Products", "#products"],
    ["About us", "#about"],
    ["Contact", "#contact"],
  ]

  const handleNavClick = (label) => {
    setActiveTab(label)
    setMenuOpen(false)
    isClickLockRef.current = true
    if (clickLockTimerRef.current) clearTimeout(clickLockTimerRef.current)
    clickLockTimerRef.current = setTimeout(() => {
      isClickLockRef.current = false
    }, 900)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15)

      if (isClickLockRef.current) return

      // Detect bottom of page (Contact section is at the bottom)
      const scrollPosition = window.innerHeight + Math.ceil(window.scrollY)
      const pageHeight = document.documentElement.scrollHeight
      if (scrollPosition >= pageHeight - 90) {
        setActiveTab("Contact")
        return
      }

      // Check Contact section visibility
      const contactEl = document.getElementById("contact")
      if (contactEl) {
        const cRect = contactEl.getBoundingClientRect()
        if (cRect.top <= window.innerHeight * 0.6 && cRect.bottom >= 80) {
          setActiveTab("Contact")
          return
        }
      }

      // Check remaining sections from bottom to top
      const sections = ["about", "products", "home"]
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 160) {
            const labelMap = {
              home: "Home",
              products: "Products",
              about: "About us",
            }
            setActiveTab(labelMap[sectionId])
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (clickLockTimerRef.current) clearTimeout(clickLockTimerRef.current)
    }
  }, [])

  return (
    <header className={`site-header-wrap ${scrolled ? "header-scrolled" : ""}`}>
      <div className="site-header-inner">
        <a href="#home" className="brand" aria-label="VRK Traders home">
          <span className="brand-identity">
            <span className="brand-title">
              <span className="brand-name-vrk">VRK</span>
              <span className="brand-name-traders">TRADERS</span>
            </span>
            <span className="brand-tagline">
              <span>COCONUTS</span>
              <span className="brand-bullet" aria-hidden="true">•</span>
              <span>QUALITY</span>
              <span className="brand-bullet" aria-hidden="true">•</span>
              <span>TRUST</span>
            </span>
          </span>
        </a>

        <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className={activeTab === label ? "active-nav" : ""}
              onClick={() => handleNavClick(label)}
            >
              {label}
            </a>
          ))}

          <div className="mobile-only-cta">
            <a
              href="#contact"
              className="button button-dark mobile-cta-btn"
              onClick={() => handleNavClick("Contact")}
            >
              <Mail size={17} /> <span>Enquire Now</span>
            </a>
          </div>
        </nav>

        <div className="header-actions">
          <a
            href="#contact"
            className="button button-dark header-cta"
            onClick={() => handleNavClick("Contact")}
          >
            <Mail size={15} /> Enquire Now
          </a>
          <button
            type="button"
            className="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  )
}

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-art">
        <img
          className="product-image"
          src={product.image}
          alt={product.imageAlt}
          loading="lazy"
        />
        {product.tag && (
          <span className={`product-badge badge-${product.tagType}`}>
            {product.tag}
          </span>
        )}
      </div>

      <div className="product-content">
        <h3>{product.name}</h3>
        <p className="product-subtext">{product.description}</p>

        {product.specs && (
          <div className="product-specs-chip">
            <span>{product.specs}</span>
          </div>
        )}

        <ul className="product-features">
          {product.features.map((feature) => (
            <li key={feature}>
              <Check size={14} className="check-icon" /> {feature}
            </li>
          ))}
        </ul>

        <div className="product-price">{product.price}</div>

        <a href="#contact" className="button button-product">
          Enquire Now <ArrowRight size={15} />
        </a>
      </div>
    </article>
  )
}

function FloatingWhatsApp() {
  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noreferrer"
      className="floating-whatsapp-btn"
      aria-label="Chat on WhatsApp with VRK Traders"
      title="Chat on WhatsApp"
    >
      <span className="wa-pulse-dot" />
      <WhatsAppIcon size={28} />
      <span className="wa-floating-label">WhatsApp Us</span>
    </a>
  )
}

function App() {
  // Loader temporarily hidden
  const [isLoading, setIsLoading] = useState(false)

  const handleComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <>
      {/* Loader temporarily hidden: {isLoading && <CoconutLoader onComplete={handleComplete} />} */}

      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow">
              <Leaf size={14} /> DIRECT FARM COCONUT SOURCING &amp; EXPORT
            </span>

            <h1>
              Natural Goodness.
              <br />
              <span className="hero-title-accent">For Your Business.</span>
            </h1>

            <p className="hero-description">
              Supplying export-grade semi-husked coconuts, husked coconuts, and pure cold-pressed coconut oil. Consistent supply, honest wholesale pricing, and reliable pan-India logistics.
            </p>

            <div className="hero-actions">
              <a href="#products" className="button button-dark">
                Explore Our Coconuts <ArrowRight size={17} />
              </a>
              <a href="#about" className="button button-outline">
                Get to Know Us
              </a>
            </div>

            <div className="hero-note">
              <span className="note-icon">
                <Truck size={20} />
              </span>
              <span>
                <strong>Daily Mandi &amp; APMC Market Supply</strong>
                <small>Flexible orders from 1,000 nuts to full truck loads (FTL).</small>
              </span>
            </div>
          </div>

          <div className="hero-visual-wrap">
            <div className="hero-visual-card">
              <img
                className="hero-board-image"
                src="/images/hero-goodness.jpg"
                alt="Natural coconuts arranged fresh on wooden board with palm leaves"
                fetchPriority="high"
                decoding="async"
              />
              {/* Natural badge with sketched pointer */}
              <div className="organic-seal">
                <div className="seal-inner">
                  <span className="seal-top">100%</span>
                  <span className="seal-mid">Farm Fresh</span>
                  <span className="seal-bot">Graded</span>
                  <Leaf size={12} className="seal-leaf" />
                </div>
                <svg className="seal-arrow" viewBox="0 0 50 50" fill="none">
                  <path
                    d="M38 6 C32 18, 18 24, 8 36 M8 36 L16 34 M8 36 L12 28"
                    stroke="#1b4d32"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="trust-strip">
          <div className="section-wrap trust-grid">
            <div className="trust-item">
              <span className="trust-icon icon-sand">
                <Leaf size={20} />
              </span>
              <div className="trust-text">
                <strong>Direct Farm Harvest</strong>
                <small>Harvested from healthy, mature coconut palms</small>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon icon-green">
                <ShieldCheck size={20} />
              </span>
              <div className="trust-text">
                <strong>Strict Grading</strong>
                <small>Weight, water sweetness &amp; maturity checked</small>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon icon-sage">
                <Truck size={20} />
              </span>
              <div className="trust-text">
                <strong>Pan-India Logistics</strong>
                <small>Standardized PP bag packing &amp; safe dispatch</small>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon icon-sand">
                <Handshake size={20} />
              </span>
              <div className="trust-text">
                <strong>Transparent Pricing</strong>
                <small>Fair daily market rates for long-term partners</small>
              </div>
            </div>
          </div>
        </section>

        {/* OUR PRODUCTS */}
        <section className="products-section section-wrap" id="products">
          <div className="section-header-center">
            <span className="section-eyebrow">— OUR PRODUCTS —</span>
            <h2>Fresh Coconut Wholesale &amp; Supply</h2>
            <p>
              Hand-picked, mature coconuts and unrefined oils sourced directly from agricultural groves.
            </p>
          </div>

          <div className="products-grid-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </section>

        {/* ABOUT & WHY CHOOSE US */}
        <section className="about-composite-section section-wrap" id="about">
          <div className="about-composite-grid">
            {/* Left Card: About VRK Traders */}
            <div className="about-main-card">
              <div className="about-splash-art">
                <img
                  src="/images/about-coconut.jpg"
                  alt="Fresh coconut with splashing water and palm leaves"
                  loading="lazy"
                />
              </div>
              <div className="about-main-text">
                <div className="green-dash-eyebrow">
                  <span className="dash-bar" />
                  <span>About VRK Traders</span>
                </div>
                <p>
                  At VRK Traders, we are dedicated to supplying the finest agricultural coconuts with uncompromised freshness and consistency. Sourcing directly from reputable growers, we partner with wholesalers, supermarket chains, food processing units, and temple trusts.
                </p>
                <div className="about-meta-pills">
                  <span className="meta-pill">✓ Direct Farmer Network</span>
                  <span className="meta-pill">✓ Extended Shelf-Life</span>
                  <span className="meta-pill">✓ Wholesale &amp; Export</span>
                </div>
                <a href="#contact" className="button button-dark about-cta">
                  Partner With Us <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* Right Card: Why Choose Us */}
            <div className="why-choose-card">
              <h3>Why Choose VRK Traders?</h3>
              <ul className="why-list">
                <li>
                  <span className="why-icon">
                    <ShieldCheck size={18} />
                  </span>
                  <div>
                    <strong>Consistent High Quality</strong>
                    <small>Zero cracked, rotten, or underdeveloped nuts</small>
                  </div>
                </li>
                <li>
                  <span className="why-icon">
                    <BadgePercent size={18} />
                  </span>
                  <div>
                    <strong>Direct Wholesale Rates</strong>
                    <small>Transparent pricing directly linked to daily market rates</small>
                  </div>
                </li>
                <li>
                  <span className="why-icon">
                    <Package size={18} />
                  </span>
                  <div>
                    <strong>Large Volume Scalability</strong>
                    <small>Ready capacity for regular bulk orders &amp; contract farming</small>
                  </div>
                </li>
                <li>
                  <span className="why-icon">
                    <Sparkles size={18} />
                  </span>
                  <div>
                    <strong>Responsive Communication</strong>
                    <small>Immediate order updates, dispatch receipts &amp; WhatsApp support</small>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>


        {/* CTA BANNER */}
        <section className="cta-banner-wrap section-wrap" id="contact">
          <div className="cta-banner">
            <div className="cta-copy">
              <span className="cta-eyebrow">FAST WHOLESALE RESPONSE</span>
              <h3>Ready to Place an Order or Request Rates?</h3>
              <p>
                Connect with our trade desk on WhatsApp or phone for today's market rates, stock availability, and tailored dispatch quotes.
              </p>
              <div className="cta-perks">
                <span>✓ Daily Wholesale Price</span>
                <span>✓ Custom Bag Packaging</span>
                <span>✓ Pan-India Delivery</span>
              </div>
            </div>

            <div className="cta-contacts">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="button button-white-pill"
              >
                <WhatsAppIcon size={18} /> Chat on WhatsApp
              </a>

              <a href={`tel:${BUSINESS_PHONE}`} className="cta-phone-link">
                <span className="phone-icon-wrap">
                  <Phone size={18} />
                </span>
                <span className="phone-text">
                  <strong>{BUSINESS_PHONE}</strong>
                  <small>Call Direct for Bulk Enquiries</small>
                </span>
              </a>

              <a
                href={getEmailComposeUrl()}
                target="_blank"
                rel="noreferrer"
                className="button button-send-mail"
                onClick={(e) => handleEmailClick(e)}
                title="Send Mail directly to vendor"
              >
                <Mail size={18} /> Send Mail
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="section-wrap footer-content">
          <a href="#home" className="brand footer-brand" aria-label="VRK Traders home">
            <span className="brand-identity">
              <span className="brand-title">
                <span className="brand-name-vrk">VRK</span>
                <span className="brand-name-traders">TRADERS</span>
              </span>
              <span className="brand-tagline">
                <span>COCONUTS</span>
                <span className="brand-bullet" aria-hidden="true">•</span>
                <span>QUALITY</span>
                <span className="brand-bullet" aria-hidden="true">•</span>
                <span>TRUST</span>
              </span>
            </span>
          </a>

          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#products">Products</a>
            <a href="#about">About us</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-socials">
            {/* WhatsApp */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp VRK Traders"
              title="WhatsApp"
            >
              <WhatsAppIcon size={18} />
            </a>
            {/* Direct Phone */}
            <a href={`tel:${BUSINESS_PHONE}`} aria-label="Call VRK Traders" title="Call">
              <Phone size={18} />
            </a>
            {/* Email */}
            <a
              href={getEmailComposeUrl()}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => handleEmailClick(e)}
              aria-label={`Email VRK Traders (${BUSINESS_EMAIL})`}
              title={`Email ${BUSINESS_EMAIL}`}
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div className="section-wrap footer-bottom">
          <span>&copy; {new Date().getFullYear()} VRK Traders. All rights reserved.</span>
          <span>Wholesale Coconut Sourcing &amp; Export</span>
        </div>
      </footer>

      {/* Persistent Floating WhatsApp Quick Button */}
      <FloatingWhatsApp />
    </>
  )
}

export default App
