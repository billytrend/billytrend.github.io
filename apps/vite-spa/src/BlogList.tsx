import { useState, useEffect, Suspense } from 'react';

// Import all MDX files in the posts directory
const postModules = import.meta.glob('./posts/*.mdx');

function BlogList() {
  const [posts, setPosts] = useState<any[]>([]);

  // Load all posts on mount
  useEffect(() => {
    Promise.all(
      Object.entries(postModules).map(async ([path, loader]) => {
        const mod: any = await loader();
        return {
          path,
          meta: mod.frontmatter || mod.meta || {},
          Content: mod.default,
        };
      })
    ).then(setPosts);
  }, []);

  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map(({ path, meta, Content }) => (
          <li key={path} style={{ marginBottom: 32 }}>
            <h2>{meta.title}</h2>
            <p><em>{meta.date}</em></p>
            <Suspense fallback={<div>Loading...</div>}>
              <Content />
            </Suspense>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BlogList;
