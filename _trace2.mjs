import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } })
await p.goto('http://localhost:4318/about', { waitUntil: 'networkidle' })
const docH = await p.evaluate(() => document.body.scrollHeight)
for (let y = 0; y < docH; y += 800) { await p.evaluate((yy)=>scrollTo(0,yy), y); await p.waitForTimeout(40) }
await p.waitForSelector('[data-history-year-marker]')
async function snap(y){ await p.evaluate((yy)=>scrollTo(0,yy),y); await p.waitForTimeout(90)
  return await p.evaluate(()=>{ const anchor=document.querySelector('[data-history-divider]').getBoundingClientRect().bottom
    const ms=[...document.querySelectorAll('[data-history-year-marker]')].filter(m=>m.dataset.skipYear!=='true')
    const rows=ms.map(m=>{const s=m.querySelector('[data-year-suffix]');if(!s)return null;const r=s.getBoundingClientRect()
      const tf=new DOMMatrixReadOnly(getComputedStyle(s).transform);return {y:m.getAttribute('aria-label'),top:Math.round(r.top),tfy:Math.round(tf.m42)}})
      .filter(Boolean).filter(r=>r.top>-200&&r.top<1200)
    return {anchor:Math.round(anchor),rows}}) }
const base = await p.evaluate(()=>{const bl=[...document.querySelectorAll('[class*="block"]')].filter(b=>b.querySelector('[data-history-year-marker]'));return bl[1].getBoundingClientRect().top+scrollY})
for (let off=300; off<=1000; off+=100){ const s=await snap(base+off)
  console.log(`off ${off} anchor=${s.anchor}:`, s.rows.map(r=>`${r.y}@${r.top}${r.tfy?`(tf${r.tfy})`:''}`).join('  ')) }
await b.close()
