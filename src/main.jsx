import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Sparkles, MapPin, ArrowRight, Leaf, Camera, Landmark, Utensils, Mountain } from 'lucide-react';
import './styles.css';

const interests = [
  ['Heritage', Landmark], ['Nature', Leaf], ['Photography', Camera],
  ['Food', Utensils], ['Adventure', Mountain]
];

function getDestinations() {
  return window.UnseenGoData?.destinations || [];
}

function App() {
  const [selected, setSelected] = useState(['Heritage', 'Photography']);
  const [prompt, setPrompt] = useState('I have 2 days from Bengaluru. I love history, photography and quiet places.');
  const [results, setResults] = useState([]);

  const featured = useMemo(() => {
    const all = getDestinations();
    const names = ['Gandikota', 'Lepakshi', 'Agumbe', 'Hampi'];
    return names.map(n => all.find(d => d.identity?.name?.toLowerCase() === n.toLowerCase())).filter(Boolean);
  }, []);

  const runAI = () => {
    const engine = window.UnseenGoRecommendation;
    if (!engine) return;
    const all = getDestinations();
    const cityMatch = prompt.match(/from\s+([A-Za-z ]+)/i)?.[1]?.trim();
    const city = cityMatch || '';
    const pool = city ? all.filter(d => d.identity?.city?.toLowerCase() === city.toLowerCase()) : all;
    const ranked = engine.recommend(pool.length ? pool : all, { interests: selected.map(s => s.toLowerCase()), pace: 'moderate' }, 5);
    setResults(ranked);
  };

  const toggleInterest = (name) => setSelected(v => v.includes(name) ? v.filter(x => x !== name) : [...v, name]);

  return <div className="app">
    <header className="nav">
      <a className="brand" href="./"><span>UNSEEN</span><b>GO</b></a>
      <nav><a className="active" href="./">Home</a><a href="./discover.html">Discover</a><a href="./india-cities.html">Destinations</a><a href="./tripideas.html">Ideas</a><a href="./planner.html">Plan</a></nav>
      <a className="nav-cta" href="#ai"><Sparkles size={16}/> AI Discover</a>
    </header>

    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">INDIA'S AI HIDDEN-GEM DISCOVERY ENGINE</div>
          <h1>India has more to <em>discover.</em></h1>
          <p>Go beyond the places everyone knows. UnseenGo turns your interests, time and travel style into a personalized hidden-gem shortlist.</p>
          <div className="hero-actions"><a className="primary" href="#ai"><Sparkles size={17}/> Discover my hidden gems</a><a className="secondary" href="./india-cities.html">Explore India <ArrowRight size={16}/></a></div>
          <div className="trust"><MapPin size={14}/> Structured destination data · Explainable recommendation engine</div>
        </div>
        <div className="hero-visual"><div className="hero-card"><div className="hero-score">91 <small>UNSEENGO</small></div><div className="pin">⌖</div><div className="hero-label"><small>HIDDEN INDIA</small><strong>Gandikota</strong><span>Andhra Pradesh · Gorge · Heritage</span></div></div></div>
      </section>

      <section className="section" id="ai">
        <div className="section-head"><div><div className="eyebrow">THE UNSEENGO DIFFERENCE</div><h2>Tell us what you want. <em>We'll decide where.</em></h2></div><p>Use natural language and interests. The Phase 3.1 engine ranks available destinations using transparent, weighted signals.</p></div>
        <div className="ai-panel">
          <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} aria-label="Trip preferences" />
          <div className="interest-row">{interests.map(([name,Icon])=><button className={selected.includes(name)?'interest active':'interest'} onClick={()=>toggleInterest(name)} key={name}><Icon size={17}/>{name}</button>)}</div>
          <button className="run" onClick={runAI}><Sparkles size={17}/> Find my hidden gem</button>
        </div>
        {results.length > 0 && <div className="results"><div className="result-title"><div><div className="eyebrow">PERSONALIZED RESULTS</div><h3>Your top matches</h3></div><span>{results.length} ranked destinations</span></div>{results.map((r,i)=><article className="result-card" key={r.destination.identity?.name || i}><div><span className="rank">0{i+1}</span><div><small>{r.destination.identity?.region || 'India'} · {r.destination.classification?.categories?.[0] || 'Experience'}</small><h4>{r.destination.identity?.name}</h4><p>{r.explanation}</p></div></div><strong>{r.score}<small>/100</small></strong></article>)}</div>}
      </section>

      <section className="section alt-bg"><div className="section-head"><div><div className="eyebrow">START WITH CURIOSITY</div><h2>Hidden India, <em>beautifully mapped.</em></h2></div><p>Discover destinations by story, experience and place — then use AI when you want a decision instead of another list.</p></div><div className="featured-grid">{featured.map((d,i)=><a className={'featured '+(i===0?'large':'')} href={`./place.html?place=${encodeURIComponent(d.identity.name)}`} key={d.identity.name}><div className="featured-image"/><div><small>{d.identity.region || 'India'} · Hidden gem</small><h3>{d.identity.name}</h3><p>{d.content?.description || 'A place worth discovering beyond the obvious route.'}</p><span>Explore story <ArrowRight size={14}/></span></div></a>)}</div></section>

      <section className="section"><div className="section-head"><div><div className="eyebrow">BUILT FOR BETTER TRAVEL</div><h2>More than a <em>tourist list.</em></h2></div></div><div className="feature-grid"><div><Leaf/><h3>Sustainable by design</h3><p>Our next decision-engine layers sustainability, crowd pressure, environmental load and local economic opportunity.</p></div><div><Sparkles/><h3>Explainable AI</h3><p>Every recommendation can show why it matched you instead of hiding the decision behind a black box.</p></div><div><MapPin/><h3>Local discovery</h3><p>Shift attention toward lesser-known destinations and the communities that benefit from responsible travel.</p></div><div><Camera/><h3>Personal journeys</h3><p>Your interests become a travel profile that can power itineraries, routes and experiences.</p></div></div></section>
    </main>
    <footer><b>UNSEEN<span>GO</span></b><span>India has more to discover.</span></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
