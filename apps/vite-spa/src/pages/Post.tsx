import React, { Suspense, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const postModules = import.meta.glob('../posts/*.mdx');

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    const keys = Object.keys(postModules);
    console.debug('[Post] slug:', slug, 'available keys:', keys);
    const filenameFromKey = (k: string) => k.split('/').pop()!.replace(/\.mdx?$/, '');
    const matchKey = keys.find((k) => filenameFromKey(k) === slug);
    if (!matchKey) {
      console.warn('[Post] no match for slug', slug);
      return;
    }
    (postModules as any)[matchKey]().then((mod: any) => {
      setPost({ meta: mod.frontmatter || mod.meta || {}, Content: mod.default });
    });
  }, [slug]);

  if (!post) return <div>Loading post…</div>;

  const Content = post.Content;

  return (
    <article>
      <p className="meta">{post.meta.date} &nbsp; <Link to="/">Home</Link></p>
      <h1 className="title">{post.meta.title}</h1>
      <div id="post">
        <Suspense fallback={<div>Loading post…</div>}>
          <Content />
        </Suspense>
      </div>
    </article>
  );
}
