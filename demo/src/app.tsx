import React from "react";
import { DynoRouter, DynoRoutes } from "../..";
import styles from "./index.less";

//@ts-ignore
import splittedRoutesInfo from "../../core/loaders/dyno-split-loader.js!../../core/loaders/dyno-lazy-loader.js!../config/router.ts";
import Header from "./layouts/Header";
import Sidebar from "./layouts/SideBar";
import { createBrowserHistory } from "../../core/libs/history";

// const routesConfig: DynoRouteConfig[] = [
//     {
//         path: '/',
//         routes: [
//             {
//                 path: '/',
//                 redirect: '/home',    // 仍然保留重定向
//             },
//             {
//                 path: '/home',
//                 name: '关于',
//                 component: () => import('./pages/Home')
//             },
//             {
//                 path: '/about',
//                 name: '关于',
//                 component: () => import('./pages/About')
//             },
//         ]
//       },

// ]

// const { dynoRoute, moduleMap, } = routesSplitter(routesConfig)
const { dynoRoute, moduleMap } = splittedRoutesInfo;
console.log(splittedRoutesInfo, { dynoRoute, moduleMap });
export const histroy = createBrowserHistory();

export default function App() {
  return (
    <DynoRouter history={histroy}>
      <div className={styles.layout}>
        <Sidebar />
        <div className={styles.main}>
          <Header />
          <DynoRoutes routes={dynoRoute} moduleMap={moduleMap} lazy={true} />
        </div>
      </div>
    </DynoRouter>
  );
}
