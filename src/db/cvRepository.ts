import initSqlJs from 'sql.js'
import type { Database } from 'sql.js'
// Språkkoder i databasen
export type DbLanguageCode = 'sv' | 'en'

let dbPromise: Promise<Database> | null = null

async function getDb(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const SQL = await initSqlJs({
        // sql-wasm.wasm måste ligga i public/ (t.ex. public/sql-wasm.wasm)
        locateFile: () => '/sql-wasm.wasm',
      })

      const response = await fetch('/db/cv.sqlite')
      if (!response.ok) {
        throw new Error(`Kunde inte ladda /db/cv.sqlite: ${response.status} ${response.statusText}`)
      }

      const buffer = await response.arrayBuffer()
      return new SQL.Database(new Uint8Array(buffer))
    })()
  }
  return dbPromise
}

function getSingleRow<T = any>(rows: any[][]): T | null {
  if (!rows || rows.length === 0) return null as any
  return rows[0] as any
}

export async function loadCvContentFromDb(lang: DbLanguageCode): Promise<ContentType> {
  const db = await getDb()

  // HEADER
  const headerResult = db.exec(
    `SELECT name, role, summary FROM header_translations WHERE header_id = 1 AND language = '${lang}'`
  )
  if (!headerResult.length || headerResult[0].values.length === 0) {
    throw new Error(`Hittade ingen header för språk ${lang}`)
  }
  const [name, role, summary] = getSingleRow(headerResult[0].values) as [string, string, string]

  const socialResult = db.exec(
    `SELECT icon, url FROM social_links WHERE header_id = 1 ORDER BY id`
  )
  const socialLinks = (socialResult[0]?.values || []).map((row: any[]) => {
    const [icon, url] = row as [string, string]
    return { icon, url }
  })

  const header: ContentType['header'] = {
    name,
    role,
    summary,
    socialLinks,
  }

  // FOOTER
  const footerResult = db.exec(
    `SELECT f.cv_url, t.copyright, t.text, t.cv_text, t.cv_text2
     FROM footer f
     JOIN footer_translations t ON t.footer_id = f.id
     WHERE t.language = '${lang}'`
  )
  const footerRow = getSingleRow(footerResult[0]?.values || []) as
    | [string, string, string, string, string]
    | null

  let footer: ContentType['footer'] | undefined
  if (footerRow) {
    const [cvUrl, copyright, text, cvText, cvText2] = footerRow
    footer = {
      copyright,
      text,
      cv: {
        text: cvText,
        text2: cvText2,
        url: cvUrl,
      },
    }
  }

  // SECTIONS: titlar
  const sectionsResult = db.exec(
    `SELECT s.id, t.title
     FROM sections s
     JOIN section_translations t ON t.section_id = s.id
     WHERE t.language = '${lang}'
     ORDER BY s.id`
  )

  const sections: ContentType['sections'] = []

  for (const row of sectionsResult[0]?.values || []) {
    const [sectionIdNum, title] = row as [number, string]
    const sectionId = Number(sectionIdNum)

    if (sectionId === 1) {
      // Education / Utbildning
      const eduResult = db.exec(
        `SELECT e.examensbevis, tr.heading, tr.subheading, tr.details
         FROM section_entries e
         JOIN section_entry_translations tr ON tr.entry_id = e.id
         WHERE e.section_id = 1 AND tr.language = '${lang}'
         ORDER BY e.id`
      )

      const content = (eduResult[0]?.values || []).map((r: any[]) => {
        const [examensbevis, heading, subheading, details] = r as [string | null, string, string, string]
        const base: any = {
          heading,
          subheading,
          description: details,
        }
        if (examensbevis) base.examensbevis = examensbevis
        return base
      })

      sections.push({ title, content } as any)
    } else if (sectionId === 2) {
      // Contact / Kontakta – details är JSON som matchar icon/text/url/tag
      const contactResult = db.exec(
        `SELECT tr.details
         FROM section_entries e
         JOIN section_entry_translations tr ON tr.entry_id = e.id
         WHERE e.section_id = 2 AND tr.language = '${lang}'
         ORDER BY e.id`
      )

      const content = (contactResult[0]?.values || []).map((r: any[]) => {
        const [details] = r as [string]
        try {
          return JSON.parse(details)
        } catch {
          return null
        }
      }).filter(Boolean)

      sections.push({ title, content } as any)
    } else if (sectionId === 3) {
      // Experience / Erfarenhet
      const expResult = db.exec(
        `SELECT e.id, e.date, tr.heading, tr.details
         FROM section_entries e
         JOIN section_entry_translations tr ON tr.entry_id = e.id
         WHERE e.section_id = 3 AND tr.language = '${lang}'
         ORDER BY e.id`
      )

      const content = (expResult[0]?.values || []).map((r: any[]) => {
        const [entryIdNum, date, heading, detailsJson] = r as [number, string | null, string, string]
        const entryId = Number(entryIdNum)
        let details: string[] = []
        try {
          const parsed = JSON.parse(detailsJson)
          if (Array.isArray(parsed)) details = parsed.map(String)
          else if (parsed) details = [String(parsed)]
        } catch {
          if (detailsJson) details = [detailsJson]
        }

        // Hämta duties för just denna entry
        const dutiesResult = db.exec(
          `SELECT d.id, dt.header
           FROM section_entry_duties d
           JOIN section_entry_duty_translations dt ON dt.duty_id = d.id
           WHERE d.entry_id = ${entryId} AND dt.language = '${lang}'
           ORDER BY d.id`
        )

        const duties = (dutiesResult[0]?.values || []).map((dr: any[]) => {
          const [dutyIdNum, dutyHeader] = dr as [number, string]
          const dutyId = Number(dutyIdNum)

          const itemsResult = db.exec(
            `SELECT it.item
             FROM section_entry_duty_items i
             JOIN section_entry_duty_item_translations it ON it.item_id = i.id
             WHERE i.duty_id = ${dutyId} AND it.language = '${lang}'
             ORDER BY i.id`
          )

          const items = (itemsResult[0]?.values || []).map((ir: any[]) => {
            const [itemText] = ir as [string]
            return itemText
          })

          return {
            header: dutyHeader,
            items,
          }
        })

        return {
          heading,
          date: date || '',
          details,
          duties,
        }
      })

      sections.push({ title, content } as any)
    } else if (sectionId === 4) {
      // Recommendations / Rekommendationer
      const recResult = db.exec(
        `SELECT name, company, mail, phone
         FROM recommendation_translations
         WHERE language = '${lang}'
         ORDER BY recommendation_id`
      )

      const content = (recResult[0]?.values || []).map((r: any[]) => {
        const [name, company, mail, phone] = r as [string, string, string, string]
        return { name, company, mail, phone }
      })

      sections.push({ title, content } as any)
    } else if (sectionId === 5) {
      // Skills – bygg contentV2 som i JSON-filerna
      const catResult = db.exec(
        `SELECT c.id, ct.name
         FROM skill_categories c
         JOIN skill_category_translations ct ON ct.category_id = c.id
         WHERE ct.language = '${lang}'
         ORDER BY c.id`
      )

      const contentV2 = (catResult[0]?.values || []).map((cr: any[]) => {
        const [catIdNum, catName] = cr as [number, string]
        const catId = Number(catIdNum)

        const skillsResult = db.exec(
          `SELECT s.image, st.text, s.grade, s."order", st.description
           FROM skills s
           JOIN skill_translations st ON st.skill_id = s.id
           WHERE s.category_id = ${catId} AND st.language = '${lang}'
           ORDER BY s."order"`
        )

        const items = (skillsResult[0]?.values || []).map((sr: any[]) => {
          const [image, text, grade, order, description] = sr as [string, number, number, number | null, string]
          return {
            image,
            text,
            grade,
            order,
            description,
          }
        })

        return {
          category: catName,
          items,
        }
      })

      sections.push({ title, content: [], contentV2 } as any)
    }
  }

  return {
    header,
    sections,
    footer,
  }
}
