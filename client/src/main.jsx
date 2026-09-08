import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const technologies = [
  { icon: '🍃', name: 'MongoDB Atlas', text: 'Cloud database used to store application data.' },
  { icon: '⚡', name: 'Express', text: 'Backend framework that provides API routes.' },
  { icon: '⚛️', name: 'React', text: 'Interactive frontend user interface.' },
  { icon: '🟢', name: 'Node.js', text: 'JavaScript runtime powering the backend.' }
];

const stages = ['GitHub Checkout', 'Install Dependencies', 'Test Backend', 'Build React', 'Deploy with Nginx'];

function App() {
  const [selected, setSelected] = useState(0);
  const [running, setRunning] = useState(false);
  const [activeStage, setActiveStage] = useState(-1);
  const [apiStatus, setApiStatus] = useState('Checking API...');
  const [apiData, setApiData] = useState(null);

  async function checkApi() {
    try {
      const response = await fetch('/api/health');
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      setApiData(data);
      setApiStatus('Backend connected');
    } catch (error) {
      setApiStatus('Backend unavailable');
      setApiData(null);
    }
  }

  useEffect(() => {
    checkApi();
  }, []);

  async function runPipeline() {
    if (running) return;
    setRunning(true);
    setActiveStage(-1);
    for (let i = 0; i < stages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 650));
      setActiveStage(i);
    }
    setRunning(false);
  }

  return <>
    <nav>
      <div className="brand"><span>◈</span> MERN DEPLOY LAB</div>
      <div className="navlinks"><a href="#stack">Stack</a><a href="#deployment">Deployment</a><a href="#jenkins">Jenkins</a></div>
    </nav>

    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">BUILD • AUTOMATE • DEPLOY</div>
          <h1>From <em>code</em> to<br/>production.</h1>
          <p>A complete MERN application deployed automatically from GitHub using Jenkins, Nginx and a Node.js systemd service.</p>
          <div className="actions">
            <a className="primary" href="#stack">Explore the stack ↓</a>
            <button onClick={runPipeline}>{running ? 'Pipeline running...' : '▶ Simulate pipeline'}</button>
          </div>
        </div>

        <div className="terminal">
          <div className="terminal-top"><i></i><i></i><i></i><span>deployment.pipeline</span></div>
          <div className="code">
            <p><b>$</b> git push origin main</p>
            <p className="muted">✓ Jenkins fetched source code</p>
            <p><b>$</b> npm run build</p>
            <p className="muted">✓ React production build created</p>
            <p><b>$</b> systemctl restart mern-deploy</p>
            <p className="green">● Application deployed</p>
            <p className="cursor">_</p>
          </div>
        </div>
      </section>

      <section className="section" id="deployment">
        <div className="section-label">LIVE / APPLICATION STATUS</div>
        <h2>MERN API <em>connection</em></h2>
        <p className="section-text">This frontend calls the Express backend through Nginx at <code>/api/health</code>.</p>
        <div className="jenkins-card">
          <div>
            <span className="tag">API Status</span>
            <h3>{apiStatus}</h3>
            <p>{apiData ? `Database: ${apiData.database} • Stack: ${apiData.stack}` : 'The production API could not be reached.'}</p>
            <button onClick={checkApi}>Check connection</button>
          </div>
          <pre>{apiData ? JSON.stringify(apiData, null, 2) : '{\n  "status": "waiting"\n}'}</pre>
        </div>
      </section>

      <section id="stack" className="section">
        <div className="section-label">01 / THE APPLICATION</div>
        <h2>The MERN <em>stack</em></h2>
        <p className="section-text">MongoDB, Express, React and Node.js working together as a full-stack JavaScript application.</p>
        <div className="tech-grid">
          {technologies.map((technology, index) => (
            <button className={'tech ' + (selected === index ? 'selected' : '')} key={technology.name} onClick={() => setSelected(index)}>
              <span>{technology.icon}</span>
              <strong>{technology.name}</strong>
              <small>{selected === index ? technology.text : 'Click to explore'}</small>
            </button>
          ))}
        </div>
      </section>

      <section id="jenkins" className="section dark">
        <div className="section-label">02 / THE AUTOMATION</div>
        <h2>Deploy with <em>Jenkins</em></h2>
        <p className="section-text">Jenkins fetches this repository, tests the Node.js backend, builds React, deploys the files and restarts the backend service.</p>
        <div className="pipeline">
          {stages.map((stage, index) => <React.Fragment key={stage}>
            <div className={'stage ' + (index <= activeStage ? 'done' : '') + (index === activeStage ? ' active' : '')}>
              <span>{index < activeStage ? '✓' : index + 1}</span>
              <strong>{stage}</strong>
              <small>{index <= activeStage ? 'Complete' : 'Waiting'}</small>
            </div>
            {index < stages.length - 1 && <div className={'line ' + (index < activeStage ? 'filled' : '')}></div>}
          </React.Fragment>)}
        </div>
      </section>
    </main>

    <footer><span>◈ MERN DEPLOY LAB</span><p>MongoDB • Express • React • Node.js • Jenkins • Nginx</p></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
