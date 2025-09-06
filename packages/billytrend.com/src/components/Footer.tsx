import theme from '../theme.json';

export default function Footer() {
  return (
    <div className="mt-6 border-t pt-6 text-center text-sm text-sumi-muted">
      <div className="max-w-2xl mx-auto">
        {theme.show_disclaimer && (
          <p className="mb-2 text-sumi-muted">
            The postings on this site are my own and don't necessarily represent my
            employer’s positions, strategies or opinions.
          </p>
        )}
        <p>© {theme.name}, {new Date().getFullYear()} — built with React + Vite</p>
      </div>
    </div>
  );
}
