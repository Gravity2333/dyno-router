# dyno-router
# 🚀 Dyno Router

**Dyno Router** 是一个现代化的 React 路由库，支持用户可编辑的动态路由配置，兼容 `react-router` 的核心功能，并内置强大的模块化路由加载器，助你快速构建灵活、高效、可拓展的前端架构。

---

## ✨ 特性

- ⚛️ 完全兼容 React Router
- 🧩 支持动态可配置路由结构
- 📦 内置模块拆分与懒加载机制
- 🔄 支持按需加载模块（动态导入）
- 🔧 适用于 CMS、低代码平台等用户自定义路由场景

---

## 📦 安装

```bash
npm install dyno-router
yarn add dyno-router
```

## 🛠️ 基本使用
```typescript
import React from "react";
import { DynoRouter, DynoRoutes } from "dyno-router";
import { createBrowserHistory } from "dyno-router/core/libs/history";

// 路由配置 + 懒加载信息（由 loader 提供）
import splittedRoutesInfo from "dyno-router/core/loaders/dyno-split-loader.js!dyno-router/core/loaders/dyno-lazy-loader.js!./config/router";

const { dynoRoute, moduleMap } = splittedRoutesInfo;

const history = createBrowserHistory();

export default function App() {
  return (
    <DynoRouter history={history}>
      <DynoRoutes routes={dynoRoute} moduleMap={moduleMap} lazy={true} />
    </DynoRouter>
  );
}

```

## 📁 示例路由配置（router.ts）
```typescript
export default [
  {
    path: '/',
    routes: [
      {
        path: '/',
        redirect: '/home',
      },
      {
        path: '/home',
        name: '首页',
        component: () => import('../pages/Home'),
      },
      {
        path: '/about',
        name: '关于',
        component: () => import('../pages/About'),
      },
    ],
  },
];

```

## 📄 License
MIT