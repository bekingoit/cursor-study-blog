import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const seedImagesDir = path.join(__dirname, '../seed-images')

const seedImages = [
  { name: 'blog_pic_1.png', seed: 'studysprint-lifestyle' },
  { name: 'blog_pic_2.png', seed: 'studysprint-startup' },
  { name: 'blog_pic_3.png', seed: 'studysprint-technology' },
  { name: 'blog_pic_4.png', seed: 'studysprint-balance' },
  { name: 'blog_pic_5.png', seed: 'studysprint-javascript' },
  { name: 'blog_pic_6.png', seed: 'studysprint-founder' }
]

const downloadSeedImages = async () => {
  if (!fs.existsSync(seedImagesDir)) {
    fs.mkdirSync(seedImagesDir, { recursive: true })
  }

  console.log('📥 Ensuring seed images exist...\n')

  for (const { name, seed } of seedImages) {
    const destPath = path.join(seedImagesDir, name)

    if (fs.existsSync(destPath)) {
      console.log(`   ✓ ${name} (already exists)`)
      continue
    }

    const url = `https://picsum.photos/seed/${seed}/800/500`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to download ${name}: ${response.status} ${response.statusText}`)
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    fs.writeFileSync(destPath, buffer)
    console.log(`   ✓ ${name} (downloaded)`)
  }

  console.log('\n✅ Seed images ready\n')
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  downloadSeedImages().catch((error) => {
    console.error('❌ Failed to download seed images:', error.message)
    process.exit(1)
  })
}

export default downloadSeedImages
