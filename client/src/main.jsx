import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const pipeline = [
  { id: '01', title: 'GitHub', sub: 'Push source', code: 'git push origin main' },
  { id: '02', title: 'Jenkins', sub: 'Build + verify', code: 'npm run build' },
  { id: '03', title: 'React', sub: 'Production bundle', code: 'vite build' },
  { id: '04', title: 'Nginx', sub: 'Serve instantly', code: 'release → live' },
];

const specs = [
  ['54 min', 'Flight time'],
  ['24 km', 'Transmission range'],
  ['8K HDR', 'Cinematic camera'],
  ['360°', 'Obstacle intelligence'],
];

const Icon = ({ children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

function App() {
  const [api, setApi] = useState({ state: 'Checking', data: null });
  const [activeStage, setActiveStage] = useState(-1);
  const [running, setRunning] = useState(false);
  const [activeSpec, setActiveSpec] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scroll, setScroll] = useState(0);
  const timer = useRef(null);

  const checkApi = async () => {
    setApi({ state: 'Checking', data: null });
    try {
      const response = await fetch('/api/health', { cache: 'no-store' });
      if (!response.ok) throw new Error('API unavailable');
      const data = await response.json();
      setApi({ state: 'Online', data });
    } catch {
      setApi({ state: 'Offline', data: null });
    }
  };

  useEffect(() => {
    checkApi();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScroll(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer.current);
    };
  }, []);

  const runPipeline = async () => {
    if (running) return;
    setRunning(true);
    setActiveStage(-1);
    for (let i = 0; i < pipeline.length; i += 1) {
      await new Promise(resolve => { timer.current = setTimeout(resolve, 850); });
      setActiveStage(i);
    }
    setRunning(false);
    checkApi();
  };

  const scrollTo = id => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="app">
      <div className="scroll-progress" style={{ transform: `scaleX(${scroll})` }} />
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <header className="site-header">
        <nav className="nav">
          <button className="brand" onClick={() => scrollTo('top')} aria-label="AERON home">
            <span className="brand-symbol"><span /><span /></span>
            <span>AERON</span>
          </button>

          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <button onClick={() => scrollTo('aircraft')}>Aircraft</button>
            <button onClick={() => scrollTo('intelligence')}>Intelligence</button>
            <button onClick={() => scrollTo('deployment')}>Deployment</button>
          </div>

          <button className="nav-action" onClick={() => scrollTo('preorder')}>
            Pre-order <Icon size={15}><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></Icon>
          </button>
          <button className="menu-toggle" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
            <span /><span />
          </button>
        </nav>
      </header>

      <main id="top">
        <section className="hero" id="aircraft">
          <div className="hero-copy">
            <div className="eyebrow"><span className="signal" /> NEXT GENERATION AUTONOMOUS FLIGHT</div>
            <h1>Engineered<br />to see <em>beyond.</em></h1>
            <p className="hero-lead">A professional autonomous aerial system built around precision mapping, AI navigation and cinematic imaging.</p>
            <div className="hero-price">Starting at <strong>$2,499</strong></div>
            <div className="hero-actions">
              <button className="button button-primary" onClick={() => scrollTo('preorder')}>Configure aircraft <Icon size={16}><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></Icon></button>
              <button className="demo-link" onClick={() => scrollTo('intelligence')}><span className="play"><span /></span> Watch overview</button>
            </div>
            <div className="hero-foot"><span>AERON ONE</span><i /> <span>EDITION 2026</span></div>
          </div>

          <div className="hero-stage">
            <div className="stage-halo" />
            <div className="stage-grid" />
            <div className="drone-shadow" />
            <div className="drone" aria-label="Aeron autonomous aircraft illustration">
              <div className="arm arm-left"><span className="rotor" /><span className="motor" /></div>
              <div className="arm arm-right"><span className="rotor" /><span className="motor" /></div>
              <div className="drone-body">
                <span className="body-line" />
                <span className="body-brand">AERON</span>
                <span className="power-ring"><span /></span>
                <span className="body-led" />
              </div>
              <div className="front-camera"><span /><i /></div>
              <div className="landing-leg left" /><div className="landing-leg right" />
            </div>

            <div className="spec-stack">
              {specs.map(([value, label], index) => (
                <button key={label} className={`spec ${activeSpec === index ? 'selected' : ''}`} onClick={() => setActiveSpec(index)}>
                  <span className={`spec-icon spec-${index}`}>
                    {index === 0 && <Icon size={17}><rect x="4" y="6" width="16" height="12" rx="2"/><path d="M8 6V4h8v2"/></Icon>}
                    {index === 1 && <Icon size={17}><path d="M4 18 20 6"/><path d="M7 6h13v13"/></Icon>}
                    {index === 2 && <Icon size={17}><rect x="3" y="6" width="18" height="12" rx="3"/><circle cx="12" cy="12" r="3"/></Icon>}
                    {index === 3 && <Icon size={17}><path d="M12 3v4"/><path d="M12 17v4"/><path d="m4.9 4.9 2.8 2.8"/><path d="m16.3 16.3 2.8 2.8"/><circle cx="12" cy="12" r="4"/></Icon>}
                  </span>
                  <span><small>{label}</small><strong>{value}</strong></span>
                </button>
              ))}
            </div>

            <div className="overview-card">
              <div className="overview-image">
                <div className="mountain mountain-one" /><div className="mountain mountain-two" /><div className="sun" />
                <button onClick={() => scrollTo('intelligence')} className="overview-play"><span /></button>
              </div>
              <div className="overview-meta"><span>WATCH OVERVIEW</span><b>02:15</b></div>
            </div>
          </div>
        </section>

        <section className="trust-row section" aria-label="Trusted by innovators">
          <span>TRUSTED BY INNOVATORS WORLDWIDE</span>
          <div className="logos"><b>SKYDIO</b><b>BLACKSTONE</b><b>NATIONAL<br />GEOGRAPHIC</b><b>RED BULL</b><b>NVIDIA</b><b>PIX4D</b></div>
        </section>

        <section className="intelligence section" id="intelligence">
          <div className="section-top">
            <div><div className="eyebrow">01 / AWARENESS ENGINE</div><h2>It doesn't just fly.<br /><em>It understands.</em></h2></div>
            <p>Every surface, object and route becomes data. AERON turns that data into decisions in real time—without asking you to micromanage the aircraft.</p>
          </div>

          <div className="intelligence-grid">
            <article className="feature feature-dark">
              <div className="feature-orb"><div className="orb-core" /><div className="orb-ring ring-a" /><div className="orb-ring ring-b" /><span className="orb-pulse" /></div>
              <div className="feature-copy"><span>01</span><h3>Spatial intelligence</h3><p>Build a living 3D map while you move. Obstacles become predictable, routes become adaptive.</p></div>
            </article>
            <article className="feature feature-image">
              <div className="visor"><div className="visor-glow" /><div className="visor-lines" /></div>
              <div className="feature-copy"><span>02</span><h3>Vision system</h3><p>Eight synchronized sensors read depth, motion and detail from every direction.</p></div>
            </article>
            <article className="feature feature-wide">
              <div className="signal-ui"><div className="signal-card"><span>MISSION</span><strong>COASTAL SURVEY</strong><small>12.4 km · autonomous</small></div><div className="signal-path"><i /><i /><i /><i /></div></div>
              <div className="feature-copy"><span>03</span><h3>Mission autonomy</h3><p>Set the intent. AERON handles the route, corrections and return-to-home logic.</p></div>
            </article>
          </div>
        </section>

        <section className="deployment section" id="deployment">
          <div className="deployment-head">
            <div><div className="eyebrow">02 / YOUR PRODUCTION ENGINE</div><h2>From code to<br /><em>airborne.</em></h2></div>
            <div className="deployment-status"><span className={`status-dot ${api.state.toLowerCase()}`} /><div><small>LIVE API</small><strong>{api.state}</strong></div><button onClick={checkApi} aria-label="Refresh API status"><Icon size={16}><path d="M20 11a8 8 0 0 0-14.9-4"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.9 4"/><path d="M20 20v-4h-4"/></Icon></button></div>
          </div>

          <div className="deployment-shell">
            <div className="deployment-visual">
              <div className="terminal">
                <div className="terminal-top"><span><i /><i /><i /></span><small>production.pipeline</small><b>{running ? 'RUNNING' : 'READY'}</b></div>
                <div className="terminal-body">
                  <p><span>$</span> git push origin <strong>main</strong></p>
                  <p className="terminal-dim">✓ source synchronized</p>
                  <p><span>$</span> npm run <strong>build</strong></p>
                  <p className="terminal-dim">✓ optimized React bundle</p>
                  <p><span>$</span> release <strong>nginx</strong></p>
                  <p className="terminal-success">● {api.state === 'Online' ? 'production is healthy' : 'waiting for health check'}</p>
                </div>
              </div>
              <div className="floating-chip chip-api"><span className="chip-icon"><Icon size={15}><path d="M12 3v18"/><path d="M5 8h14"/><path d="M5 16h14"/></Icon></span><span><small>API</small><strong>Port 5000</strong></span></div>
              <div className="floating-chip chip-nginx"><span className="chip-icon"><Icon size={15}><path d="m5 8 7-5 7 5-7 5-7-5Z"/><path d="m5 16 7 5 7-5"/></Icon></span><span><small>EDGE</small><strong>Nginx live</strong></span></div>
            </div>

            <div className="pipeline-list">
              {pipeline.map((stage, index) => (
                <button key={stage.id} className={`pipeline-item ${index <= activeStage ? 'complete' : ''} ${index === activeStage && running ? 'current' : ''}`} onClick={() => setActiveStage(index)}>
                  <span className="pipeline-number">{index <= activeStage ? '✓' : stage.id}</span>
                  <span className="pipeline-name"><strong>{stage.title}</strong><small>{stage.sub}</small></span>
                  <code>{stage.code}</code>
                  <Icon size={15}><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></Icon>
                </button>
              ))}
              <button className="deploy-button" onClick={runPipeline}>{running ? 'Pipeline running…' : 'Run deployment'} <Icon size={17}><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></Icon></button>
            </div>
          </div>
        </section>

        <section className="manifesto section">
          <div className="manifesto-line" />
          <div className="manifesto-content"><span className="eyebrow">03 / THE DIFFERENCE</span><h2>Less interface.<br /><em>More intelligence.</em></h2><p>Hardware that disappears behind the experience. Software that turns complexity into a single, calm decision.</p></div>
          <div className="manifesto-orbit"><span /><span /><span /></div>
        </section>

        <section className="preorder section" id="preorder">
          <div className="preorder-panel">
            <div className="preorder-copy"><div className="eyebrow">AERON ONE / 2026 EDITION</div><h2>Make the sky<br /><em>your canvas.</em></h2><p>Early access includes the aircraft, autonomous flight suite and priority mission updates.</p><div className="preorder-price"><strong>$2,499</strong><span>or $208/mo</span></div><button className="button button-primary">Reserve your aircraft <Icon size={16}><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></Icon></button></div>
            <div className="preorder-object"><div className="mini-drone"><span className="mini-wing left" /><span className="mini-wing right" /><div /></div><div className="object-caption"><span>ONE / 2026</span><b>PRECISION MADE</b></div></div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand"><span className="brand-symbol"><span /><span /></span><strong>AERON</strong></div>
        <div className="footer-links"><button onClick={() => scrollTo('aircraft')}>Aircraft</button><button onClick={() => scrollTo('intelligence')}>Technology</button><button onClick={() => scrollTo('deployment')}>Deployment</button></div>
        <span className="footer-note">AUTONOMOUS SYSTEMS / 2026</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
