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
  const [showOlder, setShowOlder] = useState(false);

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

  // helpers
  const slugFromPath = (p: string) =>
    p
      .split('/')
      .pop()!
      .replace(/\.mdx?$/, '');

  const timeFrom = (entry: PostEntry): number => {
    // prefer frontmatter date
    if (entry.meta?.date) {
      const t = new Date(entry.meta.date).getTime();
      if (!Number.isNaN(t)) return t;
    }
    // fallback: parse from slug YYYY-M-D-...
    const slug = slugFromPath(entry.path);
    const m = slug.match(/^(\d{4}-\d{1,2}-\d{1,2})-/);
    if (m) {
      const t = new Date(m[1]).getTime();
      if (!Number.isNaN(t)) return t;
    }
    return 0; // treat undated as oldest
  };

  // sort posts by date desc
  const sorted = posts.slice().sort((a, b) => timeFrom(b) - timeFrom(a));

  // split into last 10 years vs older
  const now = new Date();
  const cutoff = new Date(now); // 10-year cutoff from today
  cutoff.setFullYear(now.getFullYear() - 10);
  const cutoffMs = cutoff.getTime();
  const recent = sorted.filter((p) => timeFrom(p) >= cutoffMs);
  const older = sorted.filter((p) => timeFrom(p) < cutoffMs);

  console.debug(
    '[BlogList] posts:',
    posts.map((p) => ({ path: p.path, slug: slugFromPath(p.path) })),
  );

  return (
    <div className="post-container">
      <div className="grid gap-2">
        {recent.length === 0 && (
          <div
            className="p-4 border text-sm"
            style={{
              backgroundColor: 'var(--card)',
              color: 'var(--muted)',
              borderColor: 'var(--line)',
            }}
          >
            No posts from the last 10 years.
          </div>
        )}

        {recent.map(({ path, meta }) => (
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
                    to={`/articles/${slugFromPath(path)}`}
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

        {older.length > 0 && !showOlder && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowOlder(true)}
              className="px-4 py-2 border font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              style={{
                backgroundColor: 'var(--card)',
                color: 'var(--text)',
                borderColor: 'var(--line)',
              }}
              aria-expanded={false}
            >
              Show older posts ({older.length})
            </button>
          </div>
        )}

        {older.length > 0 && showOlder && (
          <div className="mt-6 grid gap-2" aria-live="polite">
            {older.map(({ path, meta }) => (
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
                        to={`/articles/${slugFromPath(path)}`}
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
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowOlder(false)}
                className="px-3 py-1 text-sm underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                style={{ color: 'var(--text)' }}
                aria-expanded={true}
              >
                Hide older posts
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogList;
