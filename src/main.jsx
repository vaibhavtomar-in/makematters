import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDownRight, ArrowUpRight, Check, Copy, Menu, X } from 'lucide-react';
import './styles.css';

const GOOGLE_FORM_EMBED_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfRNOFGSH2AxLR90x9sK8-IRxhPLW0MOJxACENPVwmEaDx_qg/viewform?embedded=true';

const engagements = [
  {
    name: 'Focused sprint',
    detail: 'One sharp outcome. We scope it, build it, and ship it without turning your calendar into confetti.',
    cadence: '1–2 weeks',
    rhythm: 'Async updates',
    image: '/images/focused-sprint.webp',
    imagePosition: 'center',
  },
  {
    name: 'Product build',
    detail: 'From rough brief to a production-ready web product—with strategy, design, and engineering in one loop.',
    cadence: '3–8 weeks',
    rhythm: 'Weekly demos',
    image: '/images/product-build.webp',
    imagePosition: 'center',
  },
  {
    name: 'Studio partnership',
    detail: 'A senior product team that flexes around yours. We bring the right mix of design and engineering as the work evolves.',
    cadence: 'Flexible',
    rhythm: 'Your team cadence',
    image: '/images/studio-partnership.webp',
    imagePosition: 'center',
  },
];

const capabilities = [
  ['Product interfaces', 'Distinctive, responsive UI that earns attention without making usability pay for it.'],
  ['Full-stack builds', 'Frontend, APIs, databases, auth, payments, integrations, deployment—the connected whole.'],
  ['Existing-product lift', 'Untangle slow, awkward, or generic experiences and leave the codebase better than we found it.'],
];

const faqs = [
  ['Do you need a finished specification?', 'No. A recording, meeting notes, or a rough list of outcomes is enough to start. We turn loose context into a written plan before work begins.'],
  ['How does the studio work with our team?', 'We work as a focused project partner with a defined outcome, timeline, and ownership boundary. We can also collaborate inside your existing product rhythm when the work calls for it.'],
  ['What about meetings?', 'We protect build time. Most work runs through clear written updates, annotated demos, and decisions you can answer asynchronously. We meet when conversation is genuinely faster.'],
  ['Who owns the work?', 'You do, once the agreed invoices are paid. Code, designs, documentation, and deployment access are handed over cleanly.'],
];

function App() {
  const [activeEngagementIndex, setActiveEngagementIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [formLoaded, setFormLoaded] = useState(false);
  const [heroAlternate, setHeroAlternate] = useState(false);
  const [heroRipple, setHeroRipple] = useState(null);
  const [proofStamped, setProofStamped] = useState(false);
  const closeModalButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const heroAlternateRef = useRef(false);
  const heroRippleIdRef = useRef(0);
  const proofRef = useRef(null);
  const year = new Date().getFullYear();
  const brief = useMemo(() => `Hi Make Matters,\n\nWe need help with: \nThe outcome we want: \nUseful context / links: \nIdeal timing: \nBudget range: `, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      if (projectModalOpen) setProjectModalOpen(false);
      else setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [projectModalOpen]);

  useEffect(() => {
    if (!projectModalOpen) return undefined;

    previousFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => closeModalButtonRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [projectModalOpen]);

  useEffect(() => {
    const proofSection = proofRef.current;
    if (!proofSection) return undefined;

    const triggerRatio = 0.35;
    const observer = new IntersectionObserver(([entry]) => {
      setProofStamped(entry.intersectionRatio >= triggerRatio);
    }, { threshold: [0, triggerRatio] });

    observer.observe(proofSection);
    return () => observer.disconnect();
  }, []);

  const openProjectModal = () => {
    setMenuOpen(false);
    setFormLoaded(false);
    setProjectModalOpen(true);
  };

  const copyBrief = async () => {
    await navigator.clipboard.writeText(brief);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const triggerHeroRipple = (event, nextAlternate) => {
    const previousAlternate = heroAlternateRef.current;
    if (previousAlternate === nextAlternate) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(event.clientX - bounds.left, 0), bounds.width);
    const y = Math.min(Math.max(event.clientY - bounds.top, 0), bounds.height);
    const radius = Math.hypot(
      Math.max(x, bounds.width - x),
      Math.max(y, bounds.height - y),
    );

    heroAlternateRef.current = nextAlternate;
    setHeroAlternate(nextAlternate);
    setHeroRipple({
      id: heroRippleIdRef.current += 1,
      x,
      y,
      size: Math.ceil(radius * 2),
      from: previousAlternate ? '#f2f58a' : '#dedcff',
      to: nextAlternate ? '#f2f58a' : '#dedcff',
    });
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="mark" href="#top" aria-label="Make Matters, home">
          <span>M</span><span className="mark-stretch">/ make matters</span>
        </a>
        <div className="availability"><i /> Booking selected projects</div>
        <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Main navigation">
          <a href="#work" onClick={() => setMenuOpen(false)}>What we do</a>
          <a href="#method" onClick={() => setMenuOpen(false)}>How it works</a>
          <button className="nav-project" onClick={openProjectModal}>Start a project <ArrowUpRight size={15} /></button>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main id="top">
        <section
          className={heroAlternate ? 'hero hero-alt' : 'hero'}
          aria-labelledby="hero-title"
          onMouseEnter={(event) => triggerHeroRipple(event, true)}
          onMouseLeave={(event) => triggerHeroRipple(event, false)}
        >
          {heroRipple && (
            <span
              className="hero-ripple-layer"
              aria-hidden="true"
              key={heroRipple.id}
              style={{
                '--ripple-x': `${heroRipple.x}px`,
                '--ripple-y': `${heroRipple.y}px`,
                '--ripple-size': `${heroRipple.size}px`,
                '--ripple-from': heroRipple.from,
                '--ripple-to': heroRipple.to,
              }}
              onAnimationEnd={() => {
                setHeroRipple((current) => current?.id === heroRipple.id ? null : current);
              }}
            />
          )}
          <div className="hero-type" id="hero-title">
            <span className="the">The</span>
            <span className="elastic">ELASTIC</span>
            <span className="developer">Developer.</span>
          </div>
          <div className="hero-statement">
            <p className="lead">A focused product studio for teams with something worth making.</p>
            <p>Make Matters brings strategy, design, and full-stack engineering into one senior-led team. Send the notes. Share the goal. We’ll turn the moving parts into a digital product people want to use.</p>
            <button className="round-link" onClick={openProjectModal} aria-label="Start a project"><ArrowDownRight size={34} /></button>
          </div>
          <div className="elastic-line" aria-hidden="true">
            <svg viewBox="0 0 1000 180" preserveAspectRatio="none">
              <path d="M-20,90 C180,10 235,170 420,90 S720,5 1020,90" />
            </svg>
          </div>
          <div className="hero-footnote mono">INDIA / WORKING WORLDWIDE <span>•</span> STRATEGY + DESIGN + ENGINEERING <span>•</span> INDEPENDENT PRODUCT STUDIO</div>
        </section>

        <section className="capacity" id="engagements" aria-labelledby="capacity-title">
          <div className="capacity-intro">
            <div>
              <p className="kicker">Use only what you need</p>
              <h2 id="capacity-title">Choose the shape of the work.</h2>
            </div>
            <div className="capacity-instruction">
              <p>Three clear ways to work together, each sized around the outcome—not a preset package.</p>
              <span className="mono">Select a frame to expand</span>
            </div>
          </div>

          <div className="engagement-gallery" role="group" aria-label="Engagement styles">
            {engagements.map((engagement, index) => {
              const isActive = index === activeEngagementIndex;
              const detailId = `engagement-details-${index}`;
              return (
                <button
                  className={isActive ? 'engagement-card active' : 'engagement-card'}
                  type="button"
                  aria-label={`Expand ${engagement.name}`}
                  aria-expanded={isActive}
                  aria-describedby={isActive ? detailId : undefined}
                  onClick={() => setActiveEngagementIndex(index)}
                  key={engagement.name}
                >
                  <img
                    src={engagement.image}
                    alt=""
                    loading="lazy"
                    style={{ objectPosition: engagement.imagePosition }}
                  />
                  <span className="engagement-shade" aria-hidden="true" />
                  <span className="engagement-index mono">0{index + 1} / 03</span>
                  <span className="engagement-collapsed" aria-hidden={isActive}>
                    <span className="engagement-collapsed-name">{engagement.name}</span>
                    <span className="engagement-open mono">Expand</span>
                  </span>
                  <span className="engagement-content" id={detailId} aria-hidden={!isActive}>
                    <span className="engagement-copy">
                      <span className="engagement-name">{engagement.name}</span>
                      <span className="engagement-description">{engagement.detail}</span>
                    </span>
                    <span className="engagement-meta">
                      <span><span className="mono">Timing</span><strong>{engagement.cadence}</strong></span>
                      <span><span className="mono">Rhythm</span><strong>{engagement.rhythm}</strong></span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="manifesto" id="work" aria-label="Working principles">
          <p className="manifesto-small">The offer, plainly:</p>
          <p className="manifesto-line">We bring <em>speed</em> without sloppiness,</p>
          <p className="manifesto-line indent-one"><em>taste</em> without theatre,</p>
          <p className="manifesto-line indent-two">and <em>ownership</em> without supervision.</p>
        </section>

        <section className="capabilities" aria-labelledby="capabilities-title">
          <div className="section-rail">
            <p className="mono">WHAT WE CAN OWN</p>
            <span className="rail-line" />
            <p>01—03</p>
          </div>
          <div className="capability-list">
            <h2 id="capabilities-title" className="sr-only">Capabilities</h2>
            {capabilities.map(([title, copy], index) => (
              <article className="capability" key={title}>
                <span className="cap-index mono">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="proof" ref={proofRef} aria-labelledby="proof-title">
          <div className="proof-title-wrap">
            <span className={proofStamped ? 'stamp stamped' : 'stamp'}>NO SMOKE<br />NO MIRRORS</span>
            <h2 id="proof-title">No borrowed logos.<br />No invented case studies.</h2>
          </div>
          <div className="proof-copy">
            <p>We’re building this studio on direct relationships, not borrowed credibility. No vague praise or inflated claims—judge us by the clarity of our thinking, the quality of the work, and how we handle your first piece of scope.</p>
            <div className="trial-card">
              <span className="mono">THE LOW-RISK START</span>
              <h3>One paid pilot. One useful outcome.</h3>
              <ul>
                <li><Check size={17} /> Clear scope before kickoff</li>
                <li><Check size={17} /> Working slice in days, not months</li>
                <li><Check size={17} /> Continue only if the fit is right</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="method" id="method" aria-labelledby="method-title">
          <div className="method-heading">
            <p className="kicker">Low ceremony. High signal.</p>
            <h2 id="method-title">Your notes become the starting line.</h2>
          </div>
          <div className="steps-shell">
            <div className="process-flow" aria-hidden="true">
              <span className="process-artifact">
                <span className="artifact-stage artifact-notes">
                  <svg viewBox="0 0 64 64">
                    <g className="note-back">
                      <path d="M17 12h32v39H17z" />
                      <path d="M23 21h17M23 28h12M23 35h19" />
                    </g>
                    <g className="note-front">
                      <path d="M9 19h34v37H9z" />
                      <path d="m15 29 7-4 4 5 8-6M15 38c6-4 10 6 19 0M15 47h15" />
                    </g>
                  </svg>
                </span>
                <span className="artifact-stage artifact-plan">
                  <svg viewBox="0 0 64 64">
                    <path className="plan-sheet" d="M8 10h48v44H8z" />
                    <path className="plan-grid" d="M8 22h48M25 22v32M25 37h31" />
                    <path className="plan-check" d="m13 29 3 3 5-7M13 44l3 3 5-7" />
                    <path className="plan-line" d="M31 29h17M31 44h12" />
                  </svg>
                </span>
                <span className="artifact-stage artifact-product">
                  <svg viewBox="0 0 64 64">
                    <path className="product-frame" d="M6 11h52v42H6z" />
                    <path className="product-bar" d="M6 21h52" />
                    <circle cx="13" cy="16" r="1.5" />
                    <circle cx="19" cy="16" r="1.5" />
                    <path className="product-sidebar" d="M12 27h11v20H12z" />
                    <path className="product-ui" d="M29 28h21v6H29zM29 39h9v8h-9zM42 39h8v8h-8z" />
                  </svg>
                  <i />
                </span>
                <span className="artifact-convert" />
              </span>
            </div>
            <ol className="steps">
              <li><h3>Drop the context</h3><p>Send a Loom, call notes, sketches, or the messy document. We ask only the questions that change the build.</p></li>
              <li><h3>Get the plan</h3><p>We return a concise scope: what ships, what waits, the timeline, the price, and any risks worth knowing.</p></li>
              <li><h3>Watch it become real</h3><p>You get short progress notes and working demos. Decisions stay visible; long status meetings stay optional.</p></li>
            </ol>
          </div>
        </section>

        <section className="fit" aria-labelledby="fit-title">
          <h2 id="fit-title">A good fit if—</h2>
          <div className="fit-ticker" aria-label="Good fit indicators">
            <div><span>you value clear ownership</span><i>◆</i><span>the work needs design judgment</span><i>◆</i><span>speed matters</span><i>◆</i><span>your calendar is already full</span></div>
          </div>
          <p>Probably not a fit if you need a full-time employee, daily attendance meetings, or ten people copied on every small decision.</p>
        </section>

        <section className="faq" aria-labelledby="faq-title">
          <h2 id="faq-title">Before you ask</h2>
          <div className="faq-list">
            {faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}
          </div>
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-title">
          <div className="contact-top">
            <p className="mono">HAVE A BUILD IN MIND?</p>
            <p>No polished brief required.</p>
          </div>
          <h2 id="contact-title">SEND THE<br /><span>MESSY NOTES.</span></h2>
          <div className="contact-actions">
            <button className="primary-action" onClick={openProjectModal}>Start a project <ArrowUpRight /></button>
            <button className="secondary-action" onClick={copyBrief}>{copied ? <Check /> : <Copy />} {copied ? 'Brief copied' : 'Copy a brief template'}</button>
          </div>
          <div className="contact-note">
            <span className="availability"><i /> Booking selected projects</span>
            <p>We usually reply within two working days.</p>
          </div>
        </section>
      </main>

      {projectModalOpen && (
        <div
          className="project-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setProjectModalOpen(false);
          }}
        >
          <section
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
          >
            <header className="project-modal-header">
              <div className="modal-index mono">NEW PROJECT / 01</div>
              <div className="modal-heading">
                <p className="kicker">No polished brief required</p>
                <h2 id="project-modal-title">Tell us what<br /><span>needs</span><br /><span>moving.</span></h2>
                <p>Rough notes are welcome. We’ll take it from there.</p>
              </div>
              <button
                ref={closeModalButtonRef}
                className="modal-close"
                onClick={() => setProjectModalOpen(false)}
                aria-label="Close project form"
              >
                <X />
              </button>
            </header>

            <div className="project-form-shell">
              {!formLoaded && (
                <div className="form-loading" aria-live="polite">
                  <span className="form-loading-mark" />
                  <p className="mono">Loading Google Form…</p>
                </div>
              )}
              <iframe
                className={formLoaded ? 'project-form loaded' : 'project-form'}
                src={GOOGLE_FORM_EMBED_URL}
                title="Start a project with Make Matters"
                onLoad={() => setFormLoaded(true)}
              >
                Loading project form…
              </iframe>
            </div>
          </section>
        </div>
      )}

      <footer>
        <p>© {year} MAKE MATTERS</p>
        <p>INDEPENDENT PRODUCT STUDIO</p>
        <a href="#top">BACK TO TOP ↑</a>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
