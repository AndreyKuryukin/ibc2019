const postcss = require('postcss');
const cssnano = require('cssnano');

const plugins = [
    cssnano({ preset: 'default', })
];

const fs = require('fs');

fs.readFile('./build/_styles.css', (err, css) => {
    postcss(plugins)
        .process(css, {
            from: './build/_styles.css',
            to: './build/styles.css'
        })
        .then(result => {
            fs.writeFile('./build/styles.css', result.css);
            if ( result.map ) fs.writeFile('./build/styles.css.map', result.map);
        });
});