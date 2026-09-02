// Lit les produits depuis Airtable et les renvoie au site.
// Le jeton Airtable reste côté serveur (variable d'environnement Netlify),
// il n'est jamais exposé dans le navigateur.

exports.handler = async () => {
  const token = process.env.AIRTABLE_TOKEN;
  const base = process.env.AIRTABLE_BASE_ID;
  const table = encodeURIComponent(process.env.AIRTABLE_TABLE || 'Produits');

  const headers = {
    'Content-Type': 'application/json',
    // cache court : les URLs d'images Airtable sont temporaires (~2 h),
    // on garde le cache faible pour toujours servir des liens valides.
    'Cache-Control': 'public, max-age=120',
  };

  // Pas encore configuré : on renvoie une liste vide (le site garde ses produits existants).
  if (!token || !base) {
    return { statusCode: 200, headers, body: JSON.stringify({ products: [] }) };
  }

  const mapCategory = (c) => {
    const s = (c || '').toString().toLowerCase();
    if (s.includes('bonsa')) return 'bonsai';
    if (s.includes('compos')) return 'composition';
    return 'accessoire';
  };

  try {
    const url = `https://api.airtable.com/v0/${base}/${table}?pageSize=100`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Airtable a répondu ' + res.status);
    const data = await res.json();

    const products = (data.records || [])
      .map((r) => {
        const f = r.fields || {};
        const online = f['En ligne'];
        if (online === false) return null;            // décoché = masqué
        if (!f['Nom']) return null;                    // pas de nom = ignoré
        const photos = Array.isArray(f['Photos'])
          ? f['Photos'].map((p) => p.url).filter(Boolean)
          : [];
        const tags = (f['Tags'] || '')
          .toString()
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
        return {
          id: r.id,
          name: f['Nom'],
          species: f['Catégorie'] || 'Création',
          category: mapCategory(f['Catégorie']),
          age: f['Caractéristiques'] || '',
          price: Number(f['Prix']) || 0,
          tag: 'Nouveau',
          tags,
          img: photos[0] || '',
          imgs: photos,
          desc: f['Description'] || '',
          ordre: f['Ordre'] != null ? Number(f['Ordre']) : 999,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.ordre - b.ordre);

    return { statusCode: 200, headers, body: JSON.stringify({ products }) };
  } catch (e) {
    // En cas d'erreur, on renvoie une liste vide plutôt que de casser la boutique.
    return { statusCode: 200, headers, body: JSON.stringify({ products: [], error: String(e) }) };
  }
};
