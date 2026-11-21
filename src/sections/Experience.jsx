import { experience } from '../../data/experienceData.js';

const process = [
  ['Understand', 'Sit with the problem and the people who have it before picking any tools.'],
  ['Build', 'Ship a small version that works end to end, then grow it.'],
  ['Release', 'Put it in real hands with monitoring and a way back.'],
  ['Improve', 'Use what people actually do to decide what changes next.'],
];

export function Experience() {
  return <section id="experience" className="section">
    <div className="container exp-grid">
      <div>
        <header className="section-head section-head-stack">
          <h2>Experience</h2>
        </header>
        <ol className="timeline">
          {experience.map((item) => <li key={item.id} className="timeline-item">
            <time dateTime={item.start}>{item.period}</time>
            <div>
              <h3>{item.role}<span>{item.company}</span></h3>
              <ul>{item.highlights.map((line) => <li key={line}>{line}</li>)}</ul>
            </div>
          </li>)}
        </ol>
      </div>
      <aside className="process" aria-labelledby="process-title">
        <h3 id="process-title">How I work</h3>
        <ol>
          {process.map(([title, text]) => <li key={title}><strong>{title}</strong><span>{text}</span></li>)}
        </ol>
      </aside>
    </div>
  </section>;
}
