import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const technologies = [
  { icon: '🍃', name: 'MongoDB', text: 'A flexible NoSQL database that stores application data as documents.' },
  { icon: '⚡', name: 'Express', text: 'A lightweight Node.js framework used to build APIs and backend routes.' },
  { icon: '⚛️', name: 'React', text: 'A component-based JavaScript library for interactive user interfaces.' },
  { icon: '🟢', name: 'Node.js', text: 'The JavaScript runtime powering the server and backend services.' }
];

const stages = ['GitHub Push', 'Install', 'Test', 'Docker Build', 'Deploy'];

function App() {
  const [selected, setSelected] = useState(0);
  const [running, setRunning] = useState(false);
  const [activeStage, setActiveStage] = useState(-1);

  async function runPipeline() {
    if (running) return;
    setRunning(true); setActiveStage(-1);
    for (let i = 0; i < stages.length; i++) {
      await new Promise(r => setTimeout(r, 650));
      setActiveStage(i);
    }
    setRunning(false);
  }

  return <>
    <nav><div className="brand"><span>◈</span> MERN DEPLOY LAB</div><div className="navlinks"><a href="#stack">Stack</a><a href="#docker">Docker</a><a href="#jenkins">Jenkins</a></div></nav>
    <main>
      <section className="hero">
        <div className="hero-copy"><div className="eyebrow">BUILD • CONTAINERIZE • AUTOMATE</div><h1>From <em>code</em> to<br/>production.</h1><p>Learn how a MERN application moves from a GitHub repository through Docker containers and a Jenkins CI/CD pipeline.</p><div className="actions"><a className="primary" href="#stack">Explore the stack ↓</a><button onClick={runPipeline}>{running ? 'Pipeline running...' : '▶ Simulate pipeline'}</button></div></div>
        <div className="terminal"><div className="terminal-top"><i></i><i></i><i></i><span>deployment.pipeline</span></div><div className="code"><p><b>$</b> git push origin main</p><p className="muted">✓ Source received by Jenkins</p><p><b>$</b> docker compose build</p><p className="muted">✓ Images created successfully</p><p><b>$</b> docker compose up -d</p><p className="green">● Application deployed</p><p className="cursor">_</p></div></div>
      </section>

      <section id="stack" className="section"><div className="section-label">01 / THE APPLICATION</div><h2>The MERN <em>stack</em></h2><p className="section-text">Four technologies working together to build a modern full-stack JavaScript application.</p><div className="tech-grid">{technologies.map((t,i)=><button className={'tech '+(selected===i?'selected':'')} key={t.name} onClick={()=>setSelected(i)}><span>{t.icon}</span><strong>{t.name}</strong><small>{selected===i?t.text:'Click to explore'}</small></button>)}</div></section>

      <section id="docker" className="section dark"><div className="section-label">02 / THE CONTAINER</div><h2>Package it with <em>Docker</em></h2><div className="docker-layout"><div><p className="section-text">Docker makes your application portable by packaging its code and dependencies into isolated containers.</p><div className="flow"><div>React<br/><small>Client</small></div><b>→</b><div>Node<br/><small>API</small></div><b>→</b><div>MongoDB<br/><small>Database</small></div></div></div><pre>{`services:
  client:
    build: ./client
  server:
    build: ./server
  mongo:
    image: mongo`}</pre></div></section>

      <section id="jenkins" className="section"><div className="section-label">03 / THE AUTOMATION</div><h2>Automate with <em>Jenkins</em></h2><p className="section-text">Every push can trigger a repeatable deployment process. Click the simulation button above to watch the stages complete.</p><div className="pipeline">{stages.map((s,i)=><React.Fragment key={s}><div className={'stage '+(i<=activeStage?'done':'')+(i===activeStage?' active':'')}><span>{i<activeStage?'✓':i+1}</span><strong>{s}</strong><small>{i<=activeStage?'Complete':'Waiting'}</small></div>{i<stages.length-1&&<div className={'line '+(i<activeStage?'filled':'')}></div>}</React.Fragment>)}</div><div className="jenkins-card"><div><span className="tag">Jenkinsfile</span><h3>Pipeline as code</h3><p>Your deployment workflow lives in the repository, making it version-controlled and reproducible.</p></div><pre>{`pipeline {
  stages {
    stage('Build') { ... }
    stage('Deploy') { ... }
  }
}`}</pre></div></section>
    </main><footer><span>◈ MERN DEPLOY LAB</span><p>React • Node.js • Docker • Jenkins</p></footer>
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
