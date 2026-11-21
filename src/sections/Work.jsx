import { FiArrowUpRight, FiGithub } from 'react-icons/fi';
import { projects } from '../../data/projectsData.js';
import { profile } from '../../data/profileData.js';
import { trackEvent } from '../lib/track.js';

function Flow({ flow }) {
  const steps = [['In', flow.input], ['Engine', flow.engine], ['Out', flow.output]];
  return <ol className="flow" aria-label="How it works">
    {steps.map(([role, text], index) => <li key={role} className={`flow-step flow-${role.toLowerCase()}`}>
      <span className="flow-role">{role}</span>
      <span className="flow-text">{text}</span>
      {index < steps.length - 1 && <span className="flow-link" aria-hidden="true"><i /></span>}
    </li>)}
  </ol>;
}

function Project({ project }) {
  const track = (destination) => trackEvent('Project link click', { project: project.title, destination });
  return <article className="project">
    <div className="project-body">
      <p className="project-kind">{project.kind}</p>
      <h3>{project.title}</h3>
      <p className="project-summary">{project.summary}</p>
      <p className="project-desc">{project.description}</p>
      <ul className="project-tech" aria-label="Built with">
        {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
      </ul>
      <div className="project-links">
        <a href={project.liveUrl} target="_blank" rel="noreferrer" onClick={() => track('live')}>Live site<FiArrowUpRight aria-hidden="true" /></a>
        <a href={project.repoUrl} target="_blank" rel="noreferrer" onClick={() => track('github')}><FiGithub aria-hidden="true" />Source code</a>
      </div>
    </div>
    <Flow flow={project.flow} />
  </article>;
}

export function Work() {
  return <section id="work" className="section">
    <div className="container">
      <header className="section-head">
        <h2>Selected work</h2>
        <p>Four projects that show the range: an AI tool, an automation backbone, and two data-heavy web apps.</p>
      </header>
      <div className="projects">
        {projects.map((project) => <Project key={project.id} project={project} />)}
      </div>
      <a className="more-link" href={profile.githubUrl} target="_blank" rel="noreferrer">More on GitHub<FiArrowUpRight aria-hidden="true" /></a>
    </div>
  </section>;
}
