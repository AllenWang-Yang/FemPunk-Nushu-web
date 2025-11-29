# 颜色购买功能实现总结

## 已完成的工作

### 1. 服务层 (Service Layer)

**文件**: `lib/services/colorService.ts`

创建了完整的颜色服务API封装：
- ✅ 获取所有颜色列表
- ✅ 记录颜色购买到数据库
- ✅ 获取用户拥有的颜色
- ✅ 邀请码奖励颜色

### 2. Hook层 (Hook Layer)

**文件**: `lib/hooks/useColorPurchase.ts`

创建了4个React Hooks：
- ✅ `useColorPurchase()` - 完整的购买流程（合约调用 + 后端记录）
- ✅ `useAllColors()` - 获取所有颜色
- ✅ `useUserOwnedColors()` - 获取用户颜色（自动刷新）
- ✅ `useColorPrice()` - 从合约读取价格

### 3. 组件更新 (Component Update)

**文件**: `components/color/MintColorPage.tsx`

更新了颜色页面：
- ✅ 集成颜色购买功能
- ✅ 实时显示合约价格
- ✅ 购买按钮状态管理（loading/disabled）
- ✅ 邀请码兑换功能
- ✅ 用户颜色列表展示（从后端获取）
- ✅ 错误处理和用户提示

### 4. 配置文件

**文件**: `.env.local`

已配置的环境变量：
- ✅ 后端服务地址
- ✅ 颜色合约地址
- ✅ Alchemy API Key

## 调用逻辑图

```
┌─────────────────────────────────────────────────────────────┐
│                     用户界面 (UI)                            │
│                  MintColorPage.tsx                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ├─── 选择颜色 (ColorWheel)
                     │
                     ├─── 点击购买按钮
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Hook 层 (Hooks)                            │
│              useColorPurchase.ts                            │
└────────────┬───────────────────────┬────────────────────────┘
             │                       │
             │ 1. 调用合约           │ 2. 记录到后端
             ▼                       ▼
┌──────────────────────┐   ┌──────────────────────────────────┐
│   智能合约 (Chain)    │   │    服务层 (Service)              │
│   FemColors.sol      │   │    colorService.ts               │
│                      │   │                                  │
│  buyColor()          │   │  recordColorPurchase()           │
│  - 验证支付          │   │  - 更新数据库                     │
│  - 转移NFT           │   │  - 记录交易哈希                   │
│  - 返回tx_hash       │   │                                  │
└──────────────────────┘   └─────────────┬────────────────────┘
                                         │
                                         ▼
                           ┌──────────────────────────────┐
                           │   后端API (Backend)          │
                           │   POST /api/colors/          │
                           │   recordPurchase             │
                           └──────────────────────────────┘
```

## 关键代码片段

### 购买颜色

```typescript
// 在组件中
const { isPurchasing, purchaseColor } = useColorPurchase();

const handlePurchase = async () => {
  await purchaseColor(colorId, metadataURI);
};

// Hook内部实现
const purchaseColor = async (colorId, metadataURI) => {
  // 1. 调用合约
  const hash = await writeContractAsync({
    address: COLOR_CONTRACT_ADDRESS,
    abi: FemColorsABI,
    functionName: 'buyColor',
    args: [BigInt(colorId), metadataURI],
    value: colorPrice,
  });
  
  // 2. 等待确认
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // 3. 记录到后端
  await recordColorPurchase({
    color_id: colorId,
    buyer_address: address,
    tx_hash: hash,
    price_wei: colorPrice.toString(),
  });
};
```

### 获取用户颜色

```typescript
const { colors, refetch } = useUserOwnedColors();

// 自动从后端获取
// GET /api/colors/owner/:address
```

## 数据流

```
前端选择颜色
    ↓
调用合约 buyColor(colorId, metadataURI, {value: price})
    ↓
用户钱包确认
    ↓
交易上链 → 获得 tx_hash
    ↓
调用后端 POST /api/colors/recordPurchase
    ↓
后端更新数据库
    ↓
前端刷新用户颜色列表
    ↓
显示购买成功
```

## 文件结构

```
lib/
├── services/
│   └── colorService.ts          # 后端API调用
├── hooks/
│   └── useColorPurchase.ts      # React Hooks
└── contracts/
    └── abis/
        └── FemColors.ts         # 合约ABI

components/
└── color/
    ├── MintColorPage.tsx        # 颜色页面
    └── ColorWheel.tsx           # 颜色选择器

docs/
├── API.md                       # 后端API文档
├── FRONTEND_CONTRACT_CALLS.md   # 合约调用文档
└── COLOR_INTEGRATION.md         # 集成文档
```

## 下一步工作

### 画布购买功能

按照相同的模式实现：

1. **创建服务层**
   - `lib/services/canvasService.ts`
   - 实现画布相关的API调用

2. **创建Hook层**
   - `lib/hooks/useCanvasPurchase.ts`
   - 实现画布购买流程

3. **更新组件**
   - 在画布详情页添加购买按钮
   - 集成购买功能

4. **收益提取功能**
   - `lib/hooks/useRevenueClaim.ts`
   - 实现收益查询和提取

## 测试清单

- [ ] 连接钱包
- [ ] 选择颜色
- [ ] 购买颜色（合约调用）
- [ ] 确认交易上链
- [ ] 验证后端记录
- [ ] 刷新用户颜色列表
- [ ] 邀请码兑换
- [ ] 错误处理（余额不足、用户拒绝等）
- [ ] 价格显示正确
- [ ] 响应式布局

## 注意事项

1. **合约地址** - 确保环境变量中的合约地址正确
2. **网络** - 确保连接到正确的网络（Sepolia测试网）
3. **Gas费用** - 确保钱包有足够的ETH支付gas
4. **交易确认** - 当前使用简单的延时，生产环境应使用事件监听
5. **Metadata** - 当前使用临时URI，应该上传到IPFS
