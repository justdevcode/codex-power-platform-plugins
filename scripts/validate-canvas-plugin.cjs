// Dependency-free structural checks for this repository's Codex Canvas package.
// This is not a replacement for Codex ingestion or a full YAML/schema validator.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const repo = path.resolve(__dirname, '..');
const root = path.join(repo, 'plugins', 'canvas-apps-codex');
const read = p => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const json = p => JSON.parse(read(p));
const manifest = json(path.join(root, '.codex-plugin/plugin.json'));
const marketplace = json(path.join(repo, '.agents/plugins/marketplace.json'));
const mcp = json(path.join(root, '.mcp.json'));
const hooks = json(path.join(root, 'hooks/hooks.json'));
assert.equal(manifest.name, path.basename(root));
assert.match(manifest.name, /^[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*$/);
assert.match(marketplace.name, /^[A-Za-z0-9_-]+$/);
assert.match(manifest.version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/);
assert.equal(manifest.skills, './skills/');
assert.equal(manifest.mcpServers, './.mcp.json');
assert.equal(manifest.license, 'MIT');
assert.ok(manifest.description && manifest.author.name && manifest.interface.displayName);
assert.ok(Array.isArray(manifest.interface.capabilities));
assert.ok(manifest.interface.defaultPrompt.length);
const allowed = new Set(['id','name','version','description','skills','apps','mcpServers','interface','author','homepage','repository','license','keywords']);
for (const key of Object.keys(manifest)) assert.ok(allowed.has(key), `Unknown manifest field: ${key}`);
const entry = marketplace.plugins.find(p => p.name === manifest.name);
assert.ok(entry, 'Missing marketplace entry');
assert.equal(entry.source.path, './plugins/canvas-apps-codex');
assert.equal(entry.source.source, 'local');
assert.equal(entry.policy.installation, 'AVAILABLE');
assert.equal(entry.policy.authentication, 'ON_INSTALL');
assert.ok(entry.category);
assert.deepEqual(Object.keys(mcp), ['mcpServers'], 'Use the supported MCP manifest wrapper');
assert.deepEqual(Object.keys(mcp.mcpServers), ['canvas-authoring']);
assert.equal(mcp.mcpServers['canvas-authoring'].command, 'dnx');
assert.deepEqual(mcp.mcpServers['canvas-authoring'].args, ['Microsoft.PowerApps.CanvasAuthoring.McpServer','--yes']);
const hook = hooks.hooks.UserPromptSubmit[0].hooks[0];
assert.equal(hook.type, 'command');
assert.equal(hook.command, 'dotnet run --file "${PLUGIN_ROOT}/hooks/inject-sync-reminder.cs"');
assert.ok(fs.existsSync(path.join(root, 'hooks/inject-sync-reminder.cs')));
console.log('PASS: JSON, package identity, marketplace, wrapped MCP map and hook registration');

const expectedSkills = ['add-data-source','canvas-app','configure-canvas-mcp','report-issue'];
assert.deepEqual(fs.readdirSync(path.join(root,'skills')).sort(), expectedSkills);
// These files intentionally use only name plus plain/folded description. Reject any
// syntax outside that supported subset instead of pretending to parse general YAML.
function frontmatter(file, expected) {
  const text = read(file), match = text.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  assert.ok(match, `Unclosed frontmatter: ${file}`);
  const lines=match[1].split('\n'), fields={};
  for(let i=0;i<lines.length;i++) {
    if(!lines[i].trim()) continue;
    const field=lines[i].match(/^(name|description): (.+)$/);
    assert.ok(field, `Unsupported frontmatter syntax: ${file}: ${lines[i]}`);
    assert.ok(!(field[1] in fields), `Duplicate frontmatter field: ${file}`);
    let value=field[2];
    if(/^>[+-]?$/.test(value)) {
      const continuation=[];
      while(i+1<lines.length && /^  \S|^\s*$/.test(lines[i+1])) continuation.push(lines[++i].trim());
      value=continuation.join(' ').trim();
    } else assert.ok(!value.includes(': ') && !/^[\[\]{&*!|>'"]/.test(value), `Unsupported scalar: ${file}`);
    assert.ok(value.trim(), `Empty frontmatter value: ${file}`);
    fields[field[1]]=value;
  }
  assert.deepEqual(Object.keys(fields).sort(), ['description','name']);
  assert.equal(fields.name, expected);
  assert.match(fields.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(fields.name.length<=64 && fields.description.length<=1024);
}
for(const name of expectedSkills) frontmatter(path.join(root,'skills',name,'SKILL.md'),name);
const agents=fs.readdirSync(path.join(root,'agents')).filter(n=>n.endsWith('.md')).sort();
assert.deepEqual(agents, ['canvas-app-planner.md','canvas-create-builder.md','canvas-create-discovery.md','canvas-create-functionality.md','canvas-create-layout.md','canvas-create-screens.md','canvas-screen-builder.md']);
for(const name of agents) frontmatter(path.join(root,'agents',name),name.slice(0,-3));
console.log(`PASS: ${expectedSkills.length} skill entrypoints and ${agents.length} specialist frontmatters (restricted YAML subset)`);

function walk(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]); }
let references=0, markdown=0;
for(const file of walk(root)) {
  if(!file.endsWith('.md')) continue;
  markdown++;
  const text=read(file);
  assert.ok(!text.includes('[TODO:'), `Unfinished placeholder: ${file}`);
  for(const match of text.matchAll(/\$\{PLUGIN_ROOT\}\/([A-Za-z0-9_.\/-]+)/g)) {
    const relative=match[1],target=path.resolve(root,relative);
    assert.ok(target.startsWith(root+path.sep), `Escaping reference: ${file}: ${relative}`);
    assert.ok(fs.existsSync(target), `Missing reference: ${file}: ${relative}`);
    references++;
  }
  let fence=null;
  for(const line of text.split('\n')) {
    const m=line.match(/^\s*(`{3,}|~{3,})(.*)$/);
    if(!m) continue;
    if(!fence) fence=m[1];
    else if(m[1][0]===fence[0]&&m[1].length>=fence.length&&!m[2].trim()) fence=null;
  }
  assert.equal(fence,null,`Unclosed code fence: ${file}`);
}
assert.ok(!fs.existsSync(path.join(root,'references/PlanTemplates.md')));
const qa=read(path.join(root,'references/QAChecks.md'));
assert.deepEqual([...qa.matchAll(/^## Check (\d+) —/gm)].map(m=>Number(m[1])),Array.from({length:44},(_,i)=>i+1));
console.log(`PASS: ${references} concrete plugin references, ${markdown} Markdown fence checks, 44 ordered QA checks`);
console.log('Not checked: general YAML, Codex ingestion, hook trust, app compilation or live Studio behavior.');
