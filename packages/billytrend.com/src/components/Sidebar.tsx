import theme from '../theme.json';

export default function Sidebar() {
  const gravatar = theme.social?.gravatar;
  const gravatarSrc = gravatar
    ? `https://www.gravatar.com/avatar/${gravatar}?s=200`
    : '/logo.png';

  return (
    <nav className="text-sm text-sumi-muted">
      <div className="card p-6 text-center">
        <a href="/" className="block">
          <img src={gravatarSrc} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" alt="My photo" />
          <p className="text-lg font-medium text-sumi">{theme.name}</p>
          <p className="text-sm mt-1 text-sumi-muted">{theme.tagline}</p>
          <p className="mt-3">
            <a className="text-accent font-semibold hover:text-accent-light" href={`mailto:${theme.email}`}>{theme.email}</a>
          </p>
        </a>
      </div>

      <div className="mt-4">
        <a className="inline-block text-accent font-semibold hover:underline" href="/about-me.html">About Me</a>
      </div>
    </nav>
  );
}
