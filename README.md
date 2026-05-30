# M&D · 光影 — mimiland 摄影展示网站

## 文件夹结构

```
public/
├── photos/
│   ├── hero/               ← 首页幻灯片照片（直接放高清，无需缩略图）
│   ├── portraits/          ← 人像高清照片
│   │   └── thumbs/         ← 人像低分辨率预览（文件名需与高清版相同）
│   ├── still-life/         ← 静物高清照片
│   │   └── thumbs/
│   ├── landscapes/         ← 风景高清照片
│   │   └── thumbs/
│   └── wechat-qr.jpg       ← 微信名片二维码（竖版，建议 3:4 比例）
```

## 添加照片步骤

1. **放入高清照片** → 对应类别文件夹（portraits / still-life / landscapes / hero）
2. **放入缩略图**（可选）→ 对应的 `thumbs/` 子文件夹，文件名需与高清版完全一致
   - 缩略图建议宽度 600-800px，控制在 50-150KB
   - 若没有缩略图，网站会自动使用高清版预览
3. **生成图片清单**：
   ```bash
   node scripts/generate-manifest.mjs
   ```
4. **重新构建**：
   ```bash
   npm run build
   ```

## 支持的图片格式

`.jpg` `.jpeg` `.png` `.webp` `.avif`

## 功能特性

- 📱 手机优先的响应式设计
- 🌙 日/夜模式切换
- 🖼 首页幻灯片（随机顺序 + Ken Burns 放大效果）
- 🏛 不规则瀑布流画廊（分类筛选）
- 🔍 点击照片灯箱放大（毛玻璃背景 + 键盘/滑动切换）
- ⚡ 懒加载图片（节省带宽）
- ✨ 滚动浮现动画
- 🔤 流动文字横幅（斜体循环）
