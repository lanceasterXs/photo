import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const CATEGORIES = ['hero', 'portraits', 'landscapes', 'still-life'];
const PHOTOS_DIR = path.resolve('public', 'photos');

// 缩略图配置
const THUMB_WIDTH = 600;      // 缩略图最大宽度
const THUMB_QUALITY = 75;     // JPEG 质量

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    // ignore
  }
}

async function processCategory(category) {
  const srcDir = path.join(PHOTOS_DIR, category);
  const thumbDir = path.join(srcDir, 'thumbs');

  await ensureDir(thumbDir);

  const files = await fs.readdir(srcDir);
  const images = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f) && f !== 'thumbs');

  console.log(`\n📁 ${category}/ — 发现 ${images.length} 张图片`);

  for (const file of images) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(thumbDir, file);

    // 检查是否已存在且更新
    try {
      const [srcStat, destStat] = await Promise.all([
        fs.stat(srcPath),
        fs.stat(destPath).catch(() => null),
      ]);

      if (destStat && destStat.mtime >= srcStat.mtime) {
        console.log(`   ⏭️  ${file} (已是最新)`);
        continue;
      }
    } catch {
      // ignore
    }

    try {
      await sharp(srcPath)
        .resize({
          width: THUMB_WIDTH,
          withoutEnlargement: true,
        })
        .jpeg({ quality: THUMB_QUALITY, progressive: true })
        .toFile(destPath);

      // 获取文件大小对比
      const [srcSize, destSize] = await Promise.all([
        fs.stat(srcPath).then(s => s.size),
        fs.stat(destPath).then(s => s.size),
      ]);
      const ratio = ((1 - destSize / srcSize) * 100).toFixed(1);
      console.log(`   ✅ ${file} → ${(destSize / 1024).toFixed(1)}KB (节省 ${ratio}%)`);
    } catch (err) {
      console.error(`   ❌ ${file} 失败:`, err.message);
    }
  }
}

async function main() {
  console.log('🖼️  开始生成缩略图...');
  console.log(`   配置: 宽度≤${THUMB_WIDTH}px, JPEG质量${THUMB_QUALITY}%`);

  for (const category of CATEGORIES) {
    await processCategory(category);
  }

  console.log('\n✨ 全部完成!');
}

main().catch(err => {
  console.error('错误:', err);
  process.exit(1);
});
