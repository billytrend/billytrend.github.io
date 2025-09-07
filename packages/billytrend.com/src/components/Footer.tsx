import theme from '../theme.json';

export default function Footer() {
  return (
    <div
      className="mt-6 border-t pt-6 text-center text-sm"
      style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
    >
      <div className="max-w-2xl mx-auto">
        {theme.show_disclaimer && (
          <p className="mb-2">
            The postings on this site are my own and don't necessarily represent my employer’s
            positions, strategies or opinions.
          </p>
        )}
        <p>
          © {theme.name}, {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
