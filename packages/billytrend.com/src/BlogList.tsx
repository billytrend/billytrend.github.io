import { useState, useEffect, type ComponentType } from 'react';
import { Link } from 'react-router-dom';

// Import all MDX files in the posts directory
type Frontmatter = { title?: string; date?: string; [key: string]: unknown };
type MdxModule = { default: ComponentType; frontmatter?: Frontmatter; meta?: Frontmatter };
type PostEntry = { path: string; meta: Frontmatter; Content: ComponentType };

const postModules = import.meta.glob<MdxModule>('./posts/*.mdx');
const rawModules = import.meta.glob<string>('./posts/*.mdx', {
  query: '?raw',
  import: 'default',
});

function BlogList() {
  const [posts, setPosts] = useState<PostEntry[]>([]);

  // Load all posts on mount
  useEffect(() => {
    Promise.all(
      Object.entries(postModules).map(async ([path, loader]) => {
        const mod = await (loader as () => Promise<MdxModule>)();
        const meta: Frontmatter = mod.frontmatter ?? mod.meta ?? {};
        // try to parse raw frontmatter if title is missing
        if ((!meta || !meta.title) && rawModules[path]) {
          try {
            const raw: string = await rawModules[path]();
            const fmMatch = raw.match(/^-{3}[\s\S]*?-{3}/);
            if (fmMatch) {
              const fm = fmMatch[0].replace(/^-{3}|-{3}$/g, '').trim();
              fm.split(/\n/).forEach((line) => {
                const [k, ...rest] = line.split(':');
                if (!k) return;
                const key = k.trim();
                const val = rest.join(':').trim();
                if (key === 'title') meta.title = val.replace(/^\s+|\s+$/g, '');
                if (key === 'date') meta.date = val;
              });
            }
          } catch {
            // ignore
          }
        }

        return {
          path,
          meta,
          Content: mod.default,
        };
      }),
    ).then(setPosts);
  }, []);

  // sort posts by date desc if date exists
  const sorted = posts.slice().sort((a, b) => {
    const da = a.meta.date ? new Date(a.meta.date).getTime() : 0;
    const db = b.meta.date ? new Date(b.meta.date).getTime() : 0;
    return db - da;
  });

  // helper: build slug from filename
  const slugFromPath = (p: string) =>
    p
      .split('/')
      .pop()!
      .replace(/\.mdx?$/, '');
  console.debug(
    '[BlogList] posts:',
    posts.map((p) => ({ path: p.path, slug: slugFromPath(p.path) })),
  );

  return (
    <div className="post-container">
      <div className="grid gap-2">
        {sorted.map(({ path, meta }) => (
          <article
            key={path}
            className="p-4 border group transition-colors focus-within:ring-2 focus-within:ring-[var(--accent)]"
            style={{
              backgroundColor: 'var(--card)',
              color: 'var(--text)',
              borderColor: 'var(--line)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className="text-lg font-semibold tracking-tight"
                  style={{ color: 'var(--text)' }}
                >
                  <Link
                    to={`/article/${slugFromPath(path)}`}
                    className="relative inline-block focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                    style={{
                      color: 'var(--text)',
                    }}
                  >
                    <span className="inline-block border-b border-transparent group-hover:border-[var(--accent)] transition-colors duration-200">
                      {meta.title}
                    </span>
                  </Link>
                </h3>
                <p className="meta" style={{ color: 'var(--muted)' }}>
                  {meta.date}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default BlogList;
