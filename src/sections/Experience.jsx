import { experience } from '../../data/experienceData.js';

const process = [
  ['Understand', 'The problem before the tools.'],
  ['Build', 'A small version that works end to end.'],
  ['Release', 'Real users, with monitoring.'],
  ['Improve', 'Based on what people actually do.'],
];

export function Experience() {
  return <section id="experience" className="section">
    <div className="container exp-grid">
      <div>
        <header className="section-head section-head-stack">
          <h2>Experience</h2>
        </header>
        <ol className="timeline" data-reveal>
          {experience.map((item, i) => <li key={item.id} className="timeline-item" style={{ '--i': i }}>
            <time dateTime={item.start}>{item.period}</time>
            <div>
              <h3>{item.role}<span>{item.company}</span></h3>
              <ul>{item.highlights.map((line) => <li key={line}>{line}</li>)}</ul>
            </div>
          </li>)}
        </ol>
      </div>
      <aside className="process" aria-labelledby="process-title" data-reveal>
        <h3 id="process-title">How I work</h3>
        <ol>
          {process.map(([title, text]) => <li key={title}><strong>{title}</strong><span>{text}</span></li>)}
        </ol>
      </aside>
    </div>
  </section>;
}
