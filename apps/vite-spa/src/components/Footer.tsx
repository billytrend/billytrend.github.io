import theme from '../theme.json';

export default function Footer() {
  return (
    <div className="text-center text-sm text-gray-500 border-t pt-4 mt-6">
      {theme.show_disclaimer && (
        <p className="mb-2 text-gray-600">
          The postings on this site are my own and don't necessarily represent my
          employer’s positions, strategies or opinions.
        </p>
      )}
      <p>© {theme.name}, {new Date().getFullYear()} — built with React + Vite</p>
    </div>
  );
}
