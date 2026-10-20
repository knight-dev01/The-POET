import { Link, useParams, Navigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SEO from '../components/SEO'
import { getProject } from '../lib/content'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProject(slug)
  if (!project) return <Navigate to="/projects" replace />

  return (
    <>
      <SEO
        title={project.title}
        description={project.description}
        path={`/projects/${project.slug}`}
        keywords={project.keywords}
      />
      <article className="section article" style={{ borderTop: 'none' }}>
        <p className="mono section-tag">
          <Link to="/projects">← Projects</Link>
        </p>
        <h1 className="article-title">{project.title}</h1>
        {project.stack?.length > 0 && <p className="mono meta-line">{project.stack.join(' · ')}</p>}
        <p className="card-links">
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noreferrer">
              GitHub →
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer">
              Live →
            </a>
          )}
        </p>
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.body}</ReactMarkdown>
        </div>
      </article>
    </>
  )
}
