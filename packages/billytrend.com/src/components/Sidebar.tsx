import theme from '../theme.json';

export default function Sidebar() {
  const gravatar = theme.social?.gravatar;
  const gravatarSrc = gravatar
    ? `https://www.gravatar.com/avatar/${gravatar}?s=200`
    : '/logo.png';

  return (
    <nav className="text-sm" aria-label="Sidebar">
      <div className="card p-6 text-center">
        <a href="/" className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]">
          <img src={gravatarSrc} className="w-32 h-32 mx-auto mb-4 object-cover border" style={{ borderColor: 'var(--line)' }} alt={`${theme.name} photo`} />
          <p className="text-base tracking-wide" style={{ color: 'var(--text)' }}>{theme.name}</p>
        </a>
        <p className="mt-4">
          <a className="font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]" href={`mailto:${theme.email}`}>{theme.email}</a>
        </p>
      </div>
    </nav>
  );
}
