import express from 'express'
import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, '../public/db/cv.sqlite')

const app = express()
app.use(express.json())
app.use(express.static(__dirname))

const db = () => new Database(DB_PATH)

// ── HEADER ───────────────────────────────────────────────────────────────────
app.get('/api/header', (req, res) => {
  const d = db()
  const row = d.prepare(`
    SELECT sv.name AS name_sv, sv.role AS role_sv, sv.summary AS summary_sv,
           en.name AS name_en, en.role AS role_en, en.summary AS summary_en
    FROM header h
    LEFT JOIN header_translations sv ON sv.header_id = h.id AND sv.language = 'sv'
    LEFT JOIN header_translations en ON en.header_id = h.id AND en.language = 'en'
    WHERE h.id = 1
  `).get()
  d.close(); res.json(row)
})

app.put('/api/header', (req, res) => {
  const { name_sv, role_sv, summary_sv, name_en, role_en, summary_en } = req.body
  const d = db()
  try {
    d.transaction(() => {
      d.prepare(`UPDATE header_translations SET name=?,role=?,summary=? WHERE header_id=1 AND language='sv'`).run(name_sv, role_sv, summary_sv)
      d.prepare(`UPDATE header_translations SET name=?,role=?,summary=? WHERE header_id=1 AND language='en'`).run(name_en, role_en, summary_en)
    })()
    res.json({ message: 'Sparad' })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

// ── SOCIAL LINKS ─────────────────────────────────────────────────────────────
app.get('/api/social-links', (req, res) => {
  const d = db()
  res.json(d.prepare(`SELECT id, icon, url FROM social_links WHERE header_id=1 ORDER BY id`).all())
  d.close()
})

app.post('/api/social-links', (req, res) => {
  const { icon, url } = req.body
  const d = db()
  try {
    const { lastInsertRowid } = d.prepare(`INSERT INTO social_links (header_id, icon, url) VALUES (1,?,?)`).run(icon, url)
    res.json({ id: Number(lastInsertRowid) })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

app.put('/api/social-links/:id', (req, res) => {
  const { icon, url } = req.body
  const d = db()
  try {
    d.prepare(`UPDATE social_links SET icon=?,url=? WHERE id=?`).run(icon, url, req.params.id)
    res.json({ message: 'Sparad' })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

app.delete('/api/social-links/:id', (req, res) => {
  const d = db()
  try {
    d.prepare(`DELETE FROM social_links WHERE id=?`).run(req.params.id)
    res.json({ message: 'Borttagen' })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

// ── INFO ──────────────────────────────────────────────────────────────────────
app.get('/api/info', (req, res) => {
  const d = db()
  const row = d.prepare(`
    SELECT sv.text AS text_sv, en.text AS text_en FROM info i
    LEFT JOIN info_translations sv ON sv.info_id=i.id AND sv.language='sv'
    LEFT JOIN info_translations en ON en.info_id=i.id AND en.language='en'
    WHERE i.id=1
  `).get()
  d.close(); res.json(row)
})

app.put('/api/info', (req, res) => {
  const { text_sv, text_en } = req.body
  const d = db()
  try {
    d.transaction(() => {
      d.prepare(`UPDATE info_translations SET text=? WHERE info_id=1 AND language='sv'`).run(text_sv)
      d.prepare(`UPDATE info_translations SET text=? WHERE info_id=1 AND language='en'`).run(text_en)
    })()
    res.json({ message: 'Sparad' })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

// ── FOOTER ────────────────────────────────────────────────────────────────────
app.get('/api/footer', (req, res) => {
  const d = db()
  const row = d.prepare(`
    SELECT f.cv_url,
      sv.copyright AS copyright_sv, sv.text AS text_sv, sv.cv_text AS cv_text_sv, sv.cv_text2 AS cv_text2_sv,
      en.copyright AS copyright_en, en.text AS text_en, en.cv_text AS cv_text_en, en.cv_text2 AS cv_text2_en
    FROM footer f
    LEFT JOIN footer_translations sv ON sv.footer_id=f.id AND sv.language='sv'
    LEFT JOIN footer_translations en ON en.footer_id=f.id AND en.language='en'
    WHERE f.id=1
  `).get()
  d.close(); res.json(row)
})

app.put('/api/footer', (req, res) => {
  const { cv_url, copyright_sv, text_sv, cv_text_sv, cv_text2_sv, copyright_en, text_en, cv_text_en, cv_text2_en } = req.body
  const d = db()
  try {
    d.transaction(() => {
      d.prepare(`UPDATE footer SET cv_url=? WHERE id=1`).run(cv_url)
      d.prepare(`UPDATE footer_translations SET copyright=?,text=?,cv_text=?,cv_text2=? WHERE footer_id=1 AND language='sv'`).run(copyright_sv, text_sv, cv_text_sv, cv_text2_sv)
      d.prepare(`UPDATE footer_translations SET copyright=?,text=?,cv_text=?,cv_text2=? WHERE footer_id=1 AND language='en'`).run(copyright_en, text_en, cv_text_en, cv_text2_en)
    })()
    res.json({ message: 'Sparad' })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

// ── EDUCATION ─────────────────────────────────────────────────────────────────
app.get('/api/education', (req, res) => {
  const d = db()
  res.json(d.prepare(`
    SELECT e.id, e.examensbevis,
      sv.heading AS heading_sv, sv.subheading AS subheading_sv, sv.details AS details_sv,
      en.heading AS heading_en, en.subheading AS subheading_en, en.details AS details_en
    FROM section_entries e
    LEFT JOIN section_entry_translations sv ON sv.entry_id=e.id AND sv.language='sv'
    LEFT JOIN section_entry_translations en ON en.entry_id=e.id AND en.language='en'
    WHERE e.section_id=1 ORDER BY e.id
  `).all())
  d.close()
})

app.post('/api/education', (req, res) => {
  const { examensbevis, heading_sv, subheading_sv, details_sv, heading_en, subheading_en, details_en } = req.body
  const d = db()
  try {
    const id = d.transaction(() => {
      const { lastInsertRowid } = d.prepare(`INSERT INTO section_entries (section_id, examensbevis) VALUES (1,?)`).run(examensbevis || null)
      d.prepare(`INSERT INTO section_entry_translations (entry_id,language,heading,subheading,details) VALUES (?,'sv',?,?,?)`).run(lastInsertRowid, heading_sv, subheading_sv, details_sv)
      d.prepare(`INSERT INTO section_entry_translations (entry_id,language,heading,subheading,details) VALUES (?,'en',?,?,?)`).run(lastInsertRowid, heading_en, subheading_en, details_en)
      return Number(lastInsertRowid)
    })()
    res.json({ id })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

app.put('/api/education/:id', (req, res) => {
  const { examensbevis, heading_sv, subheading_sv, details_sv, heading_en, subheading_en, details_en } = req.body
  const id = req.params.id
  const d = db()
  try {
    d.transaction(() => {
      d.prepare(`UPDATE section_entries SET examensbevis=? WHERE id=?`).run(examensbevis || null, id)
      d.prepare(`UPDATE section_entry_translations SET heading=?,subheading=?,details=? WHERE entry_id=? AND language='sv'`).run(heading_sv, subheading_sv, details_sv, id)
      d.prepare(`UPDATE section_entry_translations SET heading=?,subheading=?,details=? WHERE entry_id=? AND language='en'`).run(heading_en, subheading_en, details_en, id)
    })()
    res.json({ message: 'Sparad' })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

app.delete('/api/education/:id', (req, res) => {
  const id = req.params.id
  const d = db()
  try {
    d.transaction(() => {
      d.prepare(`DELETE FROM section_entry_translations WHERE entry_id=?`).run(id)
      d.prepare(`DELETE FROM section_entries WHERE id=?`).run(id)
    })()
    res.json({ message: 'Borttagen' })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

// ── CONTACT ───────────────────────────────────────────────────────────────────
app.get('/api/contact', (req, res) => {
  const d = db()
  res.json(d.prepare(`
    SELECT e.id, sv.details AS details_sv, en.details AS details_en
    FROM section_entries e
    LEFT JOIN section_entry_translations sv ON sv.entry_id=e.id AND sv.language='sv'
    LEFT JOIN section_entry_translations en ON en.entry_id=e.id AND en.language='en'
    WHERE e.section_id=2 ORDER BY e.id
  `).all())
  d.close()
})

app.post('/api/contact', (req, res) => {
  const { details_sv, details_en } = req.body
  const d = db()
  try {
    const id = d.transaction(() => {
      const { lastInsertRowid } = d.prepare(`INSERT INTO section_entries (section_id) VALUES (2)`).run()
      d.prepare(`INSERT INTO section_entry_translations (entry_id,language,details) VALUES (?,'sv',?)`).run(lastInsertRowid, details_sv)
      d.prepare(`INSERT INTO section_entry_translations (entry_id,language,details) VALUES (?,'en',?)`).run(lastInsertRowid, details_en)
      return Number(lastInsertRowid)
    })()
    res.json({ id })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

app.put('/api/contact/:id', (req, res) => {
  const { details_sv, details_en } = req.body
  const id = req.params.id
  const d = db()
  try {
    d.transaction(() => {
      d.prepare(`UPDATE section_entry_translations SET details=? WHERE entry_id=? AND language='sv'`).run(details_sv, id)
      d.prepare(`UPDATE section_entry_translations SET details=? WHERE entry_id=? AND language='en'`).run(details_en, id)
    })()
    res.json({ message: 'Sparad' })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

app.delete('/api/contact/:id', (req, res) => {
  const id = req.params.id
  const d = db()
  try {
    d.transaction(() => {
      d.prepare(`DELETE FROM section_entry_translations WHERE entry_id=?`).run(id)
      d.prepare(`DELETE FROM section_entries WHERE id=?`).run(id)
    })()
    res.json({ message: 'Borttagen' })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

// ── EXPERIENCES ───────────────────────────────────────────────────────────────
function loadExperienceFull(d, entryId) {
  const duties = d.prepare(`
    SELECT d.id, sv.header AS header_sv, en.header AS header_en
    FROM section_entry_duties d
    LEFT JOIN section_entry_duty_translations sv ON sv.duty_id=d.id AND sv.language='sv'
    LEFT JOIN section_entry_duty_translations en ON en.duty_id=d.id AND en.language='en'
    WHERE d.entry_id=? ORDER BY d.id
  `).all(entryId)

  return duties.map(duty => {
    const items = d.prepare(`
      SELECT i.id, sv.item AS item_sv, en.item AS item_en
      FROM section_entry_duty_items i
      LEFT JOIN section_entry_duty_item_translations sv ON sv.item_id=i.id AND sv.language='sv'
      LEFT JOIN section_entry_duty_item_translations en ON en.item_id=i.id AND en.language='en'
      WHERE i.duty_id=? ORDER BY i.id
    `).all(duty.id)
    return { ...duty, items }
  })
}

function deleteDuties(d, entryId) {
  const duties = d.prepare(`SELECT id FROM section_entry_duties WHERE entry_id=?`).all(entryId)
  for (const duty of duties) {
    const items = d.prepare(`SELECT id FROM section_entry_duty_items WHERE duty_id=?`).all(duty.id)
    for (const item of items) d.prepare(`DELETE FROM section_entry_duty_item_translations WHERE item_id=?`).run(item.id)
    d.prepare(`DELETE FROM section_entry_duty_items WHERE duty_id=?`).run(duty.id)
    d.prepare(`DELETE FROM section_entry_duty_translations WHERE duty_id=?`).run(duty.id)
  }
  d.prepare(`DELETE FROM section_entry_duties WHERE entry_id=?`).run(entryId)
}

function insertDuties(d, entryId, duties) {
  for (const duty of duties || []) {
    const { lastInsertRowid: dutyId } = d.prepare(`INSERT INTO section_entry_duties (entry_id) VALUES (?)`).run(entryId)
    d.prepare(`INSERT INTO section_entry_duty_translations (duty_id,language,header) VALUES (?,'sv',?)`).run(dutyId, duty.header_sv)
    d.prepare(`INSERT INTO section_entry_duty_translations (duty_id,language,header) VALUES (?,'en',?)`).run(dutyId, duty.header_en)
    for (const item of duty.items || []) {
      const { lastInsertRowid: itemId } = d.prepare(`INSERT INTO section_entry_duty_items (duty_id) VALUES (?)`).run(dutyId)
      d.prepare(`INSERT INTO section_entry_duty_item_translations (item_id,language,item) VALUES (?,'sv',?)`).run(itemId, item.item_sv)
      d.prepare(`INSERT INTO section_entry_duty_item_translations (item_id,language,item) VALUES (?,'en',?)`).run(itemId, item.item_en)
    }
  }
}

app.get('/api/experiences', (req, res) => {
  const d = db()
  const entries = d.prepare(`
    SELECT e.id, e.date,
      sv.heading AS heading_sv, sv.details AS details_sv,
      en.heading AS heading_en, en.details AS details_en
    FROM section_entries e
    LEFT JOIN section_entry_translations sv ON sv.entry_id=e.id AND sv.language='sv'
    LEFT JOIN section_entry_translations en ON en.entry_id=e.id AND en.language='en'
    WHERE e.section_id=3 ORDER BY e.id
  `).all()
  res.json(entries.map(e => ({ ...e, duties: loadExperienceFull(d, e.id) })))
  d.close()
})

app.post('/api/experiences', (req, res) => {
  const { date, heading_sv, heading_en, details_sv, details_en, duties } = req.body
  const d = db()
  try {
    const id = d.transaction(() => {
      const { lastInsertRowid: entryId } = d.prepare(`INSERT INTO section_entries (section_id,date) VALUES (3,?)`).run(date || null)
      d.prepare(`INSERT INTO section_entry_translations (entry_id,language,heading,details) VALUES (?,'sv',?,?)`).run(entryId, heading_sv, JSON.stringify(details_sv || []))
      d.prepare(`INSERT INTO section_entry_translations (entry_id,language,heading,details) VALUES (?,'en',?,?)`).run(entryId, heading_en, JSON.stringify(details_en || []))
      insertDuties(d, entryId, duties)
      return Number(entryId)
    })()
    res.json({ id })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

app.put('/api/experiences/:id', (req, res) => {
  const { date, heading_sv, heading_en, details_sv, details_en, duties } = req.body
  const entryId = parseInt(req.params.id)
  const d = db()
  try {
    d.transaction(() => {
      d.prepare(`UPDATE section_entries SET date=? WHERE id=?`).run(date || null, entryId)
      d.prepare(`UPDATE section_entry_translations SET heading=?,details=? WHERE entry_id=? AND language='sv'`).run(heading_sv, JSON.stringify(details_sv || []), entryId)
      d.prepare(`UPDATE section_entry_translations SET heading=?,details=? WHERE entry_id=? AND language='en'`).run(heading_en, JSON.stringify(details_en || []), entryId)
      deleteDuties(d, entryId)
      insertDuties(d, entryId, duties)
    })()
    res.json({ message: 'Sparad' })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

app.delete('/api/experiences/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const d = db()
  try {
    d.transaction(() => {
      deleteDuties(d, id)
      d.prepare(`DELETE FROM section_entry_translations WHERE entry_id=?`).run(id)
      d.prepare(`DELETE FROM section_entries WHERE id=?`).run(id)
    })()
    res.json({ message: 'Borttagen' })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

// ── RECOMMENDATIONS ───────────────────────────────────────────────────────────
app.get('/api/recommendations', (req, res) => {
  const d = db()
  res.json(d.prepare(`
    SELECT r.id, sv.name, sv.company, sv.mail, sv.phone
    FROM recommendations r
    LEFT JOIN recommendation_translations sv ON sv.recommendation_id=r.id AND sv.language='sv'
    ORDER BY r.id
  `).all())
  d.close()
})

app.post('/api/recommendations', (req, res) => {
  const { name, company, mail, phone } = req.body
  const d = db()
  try {
    const id = d.transaction(() => {
      const { lastInsertRowid } = d.prepare(`INSERT INTO recommendations (id) VALUES (NULL)`).run()
      for (const lang of ['sv', 'en']) {
        d.prepare(`INSERT INTO recommendation_translations (recommendation_id,language,name,company,mail,phone) VALUES (?,?,?,?,?,?)`).run(lastInsertRowid, lang, name, company, mail, phone)
      }
      return Number(lastInsertRowid)
    })()
    res.json({ id })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

app.put('/api/recommendations/:id', (req, res) => {
  const { name, company, mail, phone } = req.body
  const id = req.params.id
  const d = db()
  try {
    d.transaction(() => {
      for (const lang of ['sv', 'en']) {
        d.prepare(`UPDATE recommendation_translations SET name=?,company=?,mail=?,phone=? WHERE recommendation_id=? AND language=?`).run(name, company, mail, phone, id, lang)
      }
    })()
    res.json({ message: 'Sparad' })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

app.delete('/api/recommendations/:id', (req, res) => {
  const id = req.params.id
  const d = db()
  try {
    d.transaction(() => {
      d.prepare(`DELETE FROM recommendation_translations WHERE recommendation_id=?`).run(id)
      d.prepare(`DELETE FROM recommendations WHERE id=?`).run(id)
    })()
    res.json({ message: 'Borttagen' })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

// ── SKILL CATEGORIES ──────────────────────────────────────────────────────────
app.get('/api/skill-categories', (req, res) => {
  const d = db()
  res.json(d.prepare(`
    SELECT c.id, sv.name AS name_sv, en.name AS name_en
    FROM skill_categories c
    LEFT JOIN skill_category_translations sv ON sv.category_id=c.id AND sv.language='sv'
    LEFT JOIN skill_category_translations en ON en.category_id=c.id AND en.language='en'
    ORDER BY c.id
  `).all())
  d.close()
})

app.post('/api/skill-categories', (req, res) => {
  const { name_sv, name_en } = req.body
  const d = db()
  try {
    const id = d.transaction(() => {
      const { lastInsertRowid } = d.prepare(`INSERT INTO skill_categories (id) VALUES (NULL)`).run()
      d.prepare(`INSERT INTO skill_category_translations (category_id,language,name) VALUES (?,'sv',?)`).run(lastInsertRowid, name_sv)
      d.prepare(`INSERT INTO skill_category_translations (category_id,language,name) VALUES (?,'en',?)`).run(lastInsertRowid, name_en)
      return Number(lastInsertRowid)
    })()
    res.json({ id })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

app.put('/api/skill-categories/:id', (req, res) => {
  const { name_sv, name_en } = req.body
  const id = req.params.id
  const d = db()
  try {
    d.transaction(() => {
      d.prepare(`UPDATE skill_category_translations SET name=? WHERE category_id=? AND language='sv'`).run(name_sv, id)
      d.prepare(`UPDATE skill_category_translations SET name=? WHERE category_id=? AND language='en'`).run(name_en, id)
    })()
    res.json({ message: 'Sparad' })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

// ── SKILLS ────────────────────────────────────────────────────────────────────
app.get('/api/skills', (req, res) => {
  const d = db()
  res.json(d.prepare(`
    SELECT s.id, s.category_id, s.image, s.grade, s."order",
      sv.text AS text_sv, sv.description AS description_sv,
      en.text AS text_en, en.description AS description_en
    FROM skills s
    LEFT JOIN skill_translations sv ON sv.skill_id=s.id AND sv.language='sv'
    LEFT JOIN skill_translations en ON en.skill_id=s.id AND en.language='en'
    ORDER BY s.category_id, s."order"
  `).all())
  d.close()
})

app.post('/api/skills', (req, res) => {
  const { category_id, image, grade, order, text_sv, description_sv, text_en, description_en } = req.body
  const d = db()
  try {
    const id = d.transaction(() => {
      const { lastInsertRowid } = d.prepare(`INSERT INTO skills (category_id,image,grade,"order") VALUES (?,?,?,?)`).run(category_id, image, grade, order)
      d.prepare(`INSERT INTO skill_translations (skill_id,language,text,description) VALUES (?,'sv',?,?)`).run(lastInsertRowid, text_sv, description_sv)
      d.prepare(`INSERT INTO skill_translations (skill_id,language,text,description) VALUES (?,'en',?,?)`).run(lastInsertRowid, text_en, description_en)
      return Number(lastInsertRowid)
    })()
    res.json({ id })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

app.put('/api/skills/:id', (req, res) => {
  const { category_id, image, grade, order, text_sv, description_sv, text_en, description_en } = req.body
  const id = req.params.id
  const d = db()
  try {
    d.transaction(() => {
      d.prepare(`UPDATE skills SET category_id=?,image=?,grade=?,"order"=? WHERE id=?`).run(category_id, image, grade, order, id)
      d.prepare(`UPDATE skill_translations SET text=?,description=? WHERE skill_id=? AND language='sv'`).run(text_sv, description_sv, id)
      d.prepare(`UPDATE skill_translations SET text=?,description=? WHERE skill_id=? AND language='en'`).run(text_en, description_en, id)
    })()
    res.json({ message: 'Sparad' })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

app.delete('/api/skills/:id', (req, res) => {
  const id = req.params.id
  const d = db()
  try {
    d.transaction(() => {
      d.prepare(`DELETE FROM skill_translations WHERE skill_id=?`).run(id)
      d.prepare(`DELETE FROM skills WHERE id=?`).run(id)
    })()
    res.json({ message: 'Borttagen' })
  } catch (e) { res.status(500).json({ error: e.message }) } finally { d.close() }
})

app.listen(3001, () => console.log('Admin-server: http://localhost:3001'))
