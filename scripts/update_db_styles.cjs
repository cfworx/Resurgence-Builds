const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/pages/database');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.astro'));

const newStyle = `<style>
  .db-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--sp-6);
  }

  @media (min-width: 768px) {
    .db-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .db-grid {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }
  }

  .db-card {
    background: rgba(20, 20, 25, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: var(--border-radius);
    padding: var(--sp-5);
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .db-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .db-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.4), 0 0 20px rgba(255, 109, 16, 0.15);
    border-color: rgba(255, 109, 16, 0.3);
  }

  .db-card:hover::before {
    opacity: 1;
  }

  .db-card__header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: var(--sp-3);
    margin-bottom: var(--sp-2);
  }

  .db-card__title {
    font-size: var(--text-xl);
    font-weight: 800;
    margin: 0;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    letter-spacing: 0.02em;
  }

  .db-card__body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: var(--sp-4);
  }

  /* Specific styles for lists, grids, and labels */
  .attribute-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }

  .attribute-list li {
    font-size: var(--text-md);
    color: var(--ink-light);
    padding: var(--sp-2) var(--sp-3);
    background: rgba(0,0,0,0.2);
    border-radius: var(--border-radius);
    border: 1px solid rgba(255,255,255,0.02);
    transition: background 0.2s ease;
  }
  
  .attribute-list li:hover {
    background: rgba(255, 109, 16, 0.05);
  }

  .talent-desc p, .effect-desc p {
    font-size: var(--text-md);
    line-height: 1.6;
    margin: 0;
    color: var(--ink-light);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--sp-3);
    background: rgba(0,0,0,0.2);
    padding: var(--sp-4);
    border-radius: var(--border-radius);
    border: 1px solid rgba(255,255,255,0.02);
  }
  
  @media (min-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .stat-item {
    display: flex;
    flex-direction: column;
  }

  .stat-label {
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--ink-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-value {
    font-size: var(--text-md);
    font-weight: 700;
    color: #fff;
  }

  .talent-section {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, transparent 100%);
    border-left: 3px solid var(--danger);
    padding: var(--sp-4);
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
  }

  .talent-name {
    font-size: var(--text-lg);
    font-weight: 700;
    color: var(--danger);
    margin: 0 0 var(--sp-2) 0;
  }

  .source-section {
    margin-top: auto;
    background: rgba(255, 255, 255, 0.02);
    padding: var(--sp-3) var(--sp-4);
    border-radius: var(--border-radius);
    border-left: 3px solid var(--accent);
  }
  
  .source-label {
    font-size: var(--text-xs);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent);
  }
</style>`;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace everything from <style> to </style>
  const styleRegex = /<style>[\s\S]*?<\/style>/;
  if (styleRegex.test(content)) {
    content = content.replace(styleRegex, newStyle);
  } else {
    content += '\n' + newStyle;
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Updated ' + file);
});
