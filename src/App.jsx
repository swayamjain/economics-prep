import React, { useState } from 'react';
import { BookOpen, Calendar, ChevronDown, BarChart3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { analysisData } from './data';
import './index.css';

import summer24Raw from './papers/Summer_2024_Answers.md?raw';
import winter24Raw from './papers/Winter_2024_Answers.md?raw';
import summer25Raw from './papers/Summer_2025_Answers.md?raw';
import predictiveRaw from './papers/Predictive_Paper_Answers.md?raw';

const papers = {
  summer25: { title: "Summer 2025", content: summer25Raw },
  summer24: { title: "Summer 2024", content: summer24Raw },
  winter24: { title: "Winter 2024", content: winter24Raw },
  predictive: { title: "Predictive Paper", content: predictiveRaw },
};

function parseMarkdown(md) {
  const items = [];
  const lines = md.split('\n');
  
  let currentTitle = null;
  let currentContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^##\s+Q\d+/) || line.match(/^###\s+\([a-z]\)/)) {
      if (currentTitle) {
        items.push({ title: currentTitle, content: currentContent.join('\n') });
      }
      currentTitle = line.replace(/^###?\s+/, '').trim();
      currentContent = [];
    } else if (currentTitle) {
      currentContent.push(line);
    }
  }
  
  if (currentTitle) {
    items.push({ title: currentTitle, content: currentContent.join('\n') });
  }

  return items.filter(item => {
    const isWrapper = item.title.match(/^Q1\.?\s*(Short Notes)?$/i) && item.content.trim() === '';
    return item.content.trim() !== '' && !isWrapper;
  });
}

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {activeTab === 'dashboard' ? (
          <Dashboard />
        ) : (
          <PaperViewer paperKey={activeTab} />
        )}
      </main>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab }) => (
  <aside className="sidebar">
    <div className="logo-container">
      <BookOpen className="logo-icon" size={24} />
      <div className="logo-text">
        <span className="logo-title">Economics<br/>Q&A Vault</span>
        <span className="logo-subtitle">CC<br/>Swayam<br/>Jain</span>
      </div>
    </div>
    
    <nav className="nav-links">
      <button 
        className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => setActiveTab('dashboard')}
      >
        <BarChart3 size={18} />
        Predictive Analysis
      </button>
      
      <div className="nav-section-title" style={{marginTop: '1.5rem', marginBottom: '0.25rem', paddingLeft: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b'}}>EXAM PAPERS</div>
      
      <button 
        className={`nav-btn ${activeTab === 'summer25' ? 'active' : ''}`}
        onClick={() => setActiveTab('summer25')}
      >
        <Calendar size={18} />
        Summer 2025
      </button>
      <button 
        className={`nav-btn ${activeTab === 'summer24' ? 'active' : ''}`}
        onClick={() => setActiveTab('summer24')}
      >
        <Calendar size={18} />
        Summer 2024
      </button>
      <button 
        className={`nav-btn ${activeTab === 'winter24' ? 'active' : ''}`}
        onClick={() => setActiveTab('winter24')}
      >
        <Calendar size={18} />
        Winter 2024
      </button>
      <button 
        className={`nav-btn ${activeTab === 'predictive' ? 'active' : ''}`}
        onClick={() => setActiveTab('predictive')}
      >
        <BookOpen size={18} />
        Predictive Paper
      </button>
    </nav>
  </aside>
);

const Dashboard = () => {
  return (
    <div className="fade-in">
      <h1 className="page-title">Predictive Analysis</h1>
      <p className="page-subtitle">Weighted topic occurrence across Summer '24, Winter '24, and Summer '25</p>
      
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <AnalysisCard 
          title="High Probability" 
          level="high" 
          data={analysisData.highProbability} 
          description="Appeared in all 3 previous exams."
          color="#fca5a5"
          bgColor="rgba(239, 68, 68, 0.15)"
        />
        <AnalysisCard 
          title="Medium Probability" 
          level="medium" 
          data={analysisData.mediumProbability} 
          description="Appeared in 2 out of 3 exams."
          color="#fcd34d"
          bgColor="rgba(245, 158, 11, 0.15)"
        />
        <AnalysisCard 
          title="Low Probability" 
          level="low" 
          data={analysisData.lowProbability} 
          description="Appeared only once."
          color="#6ee7b7"
          bgColor="rgba(16, 185, 129, 0.15)"
        />
      </div>
    </div>
  );
};

const AnalysisCard = ({ title, level, data, description, color, bgColor }) => (
  <div className="question-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>{title}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{description}</p>
      </div>
      <span style={{ 
        padding: '0.25rem 0.75rem', 
        borderRadius: '2rem', 
        fontSize: '0.75rem', 
        fontWeight: 600, 
        textTransform: 'uppercase',
        backgroundColor: bgColor,
        color: color
      }}>
        {level}
      </span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {data.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem' }}>
          <span style={{ fontWeight: 500, color: 'white', fontSize: '0.95rem' }}>{item.topic}</span>
          <span style={{ fontSize: '0.8rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>Unit {item.unit}</span>
        </div>
      ))}
    </div>
  </div>
);

const PaperViewer = ({ paperKey }) => {
  const paper = papers[paperKey];
  if (!paper) return null;

  const questions = parseMarkdown(paper.content);

  return (
    <div className="fade-in">
      <h1 className="page-title">{paper.title}</h1>
      <p className="page-subtitle">Click on any question below to reveal the detailed answer.</p>
      
      <div className="question-list">
        {questions.map((q, idx) => (
          <QuestionCard key={idx} data={q} />
        ))}
      </div>
    </div>
  );
};

const QuestionCard = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="question-card">
      <div className="question-header" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="q-text">{data.title}</h3>
        <ChevronDown className={`q-icon ${isOpen ? 'open' : ''}`} size={20} />
      </div>
      
      {isOpen && (
        <div className="answer-body markdown-container">
          <ReactMarkdown>{data.content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default App;
