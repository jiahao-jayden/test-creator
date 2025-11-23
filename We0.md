# We0.md

本文件为 We0 (we0.ai) 在处理此代码库时提供指导。

## 项目概述

这是一个名为 "registration-system" 的 Next.js 15 应用程序，作为博客和商店的内容平台。它使用 App Router、TypeScript 构建，采用现代 React 模式，包含身份验证、数据库集成和管理界面。

## 开发命令

```bash
# 使用 Turbopack 启动开发服务器
npm run dev

# 使用 Turbopack 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## API 接口文档

### 博客接口 (Blogs)

#### GET /api/blogs
获取博客列表

**输入（查询参数）：**
- `search` (可选): 搜索关键词，会在标题、内容和摘要中搜索
- `tag` (可选): 按标签筛选
- `limit` (可选): 每页数量，默认 10
- `offset` (可选): 偏移量，默认 0

**输出（成功，200）：**
```json
{
  "success": true,
  "data": [/* 博客数组 */],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 数量
  }
}
```

**输出（错误，500）：**
```json
{
  "success": false,
  "error": "Failed to fetch blogs"
}
```

---

#### POST /api/blogs
创建新博客

**输入（JSON Body）：**
```json
{
  "title": "string (必填)",
  "slug": "string (必填)",
  "content": "string (必填)",
  "excerpt": "string (可选)",
  "author": "string (可选)",
  "tags": ["string"] (可选),
  "coverImage": "string (可选)"
}
```

**输出（成功，201）：**
```json
{
  "success": true,
  "data": {/* 创建的博客对象 */}
}
```

**输出（错误，400 - Slug 已存在）：**
```json
{
  "success": false,
  "error": "Slug already exists"
}
```

**输出（错误，400 - 验证失败）：**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [/* Zod 验证错误详情 */]
}
```

**输出（错误，500）：**
```json
{
  "success": false,
  "error": "Failed to create blog"
}
```

---

#### GET /api/blogs/[id]
根据 ID 获取单个博客

**输入（路径参数）：**
- `id`: 博客 ID

**输出（成功，200）：**
```json
{
  "success": true,
  "data": {/* 博客对象 */}
}
```

**输出（错误，404）：**
```json
{
  "success": false,
  "error": "Blog not found"
}
```

**输出（错误，500）：**
```json
{
  "success": false,
  "error": "Failed to fetch blog"
}
```

---

#### PUT /api/blogs/[id]
更新博客

**输入（路径参数）：**
- `id`: 博客 ID

**输入（JSON Body，所有字段可选）：**
```json
{
  "title": "string (可选)",
  "slug": "string (可选)",
  "content": "string (可选)",
  "excerpt": "string (可选)",
  "author": "string (可选)",
  "tags": ["string"] (可选),
  "coverImage": "string (可选)"
}
```

**输出（成功，200）：**
```json
{
  "success": true,
  "data": {/* 更新后的博客对象 */}
}
```

**输出（错误，404）：**
```json
{
  "success": false,
  "error": "Blog not found"
}
```

**输出（错误，400 - Slug 已存在）：**
```json
{
  "success": false,
  "error": "Slug already exists"
}
```

**输出（错误，400 - 验证失败）：**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [/* Zod 验证错误详情 */]
}
```

**输出（错误，500）：**
```json
{
  "success": false,
  "error": "Failed to update blog"
}
```

---

#### DELETE /api/blogs/[id]
删除博客

**输入（路径参数）：**
- `id`: 博客 ID

**输出（成功，200）：**
```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

**输出（错误，404）：**
```json
{
  "success": false,
  "error": "Blog not found"
}
```

**输出（错误，500）：**
```json
{
  "success": false,
  "error": "Failed to delete blog"
}
```

---

#### GET /api/blogs/slug/[slug]
根据 slug 获取博客

**输入（路径参数）：**
- `slug`: 博客 slug

**输出（成功，200）：**
```json
{
  "success": true,
  "data": {/* 博客对象 */}
}
```

**输出（错误，404）：**
```json
{
  "success": false,
  "error": "Blog not found"
}
```

**输出（错误，500）：**
```json
{
  "success": false,
  "error": "Failed to fetch blog"
}
```

---

### 商店接口 (Shops)

#### GET /api/shops
获取商店列表

**输入（查询参数）：**
- `search` (可选): 搜索关键词，会在名称和描述中搜索
- `limit` (可选): 每页数量，默认 10
- `offset` (可选): 偏移量，默认 0
- `minPrice` (可选): 最低价格
- `maxPrice` (可选): 最高价格

**输出（成功，200）：**
```json
{
  "success": true,
  "data": [/* 商店数组 */],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 数量
  }
}
```

**输出（错误，500）：**
```json
{
  "success": false,
  "error": "Failed to fetch shops"
}
```

---

#### POST /api/shops
创建新商店

**输入（JSON Body）：**
```json
{
  "name": "string (必填)",
  "image": "string (必填，必须是有效的 URL)",
  "price": "string (必填，格式：数字，最多两位小数，如 '10.99')",
  "description": "string (必填)"
}
```

**输出（成功，201）：**
```json
{
  "success": true,
  "data": {/* 创建的商店对象 */}
}
```

**输出（错误，400 - 验证失败）：**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [/* Zod 验证错误详情 */]
}
```

**输出（错误，500）：**
```json
{
  "success": false,
  "error": "Failed to create shop"
}
```

---

#### GET /api/shops/[id]
根据 ID 获取单个商店

**输入（路径参数）：**
- `id`: 商店 ID

**输出（成功，200）：**
```json
{
  "success": true,
  "data": {/* 商店对象 */}
}
```

**输出（错误，404）：**
```json
{
  "success": false,
  "error": "Shop not found"
}
```

**输出（错误，500）：**
```json
{
  "success": false,
  "error": "Failed to fetch shop"
}
```

---

#### PUT /api/shops/[id]
更新商店

**输入（路径参数）：**
- `id`: 商店 ID

**输入（JSON Body，所有字段可选）：**
```json
{
  "name": "string (可选)",
  "image": "string (可选，必须是有效的 URL)",
  "price": "string (可选，格式：数字，最多两位小数)",
  "description": "string (可选)"
}
```

**输出（成功，200）：**
```json
{
  "success": true,
  "data": {/* 更新后的商店对象 */}
}
```

**输出（错误，404）：**
```json
{
  "success": false,
  "error": "Shop not found"
}
```

**输出（错误，400 - 验证失败）：**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [/* Zod 验证错误详情 */]
}
```

**输出（错误，500）：**
```json
{
  "success": false,
  "error": "Failed to update shop"
}
```

---

#### DELETE /api/shops/[id]
删除商店

**输入（路径参数）：**
- `id`: 商店 ID

**输出（成功，200）：**
```json
{
  "success": true,
  "message": "Shop deleted successfully"
}
```

**输出（错误，404）：**
```json
{
  "success": false,
  "error": "Shop not found"
}
```

**输出（错误，500）：**
```json
{
  "success": false,
  "error": "Failed to delete shop"
}
```
