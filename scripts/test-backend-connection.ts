/**
 * 测试后端连接脚本
 * 运行方式: npx ts-node scripts/test-backend-connection.ts
 */

const BACKEND_URL = process.env.BACKEND_URL || 'https://fempunk-nushu-service.onrender.com';

async function testBackendConnection() {
  console.log('🔍 测试后端连接...\n');
  console.log(`后端 URL: ${BACKEND_URL}\n`);

  const tests = [
    {
      name: '测试获取用户颜色',
      url: `${BACKEND_URL}/api/colors/owner/0x1234567890123456789012345678901234567890`,
      method: 'GET',
    },
    {
      name: '测试奖励颜色',
      url: `${BACKEND_URL}/api/colors/reward`,
      method: 'POST',
      body: {
        address: '0x1234567890123456789012345678901234567890',
        color_id: 'test_color_001',
      },
    },
    {
      name: '测试验证兑换码',
      url: `${BACKEND_URL}/api/redemption/validate`,
      method: 'POST',
      body: {
        code: 'TEST-CODE-1234',
      },
    },
  ];

  for (const test of tests) {
    console.log(`\n📡 ${test.name}`);
    console.log(`   URL: ${test.url}`);
    console.log(`   Method: ${test.method}`);

    try {
      const options: RequestInit = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (test.body) {
        options.body = JSON.stringify(test.body);
        console.log(`   Body: ${JSON.stringify(test.body, null, 2)}`);
      }

      const startTime = Date.now();
      const response = await fetch(test.url, options);
      const duration = Date.now() - startTime;

      console.log(`   ✅ 状态码: ${response.status} ${response.statusText}`);
      console.log(`   ⏱️  响应时间: ${duration}ms`);

      if (response.ok) {
        try {
          const data = await response.json();
          console.log(`   📦 响应数据: ${JSON.stringify(data, null, 2)}`);
        } catch (e) {
          const text = await response.text();
          console.log(`   📦 响应文本: ${text}`);
        }
      } else {
        const errorText = await response.text();
        console.log(`   ❌ 错误信息: ${errorText}`);
      }
    } catch (error) {
      console.log(`   ❌ 请求失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  console.log('\n\n✨ 测试完成！\n');
}

// 运行测试
testBackendConnection().catch(console.error);
