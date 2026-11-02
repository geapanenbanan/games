// Renders the game list and game pages from games.json.
// To add a game: add an entry to games.json. Nothing else needs to change.

async function loadGames() {
  const res = await fetch('/games.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error('games.json ' + res.status);
  return res.json();
}

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'style') Object.assign(node.style, v);
    else if (k in node) node[k] = v;
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) node.append(c);
  return node;
}

const safeColor = c => (/^#[0-9a-fA-F]{6}$/.test(c || '') ? c : '#14232E');
const safeUrl = u => (typeof u === 'string' && u.startsWith('https://') ? u : null);

function statusText(g) {
  const parts = [g.status];
  if (g.version) parts.push('v' + g.version);
  return parts.filter(Boolean).join(', ');
}

async function renderShelf() {
  const shelf = document.getElementById('shelf');
  try {
    const games = await loadGames();
    if (!games.length) {
      shelf.replaceWith(el('p', { className: 'empty', textContent: 'Inga spel här än.' }));
      return;
    }
    for (const g of games) {
      const row = el('a', { className: 'game-row', href: '/spel/' + encodeURIComponent(g.id) }, [
        el('div', {}, [el('h2', { textContent: g.title }), el('p', { textContent: g.tagline })]),
        el('span', { className: 'status', textContent: statusText(g) })
      ]);
      row.style.setProperty('--c', safeColor(g.color));
      shelf.append(el('li', {}, row));
    }
  } catch (e) {
    shelf.replaceWith(el('p', { className: 'empty', textContent: 'Spellistan gick inte att läsa in. Ladda om sidan.' }));
  }
}

async function renderGame() {
  const id = new URLSearchParams(location.search).get('id') ||
    decodeURIComponent(location.pathname.split('/').filter(Boolean).pop() || '');
  let g;
  try {
    g = (await loadGames()).find(x => x.id === id);
  } catch (e) { /* handled below */ }

  const title = document.getElementById('title');
  if (!g) {
    title.textContent = 'Spelet hittades inte';
    document.getElementById('tagline').append('Länken kan vara fel. ', el('a', { href: '/', textContent: 'Se alla spel' }), '.');
    document.querySelector('.content').hidden = true;
    return;
  }

  document.title = g.title + ' – spel av geapanenbanan';
  document.documentElement.style.setProperty('--accent', safeColor(g.color));
  title.textContent = g.title;
  document.getElementById('tagline').textContent = g.tagline;

  const actions = document.getElementById('actions');
  const download = safeUrl(g.download);
  const web = safeUrl(g.webPlay);
  if (download) actions.append(el('a', { className: 'btn', href: download, textContent: 'Ladda ner för Android' }));
  if (web) actions.append(el('a', { className: download ? 'btn ghost' : 'btn', href: web, textContent: 'Spela i webbläsaren' }));
  if (!download && !web) actions.append(el('span', { className: 'soon', textContent: 'Testversionen kommer snart' }));

  const meta = [statusText(g), (g.platforms || []).join(' och ')].filter(Boolean).join(' för ');
  document.getElementById('meta').textContent = meta;

  const desc = document.getElementById('description');
  for (const p of g.description || []) desc.append(el('p', { textContent: p }));

  const changes = document.getElementById('changes');
  for (const c of g.changes || []) changes.append(el('li', { textContent: c }));
}
