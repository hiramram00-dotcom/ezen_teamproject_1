/**
 * 일회성 이미지 최적화 스크립트
 * CollaboSection 카드 사진(원본 jpg/png)을 ~760px webp로 변환.
 * 사용: node scripts/optimize-collabo-images.mjs
 * (변환 확인 후 원본은 별도로 삭제)
 */
import { readdir } from 'node:fs/promises'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ASSETS = resolve(__dirname, '../src/sections/CollaboSection/assets')

const MAX_WIDTH = 760 // 카드 표시폭 379px의 약 2배(레티나)
const QUALITY = 80

const files = (await readdir(ASSETS)).filter((f) =>
  ['.jpg', '.jpeg', '.png'].includes(extname(f).toLowerCase()),
)

for (const file of files) {
  const src = join(ASSETS, file)
  const out = join(ASSETS, file.replace(extname(file), '.webp'))
  const info = await sharp(src)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out)
  console.log(`${file} → ${file.replace(extname(file), '.webp')}  (${(info.size / 1024).toFixed(0)} KB)`)
}
