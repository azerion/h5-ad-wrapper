const {cd, exec, echo, touch} = require('shelljs');
const {readFileSync} = require('fs');
const url = require('url');

let repoUrl;
let pkg = JSON.parse(readFileSync('package.json') as any);
if (typeof pkg.repository === 'object') {
    if (!pkg.repository.hasOwnProperty('url')) {
        throw new Error('URL does not exist in repository section');
    }
    repoUrl = pkg.repository.url;
} else {
    repoUrl = pkg.repository;
}

echo('Deploying docs!!!');
cd('docs');
touch('.nojekyll');
exec('git init');
exec('git add .');
exec('git commit -m "docs(docs): update gh-pages"');

console.log(repoUrl);

exec(
    `git push --force --quiet "${repoUrl}" master:gh-pages`
);
echo('Docs deployed!!');
