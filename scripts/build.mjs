import { mkdir, cp, rm } from 'node:fs/promises';
await rm('dist', {recursive: true, force: true});
await mkdir('dist');
for (const name of ['index.html', 'style.css', 'app.js', 'model.js', 'scene.js', 'walk.js', 'walk-physics.js', 'data']) await cp(name, `dist/${name}`, {recursive: true});
console.log('Static site built in dist/');
