import React, { createContext, useState } from "react";
import { DynoRouter, DynoRoutes } from "../..";
import styles from "./index.less";
//@ts-ignore
import splittedRoutesInfo from "../../core/loaders/dyno-split-loader.js!../../core/loaders/dyno-lazy-loader.js!../config/router.ts";
import Header from "./layouts/Header";
import Sidebar from "./layouts/SideBar";
import { createBrowserHistory } from "../../core/libs/history";
import { DynoRoute } from "../../core/typings";

const DYNO_STOREAGE_KEY = "__DYNO_STOREAGE_KEY__";

const { dynoRoute, moduleMap } = splittedRoutesInfo;
console.log(splittedRoutesInfo, { dynoRoute, moduleMap });
export const histroy = createBrowserHistory();
export const DynoContext = createContext<{
  dynoRoute: DynoRoute[];
}>({ dynoRoute });

export default function App() {
  const [currentRoutes, setCurrentRoutes] = useState<DynoRoute[]>(() => {
    const storagedRoutes = localStorage.getItem(DYNO_STOREAGE_KEY);
    if (!storagedRoutes) {
      return dynoRoute;
    } else {
      return JSON.parse(storagedRoutes);
    }
  });

  return (
    <DynoContext.Provider value={{ dynoRoute: currentRoutes }}>
      <DynoRouter history={histroy}>
        <div className={styles.layout}>
          <Sidebar
            onChange={(e: DynoRoute[]) => {
              setCurrentRoutes(e);
              localStorage.setItem(DYNO_STOREAGE_KEY, JSON.stringify(e));
            }}
            onReset={()=>{
              localStorage.removeItem(DYNO_STOREAGE_KEY)
              setCurrentRoutes(dynoRoute)
            }}
          />
          <div className={styles.main}>
            <Header />
            <DynoRoutes routes={dynoRoute} moduleMap={moduleMap} lazy={true} />
          </div>
        </div>
      </DynoRouter>
    </DynoContext.Provider>
  );
}
