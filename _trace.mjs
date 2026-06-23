import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } })
await p.goto('http://localhost:4318/about', { waitUntil: 'networkidle' })
const docH = await p.evaluate(() => document.body.scrollHeight)
for (let y = 0; y < docH; y += 800) { await p.evaluate((yy)=>scrollTo(0,yy), y); await p.waitForTimeout(40) }
await p.waitForSelector('[data-history-year-marker]')

// 측정: divider 위치(anchor), 각 suffix의 현재 화면 위치/자연 위치
async function snap(y) {
  await p.evaluate((yy)=>scrollTo(0,yy), y)
  await p.waitForTimeout(120)
  return await p.evaluate(() => {
    const anchor = document.querySelector('[data-history-divider]').getBoundingClientRect().bottom
    const markers = [...document.querySelectorAll('[data-history-year-marker]')]
      .filter(m => m.dataset.skipYear !== 'true')
    const rows = markers.map(m => {
      const suf = m.querySelector('[data-year-suffix]')
      if (!suf) return null
      const r = suf.getBoundingClientRect()
      // 자연 위치(transform 제거 시) 계산: 현재 top - 현재 transformY
      const tf = new DOMMatrixReadOnly(getComputedStyle(suf).transform)
      const naturalTop = r.top - tf.m42
      return { y: m.getAttribute('aria-label'), screenTop: Math.round(r.top), naturalTop: Math.round(naturalTop), tfy: Math.round(tf.m42) }
    }).filter(Boolean).filter(r => r.screenTop > -300 && r.screenTop < 1380)
    return { anchor: Math.round(anchor), rows }
  })
}

// 1987 marker 자연 위치 기준으로 전환 구간 스캔
const base = await p.evaluate(() => {
  const blocks=[...document.querySelectorAll('[class*="block"]')].filter(b=>b.querySelector('[data-history-year-marker]'))
  return blocks[1].getBoundingClientRect().top + scrollY
})
for (const off of [-500, -300, -150, -60, 0, 80, 200]) {
  const s = await snap(base + off)
  console.log(`scroll=${base+off} (off ${off}) anchor=${s.anchor}`)
  s.rows.forEach(r => console.log(`   ${r.y}: screen=${r.screenTop} natural=${r.naturalTop} tfY=${r.tfy} gap(natural-anchor)=${r.naturalTop-s.anchor}`))
}
await b.close()
