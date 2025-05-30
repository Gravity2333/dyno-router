// src/pages/Home/index.tsx
import React from 'react';
import styles from './index.less';

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dyno Router</h1>
        <p className={styles.subtitle}>
          为现代 React 应用打造的动态路由解决方案
        </p>
        <p className={styles.description}>
          Dyno Router 是一个支持用户可编辑路由的 React 路由库，兼容 React Router，内置路由导入加载器，助你快速搭建灵活的前端架构。
        </p>
        <div className={styles.buttons}>
          <button className={styles.primary}>快速开始</button>
          <button className={styles.secondary}>查看文档</button>
        </div>
      </header>
    </div>
  );
};

export default Home;
