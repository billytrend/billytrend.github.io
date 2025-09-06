import { useState, useEffect, type ComponentType } from 'react';
import { Link } from 'react-router-dom';

// Import all MDX files in the posts directory
type Frontmatter = { title?: string; date?: string; [key: string]: unknown };
type MdxModule = { default: ComponentType; frontmatter?: Frontmatter; meta?: Frontmatter };
type PostEntry = { path: string; meta: Frontmatter; Content: ComponentType };

const postModules = import.meta.glob<MdxModule>('./posts/*.mdx');
const rawModules = import.meta.glob<string>('./posts/*.mdx', { as: 'raw' });

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
      })
    ).then(setPosts);
  }, []);

  // sort posts by date desc if date exists
  const sorted = posts.slice().sort((a, b) => {
    const da = a.meta.date ? new Date(a.meta.date).getTime() : 0;
    const db = b.meta.date ? new Date(b.meta.date).getTime() : 0;
    return db - da;
  });

  // helper: build slug from filename
  const slugFromPath = (p: string) => p.split('/').pop()!.replace(/\.mdx?$/, '');
  console.debug('[BlogList] posts:', posts.map((p) => ({ path: p.path, slug: slugFromPath(p.path) })));

  return (
    <div className="post-container">
  <h2 className="title" style={{ color: 'var(--text)' }}>▮ Blog Posts</h2>
      <div className="mt-4 grid gap-4">
        {sorted.map(({ path, meta }) => (
          <article
            key={path}
            className="rounded-md p-4 border shadow-sm group transition-colors hover:shadow md:hover:shadow-md"
            style={{
              backgroundColor: 'var(--card)',
              color: 'var(--text)',
              borderColor: 'rgba(0,0,0,0.07)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                  <Link
                    to={`/article/${slugFromPath(path)}`}
                    className="relative inline-block focus:outline-none"
                    style={{
                      color: 'var(--text)',
                    }}
                  >
                    <span className="bg-gradient-to-r from-[var(--accent)]/0 via-[var(--accent)]/10 to-[var(--accent)]/0 bg-[length:0%_2px] bg-no-repeat bg-left-bottom group-hover:bg-[length:100%_2px] transition-[background-size] duration-500">
                      {meta.title}
                    </span>
                  </Link>
                </h3>
                <p className="meta" style={{ color: 'var(--muted)' }}>{meta.date}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default BlogList;
