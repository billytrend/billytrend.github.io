import React, { Suspense, useEffect, useState } from 'react';
import 'github-markdown-css/github-markdown-light.css';
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
    <article className="post-container">
      <p className="meta">{post.meta.date} &nbsp; <Link to="/" className="text-blue-600 hover:underline">Home</Link></p>
      <h1 className="title mt-2">{post.meta.title}</h1>
      <div id="post" className="mt-4 markdown-body prose prose-sm sm:prose lg:prose-lg">
        <Suspense fallback={<div>Loading post…</div>}>
          <Content />
        </Suspense>
      </div>
    </article>
  );
}
