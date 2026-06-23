const fs = require('fs');
const path = require('path');

const files = [
  'd:\\try_2\\src\\data\\stitch\\dashboard.html',
  'd:\\try_2\\src\\data\\stitch\\logs.html',
  'd:\\try_2\\src\\data\\stitch\\workflow.html',
  'd:\\try_2\\src\\data\\stitch\\agents.html',
  'd:\\try_2\\src\\data\\stitch\\main.html'
];

const replacements = [
  [/#0b1326/g, '#0a0a0a'],
  [/#c0c1ff/g, '#ff3d00'],
  [/text-indigo-100 dark:text-\[#c0c1ff\]/g, 'text-[#ff3d00]'],
  [/text-indigo-400 dark:text-\[#c0c1ff\]/g, 'text-[#ff3d00]'],
  [/bg-indigo-500\/10/g, 'bg-[#ff3d00]/10'],
  [/border-indigo-400/g, 'border-[#ff3d00]'],
  [/text-slate-400 dark:text-\[#c7c4d7\]/g, 'text-[#737373]'],
  [/hover:text-indigo-300/g, 'hover:text-[#fafafa]'],
  [/hover:bg-slate-800\/50 dark:hover:bg-\[#131b2e\]/g, 'hover:bg-[#1a1a1a]'],
  [/bg-slate-900/g, 'bg-[#0a0a0a]'],
  [/dark:bg-\[#0b1326\]/g, 'bg-[#0a0a0a]'],
  [/border-slate-800/g, 'border-[#262626]'],
  [/dark:border-none/g, 'border-[#262626]']
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  replacements.forEach(([pattern, replacement]) => {
    content = content.replace(pattern, replacement);
  });
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${path.basename(file)}`);
});

console.log('All files updated!');
