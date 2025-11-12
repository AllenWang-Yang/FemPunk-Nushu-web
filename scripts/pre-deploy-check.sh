#!/bin/bash

echo "🚀 FemPunk Nushu - 部署前检查"
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查计数
PASSED=0
FAILED=0

# 1. 检查 Node.js 版本
echo -e "\n📦 检查 Node.js 版本..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 18 ]; then
    echo -e "${GREEN}✓${NC} Node.js 版本: $(node -v)"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Node.js 版本过低，需要 >= 18"
    ((FAILED++))
fi

# 2. 检查依赖安装
echo -e "\n📚 检查依赖..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} 依赖已安装"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} 依赖未安装，正在安装..."
    npm install
fi

# 3. 检查环境变量文件
echo -e "\n🔐 检查环境变量..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local 存在"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} .env.local 不存在，请创建并配置环境变量"
    ((FAILED++))
fi

# 4. 检查 .gitignore
echo -e "\n📝 检查 .gitignore..."
if grep -q ".env.local" .gitignore; then
    echo -e "${GREEN}✓${NC} .env.local 已在 .gitignore 中"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} .env.local 未在 .gitignore 中"
    ((FAILED++))
fi

# 5. 运行 TypeScript 类型检查
echo -e "\n🔍 运行类型检查..."
if npm run type-check > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} TypeScript 类型检查通过"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} TypeScript 类型检查有警告"
fi

# 6. 运行 Lint
echo -e "\n🧹 运行代码检查..."
if npm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} ESLint 检查通过"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} ESLint 检查有警告"
fi

# 7. 尝试构建
echo -e "\n🏗️  尝试构建项目..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} 构建成功"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} 构建失败，请检查错误"
    ((FAILED++))
fi

# 8. 检查图片资源
echo -e "\n🖼️  检查图片资源..."
if [ -d "public/images/homepage" ]; then
    IMAGE_COUNT=$(find public/images/homepage -type f | wc -l)
    echo -e "${GREEN}✓${NC} 找到 $IMAGE_COUNT 个图片文件"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} public/images/homepage 目录不存在"
fi

# 总结
echo -e "\n================================"
echo -e "检查完成: ${GREEN}$PASSED 通过${NC}, ${RED}$FAILED 失败${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✓ 准备就绪，可以部署！${NC}"
    echo -e "\n下一步："
    echo "1. 提交代码到 Git: git add . && git commit -m 'Ready for deployment'"
    echo "2. 推送到远程仓库: git push"
    echo "3. 在 Vercel 导入项目并配置环境变量"
    exit 0
else
    echo -e "\n${RED}✗ 请修复上述问题后再部署${NC}"
    exit 1
fi
