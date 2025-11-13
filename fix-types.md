# 类型错误修复清单

## 需要修复的文件（按优先级）

### 高优先级（阻止部署）

1. **lib/hooks/useContractWrites.ts**
   - 问题：缺少 `useChainId` hook
   - 影响：所有合约写入操作
   - 修复：添加 `import { useChainId } from 'wagmi'` 并替换所有 `chainId` 获取

2. **lib/hooks/useGasEstimation.ts**
   - 问题：缺少 `useChainId` + 地址类型不匹配
   - 影响：Gas 估算功能
   - 修复：添加 `useChainId` + 地址类型转换为 `0x${string}`

3. **lib/hooks/usePurchaseFlow.ts**
   - 问题：地址类型不匹配
   - 影响：购买流程
   - 修复：地址类型转换

4. **lib/services/dataSync.ts**
   - 问题：缺少 `useChainId`
   - 影响：数据同步
   - 修复：添加 `useChainId`

5. **lib/monitoring/performance.ts**
   - 问题：web-vitals API 变更
   - 影响：性能监控
   - 修复：更新 API 调用方式

### 中优先级（功能性问题）

6. **lib/hooks/useCollaborativeCanvas.ts**
   - 问题：CanvasOperation 类型不匹配
   - 影响：协作画布功能
   - 修复：更新操作类型定义

### 低优先级（测试文件）

7. **test/** 目录下的所有测试文件
   - 可以暂时忽略，不影响生产部署
