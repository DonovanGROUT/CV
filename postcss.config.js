const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [
    './index.html',                  // Fichiers HTML à analyser
    './remerciement-formulaire.html', // Autres fichiers HTML à analyser
    './js/scripts.js',               // Fichiers JavaScript à analyser
  ],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
});

module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default',
    }),
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : [])
  ]
};
