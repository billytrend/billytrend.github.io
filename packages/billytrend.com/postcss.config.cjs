const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
    // Minify CSS in production, including imported vendor CSS
    ...(isProd ? [require('cssnano')({ preset: 'default' })] : []),
  ],
};
