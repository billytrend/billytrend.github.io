import theme from '../theme.json';

export default function Sidebar() {
  const gravatar = theme.social?.gravatar;
  const gravatarSrc = gravatar
    ? `https://www.gravatar.com/avatar/${gravatar}?s=200`
    : '/logo.png';

  return (
    <nav className="text-sm text-gray-700">
      <a href="/" className="block text-center">
        <img src={gravatarSrc} className="w-40 h-40 rounded-full mx-auto mb-4 object-cover" alt="My photo" />
      </a>

      <div className="border-t border-b py-4 mt-4">
        <p className="text-base font-medium text-gray-900">{theme.name}</p>
        <p className="text-sm font-light mt-1">{theme.tagline}</p>
        <p className="mt-3">
          <a className="text-blue-700 font-semibold" href={`mailto:${theme.email}`}>{theme.email}</a>
        </p>
      </div>

      <div className="mt-4">
        <a className="inline-block text-blue-600 font-semibold hover:underline" href="/about-me.html">About Me</a>
      </div>
    </nav>
  );
}
