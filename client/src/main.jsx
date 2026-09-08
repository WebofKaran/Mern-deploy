import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const stages = [
  ['01', 'Checkout', 'GitHub'],
  ['02', 'Install', 'Node modules'],
  ['03', 'Verify', 'API health'],
  ['04', 'Build', 'React production'],
  ['05', 'Release', 'Nginx']
];

const stack = [
  { mark: 'M', name: 'MongoDB', detail: 'Persistent data layer', tone: 'green' },
  { mark: 'E', name: 'Express', detail: 'REST API layer', tone: 'orange' },
  { mark: 'R', name: 'React', detail: 'Interactive experience', tone: 'blue' },
  { mark: 'N', name: 'Node.js', detail: 'Runtime & services', tone: 'lime' }
];

function App() {
  const [api, setApi] = useState({ state: 'Checking', data: null });
  const [running, setRunning] = useState(false);
  const [active, setActive] = useState(-1);
  const [mode, setMode] = useState('overview');
  const [cursor, setCursor] = useState({ x: 50, y: 18 });
  const timer = useRef(null);

  const checkApi = async () => {
    setApi({ state: 'Checking', data: null });
    try {
      const response = await fetch('/api/health');
      if (!response.ok) throw new Error('Unhealthy');
      const data = await response.json();
      setApi({ state: 'Online', data });
    } catch {
      setApi({ state: 'Offline', data: null });
    }
  };

  useEffect(() => {
    checkApi();
    return () => clearTimeout(timer.current);
  }, []);

  const runPipeline = async () => {
    if (running) return;
    setRunning(true);
    setActive(-1);
    for (let i = 0; i < stages.length; i++) {
      await new Promise(resolve => { timer.current = setTimeout(resolve, 700); });
      setActive(i);
    }
    setRunning(false);
    checkApi();
  };

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="app" onMouseMove={e => setCursor({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 })}>
      <div className="cursor-glow" style={{ '--x': `${cursor.x}%`, '--y': `${cursor.y}%` }} />

      <header className="nav-wrap">
        <nav className="nav glass">
          <button className="wordmark" onClick={() => scrollTo('top')} aria-label="Back to top"><span className="wordmark-dot" />MERIDIEN</button>
          <div className="nav-center">
            <button onClick={() => scrollTo('stack')}>Stack</button>
            <button onClick={() => scrollTo('flow')}>Pipeline</button>
            <button onClick={() => scrollTo('status')}>Status</button>
          </div>
          <button className="nav-cta" onClick={runPipeline}>{running ? 'Deploying' : 'Run deploy'} <span>↗</span></button>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-shell">
          <div className="hero-copy reveal">
            <div className="kicker"><span className="live-dot" /> CONTINUOUS DELIVERY / LIVE</div>
            <h1>Code moves.<br /><span>Production</span> follows.</h1>
            <p>A cinematic deployment interface for your MERN stack. Push a UI change, let Jenkins build it, and watch the latest version arrive on your server.</p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={runPipeline}>{running ? 'Pipeline running…' : 'Launch pipeline'} <span>↗</span></button>
              <button className="text-btn" onClick={() => scrollTo('flow')}><i className="play">▶</i> Watch the flow</button>
            </div>
            <div className="hero-meta"><span>main branch</span><b /> <span>Auto build</span><b /> <span>Fedora + Nginx</span></div>
          </div>

          <div className="hero-visual" aria-label="Interactive deployment visualization">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="pipeline-sculpture glass">
              <div className="sculpture-top"><span className="traffic"><i /><i /><i /></span><small>production.pipeline</small><span className="tiny-live">LIVE</span></div>
              <div className="terminal-lines">
                <p><span>$</span> git push origin <b>main</b></p>
                <p className="dim">✓ Source synchronized</p>
                <p><span>$</span> npm run <b>build</b></p>
                <p className="dim">✓ Optimized bundle generated</p>
                <p><span>$</span> systemctl reload <b>nginx</b></p>
                <p className="success">● Latest version is live</p>
              </div>
              <div className="sculpture-floor"><span>Build <b>01:24</b></span><span>SHA <b>8fd2c9</b></span><span>Region <b>LOCAL</b></span></div>
            </div>
            <div className="floating-card api-float glass">
              <div className="mini-icon">⌁</div><div><small>API</small><strong>{api.state}</strong></div><span className={'status-dot ' + api.state.toLowerCase()} />
            </div>
            <div className="floating-card deploy-float glass"><span className="mini-check">✓</span><div><small>Deployment</small><strong>Automated</strong></div></div>
          </div>
        </section>

        <section id="status" className="status-strip section-shell">
          <div className="status-intro"><span className="section-number">01</span><p>Everything is designed around one simple loop: <strong>change → push → build → ship.</strong></p></div>
          <div className="status-grid">
            <div className="metric glass"><small>API CONNECTION</small><strong>{api.state}</strong><span className={'metric-line ' + api.state.toLowerCase()} /></div>
            <div className="metric glass"><small>DEPLOY TARGET</small><strong>Nginx</strong><span className="metric-sub">Static React build</span></div>
            <div className="metric glass"><small>BACKEND</small><strong>Node.js</strong><span className="metric-sub">Port 5000</span></div>
          </div>
        </section>

        <section id="flow" className="flow-section section-shell">
          <div className="section-heading"><div><span className="kicker">02 / AUTOMATION ENGINE</span><h2>A deployment flow<br />you can <span>feel.</span></h2></div><p>Interactive by design. Run the pipeline and each stage progresses through the exact path your application follows from GitHub to the production server.</p></div>
          <div className="pipeline-track glass">
            <div className="track-progress" style={{ width: active < 0 ? '0%' : `${Math.min(100, (active + 1) / stages.length * 100)}%` }} />
            {stages.map((stage, index) => <button key={stage[1]} className={'flow-node ' + (index <= active ? 'done ' : '') + (index === active && running ? 'current' : '')} onClick={() => setActive(index)}>
              <span className="node-index">{index < active ? '✓' : stage[0]}</span><strong>{stage[1]}</strong><small>{index < active ? 'Complete' : index === active ? (running ? 'Processing' : 'Ready') : stage[2]}</small>
            </button>)}
          </div>
          <div className="pipeline-controls"><button className="secondary-btn" onClick={runPipeline}>{running ? 'Running deployment…' : 'Simulate deployment'}</button><span>{active >= 0 ? `${Math.min(active + 1, stages.length)} of ${stages.length} stages active` : 'Waiting for deployment command'}</span></div>
        </section>

        <section id="stack" className="stack-section section-shell">
          <div className="stack-layout">
            <div className="stack-copy"><span className="kicker">03 / THE FOUNDATION</span><h2>One stack.<br /><span>Zero friction.</span></h2><p>Four technologies, one clean production workflow. Every layer has a purpose, and every deployment passes through the same reliable path.</p><button className="text-btn dark-text" onClick={() => setMode(mode === 'overview' ? 'detail' : 'overview')}>{mode === 'overview' ? 'Explore architecture' : 'Return to overview'} <span>↗</span></button></div>
            <div className={'stack-panel ' + mode}>
              {stack.map((item, index) => <button className={'stack-card glass ' + item.tone} key={item.name} onClick={() => setMode('detail')}><span className="stack-mark">{item.mark}</span><div><small>0{index + 1}</small><strong>{item.name}</strong><p>{item.detail}</p></div><i>↗</i></button>)}
            </div>
          </div>
        </section>

        <section className="api-section section-shell">
          <div className="api-window glass">
            <div className="api-copy"><span className="kicker"><span className="live-dot" /> LIVE SERVICE</span><h2>Your backend is<br /><span>not a mystery.</span></h2><p>The frontend checks the production API through <code>/api/health</code>. Use the control below to verify the live connection without leaving the page.</p><button className="primary-btn" onClick={checkApi}>Check API <span>↗</span></button></div>
            <div className="api-console"><div className="console-bar"><span>GET</span><code>/api/health</code><b>{api.state === 'Online' ? '200 OK' : api.state}</b></div><pre>{api.data ? JSON.stringify(api.data, null, 2) : '{\n  "status": "waiting"\n}'}</pre></div>
          </div>
        </section>

        <section className="closing section-shell">
          <div><span className="kicker">READY WHEN YOU ARE</span><h2>Change the UI.<br /><span>Ship the future.</span></h2></div><button className="mega-button" onClick={runPipeline}><span>{running ? 'Deploying your build' : 'Run the deployment'}</span><i>↗</i></button>
        </section>
      </main>

      <footer><div className="wordmark"><span className="wordmark-dot" />MERIDIEN</div><p>MERN • JENKINS • NGINX • CONTINUOUS DELIVERY</p><span>© 2026</span></footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
