const db = require('./db.js');
const { slugify } = require('./utils/slugify.js');

try {
  // 1️⃣ Fetch all pages that have a NULL or empty slug
  const pages = db
    .prepare('SELECT id, title, slug FROM pages')
    .all();

  console.log(`Found ${pages.length} pages without slugs.`);

  // 2️⃣ Update each page with a generated slug
  const update = db.prepare('UPDATE pages SET slug = ? WHERE id = ?');

  pages.forEach((page) => {
    const newSlug = slugify(page.title);
    update.run(newSlug, page.id);
    console.log(`Updated page "${page.title}" → slug: ${newSlug}`);
  });

  console.log('✅ All slugs updated successfully.');
} catch (err) {
  console.error('❌ Migration failed:', err);
}
