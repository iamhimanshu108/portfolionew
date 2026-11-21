import { FiBox, FiCpu, FiGitBranch, FiShare2, FiZap } from 'react-icons/fi';
import { SiDocker, SiFastapi, SiGit, SiJavascript, SiLinux, SiMongodb, SiMysql, SiNextdotjs, SiNodedotjs, SiPostgresql, SiPython, SiReact, SiTailwindcss, SiTypescript } from 'react-icons/si';
import { aboutContent } from '../../data/aboutData.js';
import { profile } from '../../data/profileData.js';

import photo from '../../data/photo-320.webp';

const stack = [
  { group: 'Frontend', items: [['React', SiReact], ['Next.js', SiNextdotjs], ['TypeScript', SiTypescript], ['JavaScript', SiJavascript], ['Tailwind CSS', SiTailwindcss]] },
  { group: 'Backend', items: [['Node.js', SiNodedotjs], ['Python', SiPython], ['FastAPI', SiFastapi], ['REST APIs', FiShare2]] },
  { group: 'AI', items: [['LLM apps', FiCpu], ['RAG', FiBox], ['Agent workflows', FiZap]] },
  { group: 'Data', items: [['PostgreSQL', SiPostgresql], ['MongoDB', SiMongodb], ['MySQL', SiMysql]] },
  { group: 'Ops', items: [['Docker', SiDocker], ['Git', SiGit], ['CI/CD', FiGitBranch], ['Linux', SiLinux], ['n8n', FiZap]] },
];

export function About() {
  return <section id="about" className="section section-alt">
    <div className="container about-grid">
      <div className="about-intro">
        <img className="about-photo" src={photo} alt="Portrait of Himanshu Yadav" width="132" height="132" loading="lazy" decoding="async" />
        <div>
          <h2>About me</h2>
          <p className="about-lede">{aboutContent.workSummary}</p>
          <p>{aboutContent.closing} Based in {profile.location}, working with teams anywhere.</p>
        </div>
      </div>
      <div id="stack" className="stack">
        <h3>What I work with</h3>
        <dl>
          {stack.map(({ group, items }) => <div key={group} className="stack-row">
            <dt>{group}</dt>
            <dd><ul>{items.map(([name, Icon]) => <li key={name}><Icon aria-hidden="true" />{name}</li>)}</ul></dd>
          </div>)}
        </dl>
      </div>
    </div>
  </section>;
}
