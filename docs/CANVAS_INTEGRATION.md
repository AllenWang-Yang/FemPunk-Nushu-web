# 画布购买功能集成文档

## 概述

画布购买功能已完成前端和后端的集成，用户可以通过连接钱包购买每日画布NFT（ERC1155），每个画布限量100个，每个钱包限购1个。

## 技术架构

### 1. 服务层 (lib/services/canvasService.ts)

处理所有与后端API的交互：

- `getAllCanvas()` - 获取当前画布
- `getCanvasByDay()` - 根据日期获取画布
- `getCanvasById()` - 根据ID获取画布
- `recordCanvasPurchase()` - 记录画布购买到数据库
- `createCanvas()` - 创建新画布（管理员）

### 2. Hook层 (lib/hooks/useCanvasPurchase.ts)

提供React hooks用于组件：

- `useCanvasPurchase()` - 处理画布购买的完整流程
- `useCurrentCanvas()` - 获取当前画布
- `useCanvasById()` - 根据ID获取画布
- `useCanvasPrice()` - 获取画布价格
- `useCanvasPurchaseInfo()` - 获取购买信息（已售/剩余）
- `useHasPurchasedCanvas()` - 检查用户是否已购买

### 3. 组件层

**CanvasPurchaseButton** (`components/canvas/CanvasPurchaseButton.tsx`)
- 智能购买按钮
- 自动检测钱包连接状态
- 显示价格和库存信息
- 处理已购买/售罄状态

**CanvasDetailModal** (`components/canvas/CanvasDetailModal.tsx`)
- 画布详情弹窗
- 显示画布信息和预览
- 集成购买按钮

**PaintPage** (`components/canvas/PaintPage.tsx`)
- 绘画页面
- 添加了购买按钮（工具栏底部）

## 调用流程

### 画布购买流程

```
用户点击 "Buy" 按钮
    ↓
打开画布详情弹窗
    ↓
显示画布信息和价格
    ↓
用户点击 "Purchase Canvas"
    ↓
检查钱包连接和购买状态
    ↓
调用合约 buyCanvas(canvasId)
    ↓
用户在钱包确认交易
    ↓
等待交易上链
    ↓
调用后端 POST /api/canvas/purchase
    ↓
更新数据库 total_raised_wei
    ↓
显示购买成功
    ↓
自动关闭弹窗
```

## 合约限制

### 购买限制
- **供应量**: 每个画布100个NFT
- **每人限购**: 1个（通过 `hasMinted` mapping 检查）
- **价格**: 从合约读取（默认 0.0018 ETH）

### 合约函数

```solidity
// 购买画布
function buyCanvas(uint256 canvasId) external payable

// 查询购买信息
function getCanvasPurchaseInfo(uint256 canvasId) 
    returns (uint256 price, uint256 minted, uint256 remaining, bool userHasMinted)

// 查询用户余额
function balanceOf(address account, uint256 id) returns (uint256)
```

## 环境变量配置

在 `.env.local` 中配置：

```bash
# 后端服务地址
NEXT_PUBLIC_BACKEND_URL=https://fempunk-nushu-service.onrender.com

# 画布合约地址
NEXT_PUBLIC_CANVAS_CONTRACT_ADDRESS=0xC23dbB6a6d2616864a813dA42eFCe4Db86867410

# Alchemy API Key（可选）
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
```

## 使用示例

### 在组件中使用画布购买

```typescript
import { useCanvasPurchase, useCanvasPrice, useHasPurchasedCanvas } from '@/lib/hooks/useCanvasPurchase';

function MyComponent() {
  const canvasId = BigInt(123456789);
  const { isPurchasing, purchaseCanvas } = useCanvasPurchase();
  const { priceInEth, price } = useCanvasPrice(canvasId);
  const { hasPurchased } = useHasPurchasedCanvas(canvasId);

  const handlePurchase = async () => {
    await purchaseCanvas(canvasId, price);
  };

  return (
    <div>
      <p>Price: {priceInEth} ETH</p>
      {hasPurchased ? (
        <p>Already purchased</p>
      ) : (
        <button onClick={handlePurchase} disabled={isPurchasing}>
          {isPurchasing ? 'Purchasing...' : 'Buy Canvas'}
        </button>
      )}
    </div>
  );
}
```

### 使用购买按钮组件

```typescript
import CanvasPurchaseButton from '@/components/canvas/CanvasPurchaseButton';

function MyPage() {
  const canvasId = BigInt(123456789);

  return (
    <CanvasPurchaseButton
      canvasId={canvasId}
      onSuccess={() => {
        console.log('Purchase successful!');
      }}
    />
  );
}
```

### 使用详情弹窗

```typescript
import CanvasDetailModal from '@/components/canvas/CanvasDetailModal';

function MyPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        View Canvas Details
      </button>
      
      <CanvasDetailModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
```

## 状态管理

### 购买按钮状态

1. **未连接钱包** - 显示 ConnectButton
2. **加载中** - 显示 "Loading..."
3. **已购买** - 显示 "✓ Already Purchased"（绿色）
4. **售罄** - 显示 "Sold Out"（灰色）
5. **可购买** - 显示价格和 "Purchase Canvas" 按钮

### 自动检测

- 钱包连接状态
- 用户是否已购买
- 剩余库存
- 画布价格

## 错误处理

所有函数都会抛出错误，组件内部已处理：

```typescript
try {
  await purchaseCanvas(canvasId, price);
} catch (error) {
  // 自动显示 alert
  console.error('Purchase failed:', error);
}
```

常见错误：
- 用户拒绝交易
- 余额不足
- 已购买过
- 画布售罄
- 网络错误

## 数据流

```
前端组件
    ↓
useCanvasPurchase Hook
    ↓
合约调用 buyCanvas(canvasId, {value: price})
    ↓
用户钱包确认
    ↓
交易上链 → 获得 tx_hash
    ↓
canvasService.recordCanvasPurchase()
    ↓
后端 POST /api/canvas/purchase
    ↓
更新数据库 total_raised_wei
    ↓
前端刷新状态
```

## 文件结构

```
lib/
├── services/
│   └── canvasService.ts         # 后端API调用
├── hooks/
│   └── useCanvasPurchase.ts     # React Hooks
└── contracts/
    └── abis/
        └── FemCanvas.ts         # 合约ABI

components/
└── canvas/
    ├── PaintPage.tsx            # 绘画页面
    ├── CanvasPurchaseButton.tsx # 购买按钮
    └── CanvasDetailModal.tsx    # 详情弹窗

docs/
├── API.md                       # 后端API文档
├── FRONTEND_CONTRACT_CALLS.md   # 合约调用文档
└── CANVAS_INTEGRATION.md        # 本文档
```

## 测试清单

- [ ] 连接钱包
- [ ] 查看画布详情
- [ ] 显示正确价格
- [ ] 显示库存信息
- [ ] 购买画布（合约调用）
- [ ] 确认交易上链
- [ ] 验证后端记录
- [ ] 检查已购买状态
- [ ] 测试重复购买（应该被阻止）
- [ ] 测试售罄状态
- [ ] 错误处理（余额不足、用户拒绝等）
- [ ] 响应式布局

## 与颜色购买的区别

| 特性 | 颜色购买 | 画布购买 |
|------|---------|---------|
| 合约类型 | ERC721 | ERC1155 |
| 供应量 | 无限（每个颜色唯一） | 100个/画布 |
| 购买限制 | 无限制 | 每人1个 |
| 价格 | 固定或动态 | 从合约读取 |
| 用途 | 绘画工具 | 收藏品 + 收益分配 |

## 下一步工作

### 收益提取功能

1. **创建服务层**
   - `lib/services/revenueService.ts`
   - 实现收益查询和提取API

2. **创建Hook层**
   - `lib/hooks/useRevenueClaim.ts`
   - 实现收益提取流程

3. **创建组件**
   - 收益查询页面
   - 提取按钮组件

## 注意事项

1. **合约地址** - 确保环境变量中的合约地址正确
2. **网络** - 确保连接到正确的网络（Sepolia测试网）
3. **Gas费用** - 确保钱包有足够的ETH支付gas
4. **交易确认** - 当前使用简单的延时，生产环境应使用事件监听
5. **限购检查** - 合约会自动检查用户是否已购买
6. **库存检查** - 前端显示剩余数量，合约会验证
