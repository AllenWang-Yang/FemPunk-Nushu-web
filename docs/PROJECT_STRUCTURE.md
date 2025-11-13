# FemPunk NüShu Web3 绘画平台 - 项目结构文档

## 📋 项目概述

这是一个基于 **Next.js 14** 的 Web3 协作绘画平台，结合了区块链技术和女书文化传承。用户可以通过购买颜色 NFT 参与协作绘画，作品最终会被铸造成 NFT。

### 技术栈
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: CSS Modules + Tailwind CSS
- **Web3**: wagmi + viem + RainbowKit
- **状态管理**: Zustand
- **实时协作**: Liveblocks
- **画布**: Fabric.js
- **监控**: Sentry

---

## 🗂️ 完整目录结构

```
FemPunk-Nushu-web/
├── app/                      # Next.js 14 App Router 页面
│   ├── api/                  # API 路由（后端接口代理）
│   │   ├── colors/           # 颜色相关接口
│   │   │   ├── owner/        # 获取用户颜色
│   │   │   └── reward/       # 奖励颜色
│   │   ├── redemption/       # 兑换码相关接口
│   │   │   └── validate/     # 验证兑换码
│   │   └── placeholder/      # 占位符接口
│   ├── page.tsx              # 首页（展示页）
│   ├── canvas/               # 画布页
│   │   └── page.tsx
│   ├── buy/                  # 购买页
│   │   ├── page.tsx
│   │   └── page.module.css
│   ├── gallery/              # 藏品页
│   │   └── page.tsx
│   ├── community/            # 社区页
│   │   └── page.tsx
│   ├── layout.tsx            # 全局布局
│   └── globals.css           # 全局样式
│
├── components/               # React 组件
│   ├── canvas/               # 画布相关组件
│   │   ├── PaintPage.tsx     # 画布主页面
│   │   ├── CanvasToolbar.tsx # 画布工具栏
│   │   └── ColorPicker.tsx   # 颜色选择器
│   ├── purchase/             # 购买相关组件
│   │   ├── ColorGrid.tsx     # 颜色网格
│   │   └── RedemptionForm.tsx # 兑换码表单
│   ├── collection/           # 藏品相关组件
│   │   ├── ColorNFTCard.tsx  # 颜色 NFT 卡片
│   │   └── ArtworkCard.tsx   # 作品卡片
│   ├── wallet/               # 钱包连接组件
│   │   ├── WalletModal.tsx   # 钱包连接弹窗
│   │   └── WalletButton.tsx  # 钱包按钮
│   ├── navigation/           # 导航栏组件
│   │   └── Navbar.tsx        # 导航栏
│   ├── homepage/             # 首页组件
│   │   └── OptimizedHomePage.tsx
│   ├── exhibition/           # 展示相关组件
│   ├── community/            # 社区相关组件
│   ├── figma/                # Figma 集成组件
│   ├── layout/               # 布局组件
│   ├── revenue/              # 收益相关组件
│   ├── setup/                # 设置相关组件
│   └── ui/                   # 通用 UI 组件
│       ├── Button.tsx        # 按钮组件
│       ├── Modal.tsx         # 弹窗组件
│       ├── ErrorBoundary.tsx # 错误边界
│       └── GlobalErrorDisplay.tsx # 全局错误显示
│
├── lib/                      # 核心业务逻辑
│   ├── contracts/            # 智能合约配置和 ABI
│   │   ├── abis.ts           # 合约 ABI 定义
│   │   └── config.ts         # 合约配置
│   ├── hooks/                # 自定义 React Hooks
│   │   ├── useWalletModal.ts # 钱包弹窗 Hook
│   │   ├── useColorNFTs.ts   # 颜色 NFT Hook
│   │   ├── useArtworkNFTs.ts # 作品 NFT Hook
│   │   ├── usePurchaseFlow.ts # 购买流程 Hook
│   │   └── useCollaborativeCanvas.ts # 协作画布 Hook
│   ├── stores/               # Zustand 状态管理
│   │   ├── walletStore.ts    # 钱包状态
│   │   ├── colorStore.ts     # 颜色状态
│   │   ├── canvasStore.ts    # 画布状态
│   │   └── appStore.ts       # 应用状态
│   ├── services/             # 服务层（API 调用）
│   │   ├── dataSync.ts       # 数据同步服务
│   │   └── errorHandler.ts   # 错误处理服务
│   ├── providers/            # Context Providers
│   │   └── Web3Provider.tsx  # Web3 Provider
│   ├── context/              # React Context
│   │   └── WalletContext.tsx # 钱包 Context
│   ├── queries/              # React Query 查询
│   ├── wagmi/                # Wagmi 配置
│   ├── wallet/               # 钱包相关工具
│   ├── liveblocks/           # Liveblocks 配置
│   ├── canvas/               # 画布工具函数
│   ├── collaboration/        # 协作相关工具
│   ├── constants/            # 常量定义
│   ├── monitoring/           # 监控相关（Sentry）
│   ├── setup/                # 设置相关工具
│   └── utils/                # 通用工具函数
│       └── utils.ts          # 工具函数集合
│
├── types/                    # TypeScript 类型定义
│   ├── global.d.ts           # 全局类型
│   ├── wallet.ts             # 钱包相关类型
│   ├── nft.ts                # NFT 相关类型
│   └── canvas.ts             # 画布相关类型
│
├── public/                   # 静态资源
│   ├── images/               # 图片资源
│   │   └── homepage/         # 首页图片
│   ├── fonts/                # 字体文件（如有）
│   ├── favicon.ico           # 网站图标
│   └── robots.txt            # SEO 配置
│
├── styles/                   # 全局样式
│   └── figma-tokens.css      # Figma 设计 Token
│
├── tokens/                   # 设计 Token
│   └── index.ts              # Token 定义（颜色、字体等）
│
├── scripts/                  # 脚本工具
│   ├── export-figma-assets.ts      # 导出 Figma 资源
│   ├── figma-mcp-client.ts         # Figma MCP 客户端
│   ├── setup-figma-integration.ts  # 设置 Figma 集成
│   └── sync-figma-tokens.ts        # 同步 Figma Token
│
├── test/                     # 测试文件
│   ├── components/           # 组件测试
│   ├── hooks/                # Hooks 测试
│   ├── stores/               # Store 测试
│   ├── utils/                # 工具函数测试
│   ├── integration/          # 集成测试
│   ├── e2e/                  # 端到端测试
│   └── setup.ts              # 测试配置
│
├── docs/                     # 文档
│   └── figma-integration.md  # Figma 集成文档
│
├── UI draft/                 # UI 设计草稿
├── UI tsx files/             # UI TSX 文件
│
├── .env.local                # 环境变量（本地，不提交）
├── .env.example              # 环境变量示例
├── .gitignore                # Git 忽略文件
├── next.config.js            # Next.js 配置
├── tailwind.config.ts        # Tailwind CSS 配置
├── tsconfig.json             # TypeScript 配置
├── postcss.config.js         # PostCSS 配置
├── vitest.config.ts          # Vitest 测试配置
├── vercel.json               # Vercel 部署配置
├── package.json              # 项目依赖
├── SETUP.md                  # 设置指南
├── CLAUDE.md                 # Claude AI 配置
├── functions.md              # 功能文档
└── PROJECT_STRUCTURE.md      # 本文档
```

---

## 🎯 页面路由结构

### 1. 首页 `/` (展示页)
- **文件**: `app/page.tsx`
- **组件**: `components/homepage/OptimizedHomePage.tsx`
- **功能**: 
  - 展示平台介绍
  - 展示精选作品
  - 社区作品列表
  - 引导用户进入创作

### 2. 画布页 `/canvas`
- **文件**: `app/canvas/page.tsx`
- **组件**: `components/canvas/PaintPage.tsx`
- **功能**:
  - 协作绘画画布
  - 显示今日主题和女书字
  - 颜色选择器
  - 实时同步其他用户绘画

### 3. 购买页 `/buy`
- **文件**: `app/buy/page.tsx`
- **功能**:
  - 展示可购买的颜色 NFT
  - 显示当前价格（动态浮动）
  - 兑换码输入功能
  - 显示用户已拥有的颜色

### 4. 藏品页 `/gallery`
- **文件**: `app/gallery/page.tsx`
- **组件**: `components/collection/`
- **功能**:
  - 展示用户拥有的颜色 NFT
  - 展示用户参与的作品
  - 查看链上记录

### 5. 社区页 `/community`
- **文件**: `app/community/page.tsx`
- **组件**: `components/community/`
- **功能**:
  - 公众号二维码
  - 联系方式
  - 社区入口

---

## 🔌 API 接口说明

### 前端 API 路由（代理层）

所有 API 都在 `app/api/` 目录下，作为前端到后端的代理层。

#### 1. 获取用户颜色
```
GET /api/colors/owner?address={walletAddress}
```
- **文件**: `app/api/colors/owner/route.ts`
- **功能**: 获取指定钱包地址拥有的所有颜色 NFT
- **后端**: `${BACKEND_URL}/api/colors/owner/${address}`

#### 2. 奖励颜色（首次连接钱包）
```
POST /api/colors/reward
Body: { address: string, color_id: string }
```
- **文件**: `app/api/colors/reward/route.ts`
- **功能**: 用户首次连接钱包时，奖励一个随机颜色 NFT
- **后端**: `${BACKEND_URL}/api/colors/reward`

#### 3. 验证兑换码
```
POST /api/redemption/validate
Body: { code: string }
```
- **文件**: `app/api/redemption/validate/route.ts`
- **功能**: 验证兑换码是否有效，并返回对应的颜色
- **返回**: `{ valid: boolean, colorHex?: string, error?: string }`

#### 4. 检查兑换码状态
```
GET /api/redemption/validate?code={code}
```
- **文件**: `app/api/redemption/validate/route.ts`
- **功能**: 查询兑换码状态（不标记为已使用）
- **返回**: `{ exists: boolean, used: boolean, expired: boolean }`

### 环境变量配置

需要在 `.env.local` 中配置后端 URL：

```env
# 后端服务地址
BACKEND_URL=http://localhost:3001

# 或者生产环境
BACKEND_URL=https://your-backend-api.com
```

---

## 🔗 智能合约配置

### 合约地址配置
**文件**: `lib/contracts/abis.ts`

```typescript
export const CONTRACT_ADDRESSES = {
  sepolia: {
    colorNFT: '0x...',           // 颜色 NFT 合约
    artworkNFT: '0x...',         // 作品 NFT 合约
    femCanvasRevenue: '0x...',   // 收益分配合约
  },
  mainnet: {
    colorNFT: '0x...',
    artworkNFT: '0x...',
    femCanvasRevenue: '0x...',
  }
}
```

### 三个核心合约

#### 1. ColorNFT 合约（颜色 NFT）
**文件**: `lib/contracts/abis.ts` - `ColorNFTABI`

**主要功能**:
- `purchaseColor(colorHex)` - 购买颜色 NFT
- `getOwnedColors(owner)` - 获取用户拥有的颜色
- `getAvailableColors()` - 获取可购买的颜色列表
- `getCurrentPrice()` - 获取当前价格
- `redeemColor(code)` - 使用兑换码获取颜色

#### 2. ArtworkNFT 合约（作品 NFT）
**文件**: `lib/contracts/abis.ts` - `ArtworkNFTABI`

**主要功能**:
- `mintArtwork(canvasData, contributors, contributions, dailyThemeId)` - 铸造作品 NFT
- `getArtworkDetails(tokenId)` - 获取作品详情
- `getContributorArtworks(contributor)` - 获取用户参与的作品

#### 3. FemCanvasRevenue 合约（收益分配）
**文件**: `lib/contracts/abis.ts` - `FemCanvasRevenueABI`

**主要功能**:
- `receiveRevenue(canvasId)` - 接收作品销售收益
- `distributeRevenue(canvasId)` - 分配收益给贡献者
- `claimRevenue(canvasId)` - 贡献者领取收益
- `getClaimableAmount(canvasId, contributor)` - 查询可领取金额

### 合约配置函数
**文件**: `lib/contracts/config.ts`

```typescript
// 获取合约配置
getColorNFTContract(chainId)      // 颜色 NFT 合约
getArtworkNFTContract(chainId)    // 作品 NFT 合约
getFemCanvasRevenueContract(chainId) // 收益合约

// Gas 限制配置
GAS_LIMITS = {
  purchaseColor: 150000n,
  mintArtwork: 300000n,
  redeemColor: 100000n,
}

// 价格配置
PRICE_CONFIG = {
  baseColorPrice: 10000000000000000n,  // 0.01 ETH
  priceIncrement: 1000000000000000n,   // 0.001 ETH
  maxColorPrice: 100000000000000000n,  // 0.1 ETH
}
```

---

## 🎨 核心组件说明

### 1. 钱包连接组件
**文件**: `components/wallet/WalletModal.tsx`

**功能**:
- 显示钱包连接弹窗
- 集成 RainbowKit
- 支持多种钱包（MetaMask, WalletConnect 等）

**使用方式**:
```typescript
import { useWalletModal } from '@/lib/hooks/useWalletModal';

const { modalState, openModal, closeModal } = useWalletModal();

// 打开钱包弹窗
openModal('purchase', {
  title: '连接钱包购买颜色',
  description: '连接钱包以购买颜色 NFT'
});
```

### 2. 画布组件
**文件**: `components/canvas/PaintPage.tsx`

**功能**:
- 使用 Fabric.js 实现绘画功能
- 通过 Liveblocks 实现实时协作
- 颜色选择和画笔工具

### 3. 导航栏组件
**文件**: `components/navigation/`

**功能**:
- 页面导航
- 钱包连接状态显示
- 响应式设计

---

## 🔧 核心 Hooks 说明

### 1. useWalletModal
**文件**: `lib/hooks/useWalletModal.ts`

**功能**: 管理钱包连接弹窗状态

```typescript
const {
  modalState,           // 弹窗状态
  openModal,            // 打开弹窗
  closeModal,           // 关闭弹窗
  requireWallet,        // 检查钱包并在需要时打开弹窗
  isWalletReady,        // 钱包是否就绪
} = useWalletModal();
```

### 2. useColorNFTs
**文件**: `lib/hooks/useColorNFTs.ts`

**功能**: 管理颜色 NFT 相关操作

```typescript
const {
  ownedColors,          // 用户拥有的颜色
  availableColors,      // 可购买的颜色
  currentPrice,         // 当前价格
  purchaseColor,        // 购买颜色
  redeemColor,          // 兑换颜色
} = useColorNFTs();
```

### 3. useArtworkNFTs
**文件**: `lib/hooks/useArtworkNFTs.ts`

**功能**: 管理作品 NFT 相关操作

```typescript
const {
  userArtworks,         // 用户参与的作品
  mintArtwork,          // 铸造作品
  getArtworkDetails,    // 获取作品详情
} = useArtworkNFTs();
```

### 4. usePurchaseFlow
**文件**: `lib/hooks/usePurchaseFlow.ts`

**功能**: 管理购买流程

```typescript
const {
  isPurchasing,         // 是否正在购买
  purchaseColor,        // 购买颜色
  redeemCode,           // 兑换码
} = usePurchaseFlow();
```

---

## 📦 状态管理 (Zustand)

### 1. walletStore
**文件**: `lib/stores/walletStore.ts`

**状态**:
```typescript
{
  address: string | null,      // 钱包地址
  isConnected: boolean,        // 是否连接
  isConnecting: boolean,       // 是否正在连接
  chainId: number | null,      // 链 ID
  error: string | null,        // 错误信息
}
```

### 2. colorStore
**文件**: `lib/stores/colorStore.ts`

**状态**:
```typescript
{
  ownedColors: Color[],        // 拥有的颜色
  selectedColor: Color | null, // 选中的颜色
  availableColors: Color[],    // 可购买的颜色
}
```

### 3. canvasStore
**文件**: `lib/stores/canvasStore.ts`

**状态**:
```typescript
{
  canvasData: object,          // 画布数据
  activeUsers: User[],         // 活跃用户
  currentTheme: Theme,         // 当前主题
}
```

---

## 🌐 前端基础知识

### Next.js App Router 路由系统

1. **文件即路由**: 
   - `app/page.tsx` → `/`
   - `app/canvas/page.tsx` → `/canvas`
   - `app/buy/page.tsx` → `/buy`

2. **API 路由**:
   - `app/api/colors/owner/route.ts` → `/api/colors/owner`
   - 使用 `GET`, `POST` 等导出函数定义接口

3. **布局系统**:
   - `app/layout.tsx` - 全局布局，包裹所有页面
   - 可以嵌套多层布局

### React 组件通信

1. **Props 传递**: 父组件向子组件传递数据
2. **Context**: 跨组件共享状态（如 WalletContext）
3. **Zustand Store**: 全局状态管理
4. **Hooks**: 封装可复用逻辑

### CSS Modules

- 文件命名: `page.module.css`
- 使用方式: `import styles from './page.module.css'`
- 类名: `<div className={styles.container}>`
- 优点: 自动生成唯一类名，避免样式冲突

---

## 🔄 如何接入后端 URL

### 步骤 1: 配置环境变量

创建 `.env.local` 文件：

```env
# 后端服务地址
BACKEND_URL=https://your-backend-api.com

# Web3 配置
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key

# 合约地址
NEXT_PUBLIC_REVENUE_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_COLOR_NFT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_ARTWORK_NFT_CONTRACT_ADDRESS=0x...
```

### 步骤 2: 修改 API 路由

所有 API 路由都在 `app/api/` 目录下，它们会自动读取 `BACKEND_URL` 环境变量。

**示例**: `app/api/colors/owner/route.ts`

```typescript
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  const response = await fetch(`${BACKEND_URL}/api/colors/owner/${address}`);
  // ...
}
```

### 步骤 3: 后端接口要求

后端需要提供以下接口：

#### 1. 获取用户颜色
```
GET /api/colors/owner/:address
Response: {
  colors: [
    { id: string, hex: string, tokenId: number, mintedAt: number }
  ]
}
```

#### 2. 奖励颜色
```
POST /api/colors/reward
Body: { address: string, color_id: string }
Response: {
  success: boolean,
  color: { id: string, hex: string }
}
```

#### 3. 验证兑换码
```
POST /api/redemption/validate
Body: { code: string }
Response: {
  valid: boolean,
  colorHex?: string,
  error?: string
}
```

### 步骤 4: 测试接口

```bash
# 启动开发服务器
npm run dev

# 测试 API
curl http://localhost:3000/api/colors/owner?address=0x...
```

---

## 🚀 开发流程

### 1. 安装依赖
```bash
npm install
# 或
yarn install
```

### 2. 配置环境变量
```bash
cp .env.example .env.local
# 编辑 .env.local，填入你的配置
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 构建生产版本
```bash
npm run build
npm run start
```

---

## 📝 常见修改场景

### 场景 1: 修改后端 URL

**涉及文件**: `.env.local`

```env
BACKEND_URL=https://new-backend-url.com
```

### 场景 2: 添加新的 API 接口

**步骤**:
1. 在 `app/api/` 下创建新目录和 `route.ts`
2. 实现 `GET` 或 `POST` 函数
3. 调用后端接口并返回数据

**示例**: `app/api/themes/route.ts`
```typescript
export async function GET() {
  const response = await fetch(`${BACKEND_URL}/api/themes`);
  const data = await response.json();
  return NextResponse.json(data);
}
```

### 场景 3: 修改智能合约地址

**涉及文件**: 
- `.env.local` - 环境变量
- `lib/contracts/abis.ts` - 合约地址配置

```typescript
export const CONTRACT_ADDRESSES = {
  sepolia: {
    colorNFT: '0xNEW_ADDRESS',
    // ...
  }
}
```

### 场景 4: 添加新页面

**步骤**:
1. 在 `app/` 下创建新目录
2. 创建 `page.tsx` 文件
3. 实现页面组件

**示例**: `app/profile/page.tsx`
```typescript
export default function ProfilePage() {
  return <div>个人资料页</div>;
}
```

---

## 🐛 调试技巧

### 1. 查看 API 请求
打开浏览器开发者工具 → Network 标签 → 查看 API 请求和响应

### 2. 查看控制台日志
所有 `console.log` 和错误信息都会显示在浏览器控制台

### 3. 查看钱包交互
MetaMask 会弹出确认窗口，可以查看交易详情

### 4. 使用 React DevTools
安装 React DevTools 浏览器扩展，查看组件状态和 Props

---

## ⚙️ 配置文件说明

### 1. next.config.js - Next.js 配置

**主要配置项**:

```javascript
{
  // 图片优化
  images: {
    domains: ['ipfs.io', 'www.figma.com', ...],  // 允许的图片域名
    formats: ['image/webp', 'image/avif'],       // 图片格式
  },
  
  // 安全头配置
  headers: [
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Content-Security-Policy', value: '...' },
  ],
  
  // API 代理（开发环境）
  rewrites: [
    { source: '/api/:path*', destination: 'http://localhost:3001/api/:path*' }
  ],
  
  // Webpack 优化
  webpack: {
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: { ... },    // 第三方库单独打包
          web3: { ... },      // Web3 库单独打包
          fabric: { ... },    // Fabric.js 单独打包
        }
      }
    }
  }
}
```

**修改场景**:
- 添加新的图片域名：修改 `images.domains`
- 修改 API 代理：修改 `rewrites`
- 优化打包：修改 `webpack.optimization`

### 2. tailwind.config.ts - Tailwind CSS 配置

**主要配置项**:

```typescript
{
  // 扫描文件路径
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  
  // 主题扩展
  theme: {
    extend: {
      colors: {
        primary: { 500: '#7a2eff', 600: '#6828b0' },
        nushu: { red: '#ff6b9d', gold: '#ffd700' },
      },
      animation: {
        'brush-stroke': 'brush-stroke 0.3s ease-out',
      },
    }
  }
}
```

**设计 Token 集成**:
- 从 `tokens/index.ts` 导入设计 Token
- 自动生成 CSS 变量（`--color-primary-500` 等）
- 支持 Figma 设计同步

**修改场景**:
- 添加新颜色：修改 `theme.extend.colors`
- 添加动画：修改 `theme.extend.animation`
- 修改字体：修改 `theme.extend.fontSize`

### 3. tsconfig.json - TypeScript 配置

**主要配置项**:

```json
{
  "compilerOptions": {
    "target": "es2020",           // 编译目标
    "strict": true,               // 严格模式
    "baseUrl": ".",               // 基础路径
    "paths": {                    // 路径别名
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"]
    }
  }
}
```

**路径别名使用**:
```typescript
// 使用别名导入
import { Button } from '@/components/ui/Button';
import { useWalletModal } from '@/lib/hooks/useWalletModal';

// 而不是相对路径
import { Button } from '../../../components/ui/Button';
```

### 4. package.json - 项目依赖

**核心依赖**:

```json
{
  "dependencies": {
    // 框架
    "next": "^14.0.0",
    "react": "^18.2.0",
    
    // Web3
    "@rainbow-me/rainbowkit": "^2.0.0",
    "wagmi": "^2.0.0",
    "viem": "^2.0.0",
    
    // 状态管理
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    
    // 画布
    "fabric": "^5.3.0",
    
    // 实时协作
    "@liveblocks/client": "^1.8.0",
    "@liveblocks/react": "^1.8.0",
    
    // 监控
    "@sentry/nextjs": "^10.21.0",
    
    // 表单
    "react-hook-form": "^7.47.0",
    "zod": "^3.22.0",
    
    // 样式
    "tailwindcss": "^3.3.0",
    "framer-motion": "^10.16.0"
  }
}
```

**脚本命令**:
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
npm run lint:fix     # 自动修复代码问题
npm run type-check   # TypeScript 类型检查
npm run test         # 运行测试
npm run format       # 格式化代码
```

### 5. vitest.config.ts - 测试配置

**测试框架**: Vitest（比 Jest 更快的测试框架）

**配置项**:
```typescript
{
  test: {
    environment: 'jsdom',        // 浏览器环境模拟
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    }
  }
}
```

**运行测试**:
```bash
npm run test         # 运行一次测试
npm run test:watch   # 监听模式
npm run test:ui      # UI 界面
```

### 6. vercel.json - Vercel 部署配置

**部署配置**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_ALCHEMY_API_KEY": "@alchemy-api-key"
  }
}
```

---

## 📁 重要目录详解

### public/ - 静态资源目录

**用途**: 存放不需要编译的静态文件

**访问方式**:
```typescript
// public/images/logo.png 访问方式
<Image src="/images/logo.png" alt="Logo" />
```

**注意事项**:
- 文件直接通过 `/` 路径访问
- 不会被 Webpack 处理
- 适合存放图片、字体、robots.txt 等

### styles/ - 全局样式目录

**文件说明**:
- `figma-tokens.css` - Figma 设计 Token 生成的 CSS 变量

**使用方式**:
```css
/* 使用 Figma Token */
.button {
  background-color: var(--color-primary-500);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
}
```

### tokens/ - 设计 Token 目录

**文件**: `tokens/index.ts`

**内容**:
```typescript
export const designTokens = {
  colors: [
    { name: 'primary-500', value: '#7a2eff' },
    { name: 'nushu-red', value: '#ff6b9d' },
  ],
  spacing: [
    { name: 'sm', value: '8px' },
    { name: 'md', value: '16px' },
  ],
  typography: [
    { name: 'heading-1', fontSize: '48px', fontWeight: '700' },
  ],
}
```

**用途**:
- 统一设计规范
- 与 Figma 设计同步
- 自动生成 Tailwind 配置和 CSS 变量

### scripts/ - 脚本工具目录

**文件说明**:

1. **export-figma-assets.ts** - 导出 Figma 资源
   ```bash
   npx ts-node scripts/export-figma-assets.ts
   ```

2. **sync-figma-tokens.ts** - 同步 Figma 设计 Token
   ```bash
   npx ts-node scripts/sync-figma-tokens.ts
   ```

3. **setup-figma-integration.ts** - 设置 Figma 集成
   ```bash
   npx ts-node scripts/setup-figma-integration.ts
   ```

**使用场景**:
- 设计更新后同步到代码
- 批量导出 Figma 资源
- 自动化设计到代码的流程

### test/ - 测试目录

**目录结构**:
```
test/
├── components/      # 组件测试
├── hooks/           # Hooks 测试
├── stores/          # Store 测试
├── utils/           # 工具函数测试
├── integration/     # 集成测试
├── e2e/             # 端到端测试
└── setup.ts         # 测试配置
```

**测试示例**:
```typescript
// test/hooks/useWalletModal.test.ts
import { renderHook } from '@testing-library/react';
import { useWalletModal } from '@/lib/hooks/useWalletModal';

describe('useWalletModal', () => {
  it('should open modal', () => {
    const { result } = renderHook(() => useWalletModal());
    result.current.openModal('purchase');
    expect(result.current.modalState.isOpen).toBe(true);
  });
});
```

---

## 🎨 样式系统说明

### CSS Modules

**文件命名**: `*.module.css`

**使用方式**:
```typescript
// page.module.css
.container {
  padding: 20px;
}

// page.tsx
import styles from './page.module.css';
<div className={styles.container}>...</div>
```

**优点**:
- 自动生成唯一类名，避免冲突
- 支持组合类名
- 类型安全（TypeScript）

### Tailwind CSS

**使用方式**:
```typescript
<div className="bg-primary-500 text-white p-4 rounded-lg">
  按钮
</div>
```

**自定义类**:
```typescript
// 使用设计 Token
<div className="bg-nushu-red text-nushu-gold">
  女书主题
</div>
```

### 混合使用

```typescript
import styles from './page.module.css';

<div className={`${styles.container} bg-white shadow-lg`}>
  混合使用 CSS Modules 和 Tailwind
</div>
```

---

## 📚 相关文档

- [Next.js 文档](https://nextjs.org/docs)
- [wagmi 文档](https://wagmi.sh/)
- [RainbowKit 文档](https://www.rainbowkit.com/)
- [Zustand 文档](https://zustand-demo.pmnd.rs/)
- [Fabric.js 文档](http://fabricjs.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Vitest 文档](https://vitest.dev/)

---

## 🆘 需要帮助？

如果遇到问题：
1. 查看浏览器控制台错误信息
2. 检查 `.env.local` 配置是否正确
3. 确认后端服务是否正常运行
4. 查看 `SETUP.md` 中的故障排除部分
5. 运行 `npm run type-check` 检查类型错误
6. 运行 `npm run lint` 检查代码规范
