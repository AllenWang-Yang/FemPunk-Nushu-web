# 颜色购买功能集成文档

## 概述

颜色购买功能已完成前端和后端的集成，用户可以通过连接钱包购买颜色NFT或使用邀请码免费领取。

## 技术架构

### 1. 服务层 (lib/services/colorService.ts)

处理所有与后端API的交互：

- `getAllColors()` - 获取所有颜色列表
- `recordColorPurchase()` - 记录颜色购买到数据库
- `getUserColors()` - 获取用户拥有的颜色
- `rewardColor()` - 通过邀请码奖励颜色

### 2. Hook层 (lib/hooks/useColorPurchase.ts)

提供React hooks用于组件：

- `useColorPurchase()` - 处理颜色购买的完整流程
- `useAllColors()` - 获取所有颜色列表
- `useUserOwnedColors()` - 获取用户拥有的颜色
- `useColorPrice()` - 获取当前颜色价格

### 3. 组件层 (components/color/MintColorPage.tsx)

用户界面，集成了所有功能：

- 颜色选择器（ColorWheel）
- 购买按钮（调用合约）
- 邀请码兑换
- 用户颜色展示

## 调用流程

### 购买颜色流程

```
用户点击 "Mint Color"
    ↓
检查钱包连接状态
    ↓
调用合约 buyColor(colorId, metadataURI)
    ↓
用户在钱包确认交易
    ↓
等待交易上链
    ↓
调用后端 POST /api/colors/recordPurchase
    ↓
更新数据库
    ↓
刷新用户颜色列表
    ↓
显示购买成功
```

### 邀请码兑换流程

```
用户输入邀请码
    ↓
点击 "Free to receive"
    ↓
调用后端 POST /api/colors/reward
    ↓
后端调用合约奖励颜色
    ↓
返回交易哈希和颜色代码
    ↓
刷新用户颜色列表
    ↓
显示领取成功
```

## 环境变量配置

在 `.env.local` 中配置：

```bash
# 后端服务地址
NEXT_PUBLIC_BACKEND_URL=https://fempunk-nushu-service.onrender.com

# 颜色合约地址
NEXT_PUBLIC_COLORS_CONTRACT_ADDRESS=0x6e0b182c2a590401298ef82400Ae7a128611888A

# Alchemy API Key（可选）
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
```

## 使用示例

### 在组件中使用颜色购买

```typescript
import { useColorPurchase, useUserOwnedColors, useColorPrice } from '@/lib/hooks/useColorPurchase';

function MyComponent() {
  const { isPurchasing, purchaseColor } = useColorPurchase();
  const { colors: userColors, refetch } = useUserOwnedColors();
  const { priceInEth } = useColorPrice();

  const handlePurchase = async () => {
    await purchaseColor(colorId, metadataURI);
    refetch(); // 刷新用户颜色列表
  };

  return (
    <div>
      <p>Price: {priceInEth} ETH</p>
      <button onClick={handlePurchase} disabled={isPurchasing}>
        {isPurchasing ? 'Purchasing...' : 'Buy Color'}
      </button>
      <div>You own {userColors.length} colors</div>
    </div>
  );
}
```

### 直接调用服务

```typescript
import { getAllColors, recordColorPurchase } from '@/lib/services/colorService';

// 获取所有颜色
const colors = await getAllColors();

// 记录购买
await recordColorPurchase({
  color_id: 1,
  buyer_address: '0x...',
  tx_hash: '0x...',
  price_wei: '100000000000000',
});
```

## 错误处理

所有函数都会抛出错误，需要在调用时使用 try-catch：

```typescript
try {
  await purchaseColor(colorId, metadataURI);
} catch (error) {
  console.error('Purchase failed:', error);
  alert(`Error: ${error.message}`);
}
```

## 待优化项

1. **Metadata上传** - 当前使用临时URI，应该上传到IPFS
2. **颜色ID管理** - 应该从后端获取可用的颜色ID，而不是随机生成
3. **交易确认** - 使用 `useWaitForTransactionReceipt` 等待确认
4. **加载状态** - 添加更详细的加载和进度提示
5. **错误提示** - 使用Toast组件替代alert
6. **颜色预览** - 在购买前预览颜色效果
7. **价格动态更新** - 根据时间动态调整价格

## 测试

### 本地测试

1. 启动开发服务器：`npm run dev`
2. 连接测试网钱包（Sepolia）
3. 确保钱包有测试ETH
4. 访问 `/color` 页面
5. 选择颜色并点击购买

### 测试网信息

- Network: Sepolia
- 合约地址: 0x6e0b182c2a590401298ef82400Ae7a128611888A
- 获取测试ETH: https://sepoliafaucet.com/

## 相关文档

- [API文档](./API.md)
- [合约调用文档](./FRONTEND_CONTRACT_CALLS.md)
