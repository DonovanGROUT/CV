const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [
    './index.html',                   // Fichiers HTML à analyser
    './remerciement-formulaire.html', // Autres fichiers HTML à analyser
    './js/scripts-critical.js',       // Fichier JavaScript critique à analyser
    './js/scripts-non-critical.js',   // Fichier JavaScript non critique à analyser
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
