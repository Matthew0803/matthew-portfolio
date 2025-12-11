# Database Usage Examples

## Using the Custom Hooks

I've created React Query hooks in `client/src/hooks/usePortfolio.ts` to easily fetch data from your database.

### Example 1: Display All Projects

```tsx
import { useProjects } from "@/hooks/usePortfolio";

export function ProjectsSection() {
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects?.map((project) => (
        <div key={project.id} className="border rounded-lg p-6">
          <h3 className="text-xl font-bold">{project.title}</h3>
          <p className="text-gray-600 mt-2">{project.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {project.technologies.map((tech) => (
              <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {tech}
              </span>
            ))}
          </div>
          
          <div className="flex gap-4 mt-4">
            {project.githubUrl && (
              <a href={project.githubUrl} className="text-blue-600 hover:underline">
                GitHub
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} className="text-blue-600 hover:underline">
                Live Demo
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Display Work Experience

```tsx
import { useExperience } from "@/hooks/usePortfolio";

export function ExperienceSection() {
  const { data: experience, isLoading } = useExperience();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      {experience?.map((exp) => (
        <div key={exp.id} className="border-l-4 border-blue-500 pl-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold">{exp.position}</h3>
              <p className="text-lg text-gray-700">{exp.company}</p>
              <p className="text-sm text-gray-500">{exp.location}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {exp.startDate} - {exp.current ? "Present" : exp.endDate}
              </p>
              {exp.current && (
                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded mt-1">
                  Current
                </span>
              )}
            </div>
          </div>

          <p className="mt-4 text-gray-600">{exp.description}</p>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Key Responsibilities:</h4>
            <ul className="list-disc list-inside space-y-1">
              {exp.responsibilities.map((resp, idx) => (
                <li key={idx} className="text-gray-600">{resp}</li>
              ))}
            </ul>
          </div>

          {exp.achievements.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Achievements:</h4>
              <ul className="list-disc list-inside space-y-1">
                {exp.achievements.map((achievement, idx) => (
                  <li key={idx} className="text-gray-600">{achievement}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {exp.technologies.map((tech) => (
              <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Display Skills by Category

```tsx
import { useSkills } from "@/hooks/usePortfolio";

export function SkillsSection() {
  const { data: skillsByCategory, isLoading } = useSkills();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      {Object.entries(skillsByCategory || {}).map(([category, skills]) => (
        <div key={category}>
          <h3 className="text-xl font-bold mb-4">{category}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{skill.name}</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-2 rounded-full ${
                          i < skill.proficiency ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Example 4: Load All Data at Once (Recommended)

For better performance, load all portfolio data in one request:

```tsx
import { usePortfolio } from "@/hooks/usePortfolio";

export function PortfolioPage() {
  const { data, isLoading, error } = usePortfolio();

  if (isLoading) return <div>Loading portfolio...</div>;
  if (error) return <div>Error loading portfolio</div>;

  return (
    <div className="space-y-16">
      {/* Projects Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Experience</h2>
        {data?.experience.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </section>

      {/* Skills Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Skills</h2>
        {Object.entries(data?.skills || {}).map(([category, skills]) => (
          <SkillCategory key={category} category={category} skills={skills} />
        ))}
      </section>

      {/* Education Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Education</h2>
        {data?.education.map((edu) => (
          <EducationCard key={edu.id} education={edu} />
        ))}
      </section>

      {/* Certifications Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.certifications.map((cert) => (
            <CertificationCard key={cert.id} certification={cert} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

## API Endpoints Reference

All endpoints return JSON data:

- `GET /api/portfolio` - All data in one request
- `GET /api/projects` - All projects
- `GET /api/projects/:id` - Single project
- `GET /api/experience` - All work experience
- `GET /api/skills` - All skills (grouped by category)
- `GET /api/education` - All education
- `GET /api/certifications` - All certifications

## TypeScript Types

All types are exported from `client/src/hooks/usePortfolio.ts`:

```tsx
import type { 
  Project, 
  Experience, 
  Skill, 
  Education, 
  Certification,
  PortfolioData 
} from "@/hooks/usePortfolio";
```
