import * as assert from 'assert';
import { TreeParser } from '../parser';

const parser = new TreeParser();

const tree = parser.parse([
  'project/',
  '  src/',
  '    index.ts',
  '  README.md',
].join('\n'));

assert.strictEqual(tree.length, 1);
assert.strictEqual(tree[0].name, 'project');
assert.strictEqual(tree[0].isFile, false);
assert.strictEqual(tree[0].children[0].name, 'src');
assert.strictEqual(tree[0].children[0].children[0].isFile, true);
assert.deepStrictEqual(
  parser.toPaths(tree).map((entry) => entry.path.replace(/\\/g, '/')),
  ['project', 'project/src', 'project/src/index.ts', 'project/README.md']
);

console.log('TreeParser tests passed.');
