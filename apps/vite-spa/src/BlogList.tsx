import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import all MDX files in the posts directory
const postModules = import.meta.glob('./posts/*.mdx');
const rawModules = import.meta.glob('./posts/*.mdx', { as: 'raw' });

function BlogList() {
  const [posts, setPosts] = useState<any[]>([]);

  // Load all posts on mount
  useEffect(() => {
    Promise.all(
      Object.entries(postModules).map(async ([path, loader]) => {
        const mod: any = await loader();
        let meta = mod.frontmatter || mod.meta || {};
        // try to parse raw frontmatter if title is missing
        if ((!meta || !meta.title) && rawModules[path]) {
          try {
            const raw: string = await (rawModules as any)[path]();
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
          } catch (e) {
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
      <h2 className="title">▮ Blog Posts</h2>
      <div className="mt-4 grid gap-4">
        {sorted.map(({ path, meta }) => (
          <article key={path} className="bg-gray-50 rounded-md p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  <Link to={`/article/${slugFromPath(path)}`} className="hover:text-blue-600">{meta.title}</Link>
                </h3>
                <p className="meta">{meta.date}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default BlogList;
