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
    <div>
      <h2 style={{ color: '#236080' }}>▮ Blog Posts</h2>
      <ul className="posts">
        {sorted.map(({ path, meta }) => (
          <li key={path}>
            <span>{meta.date}</span>
            <Link to={`/post/${slugFromPath(path)}`}>{meta.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BlogList;
