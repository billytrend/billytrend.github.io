// React default import not required with automatic JSX runtime; keep hooks below
import { Suspense, useEffect, useState, type ComponentType } from 'react';
import 'github-markdown-css/github-markdown-light.css';
import { useParams, Link } from 'react-router-dom';

type Frontmatter = { title?: string; date?: string; [key: string]: unknown };
type MdxModule = { default: ComponentType; frontmatter?: Frontmatter; meta?: Frontmatter };
const postModules = import.meta.glob<MdxModule>('../posts/*.mdx');

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<{ meta: Frontmatter; Content: ComponentType } | null>(null);

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
    postModules[matchKey]().then((mod) => {
      setPost({ meta: mod.frontmatter ?? mod.meta ?? {}, Content: mod.default });
    });
  }, [slug]);

  if (!post) return <div>Loading post…</div>;

  const Content = post.Content;

  return (
    <article className="post-container" style={{ color: 'var(--text)' }}>
      <p className="meta" style={{ color: 'var(--muted)' }}>{post.meta.date} &nbsp; <Link to="/" className="hover:underline" style={{ color: 'var(--accent)' }}>Home</Link></p>
      <h1 className="title mt-2 relative" style={{ color: 'var(--text)' }}>
        <span className="relative z-10">{post.meta.title}</span>
        <span className="absolute inset-x-0 -bottom-1 h-2 bg-gradient-to-r from-[var(--accent)]/0 via-[var(--accent)]/20 to-[var(--accent)]/0 pointer-events-none" />
      </h1>
      <div id="post" className="mt-4 markdown-body prose prose-sm sm:prose lg:prose-lg" style={{ color: 'var(--muted)' }}>
        <Suspense fallback={<div>Loading post…</div>}>
          <Content />
        </Suspense>
      </div>
    </article>
  );
}
