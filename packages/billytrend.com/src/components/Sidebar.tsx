import { Link, useLocation } from 'react-router-dom';
import { memo } from 'react';
import theme from '../theme.json';

function Sidebar() {
  const location = useLocation();
  const gravatar = theme.social?.gravatar;
  const gravatarSrc = gravatar ? `https://www.gravatar.com/avatar/${gravatar}?s=200` : '/logo.png';
  const isHome = location.pathname === '/';

  return (
    <nav className="text-sm" aria-label="Sidebar">
      <div className="card p-6 text-center">
        <Link
          to="/"
          aria-current={isHome ? 'page' : undefined}
          className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        >
          <img
            src={gravatarSrc}
            width={128}
            height={128}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-32 h-32 mx-auto mb-4 object-cover border"
            style={{ borderColor: 'var(--line)' }}
            alt={`${theme.name} photo`}
          />
          <p className="text-base tracking-wide" style={{ color: 'var(--text)' }}>
            {theme.name}
          </p>
        </Link>
        <p className="mt-4">
          <a
            className="font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            href={`mailto:${theme.email}`}
          >
            {theme.email}
          </a>
        </p>
      </div>
    </nav>
  );
}

export default memo(Sidebar);
