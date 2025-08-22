import theme from '../theme.json';

export default function Sidebar() {
  const gravatar = theme.social?.gravatar;
  const gravatarSrc = gravatar
    ? `https://www.gravatar.com/avatar/${gravatar}?s=200`
    : '/logo.png';

  return (
    <nav className="text-sm text-gray-700">
      <a href="/" className="block text-center">
        <img src={gravatarSrc} className="w-44 h-44 rounded-full mx-auto mb-4" alt="My photo" />
      </a>

      <div className="border-t border-b py-4">
        <p className="text-base font-light">{theme.tagline}</p>
        <p className="mt-3">
          <a className="text-blue-700 font-semibold" href={`mailto:${theme.email}`}>{theme.email}</a>
        </p>
      </div>

      <a className="inline-block mt-4 text-blue-600 font-semibold" href="/about-me.html">About Me</a>
    </nav>
  );
}
