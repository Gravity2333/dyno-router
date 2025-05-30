import { Suspense, useMemo, useRef } from "react";
import { DynoModuleMap, DynoRoute } from "./core/typings";
import createDynoRouteFromPresentationLayer from "./core/presentation/createDynoRoute";
import routesSplitter from "./core/splitter/RoutesSplitter";
import createModuleMatcher from "./core/module/createModuleMatcher";
import React from "react";
import {
  History,
} from "./core/libs/history";
import { Router } from "./core/libs/react-router";

export function DynoRouter({
  history,
  children,
}: {
  history: History;
  children?: any;
}) {
  return React.createElement(
    Router,
    {
      history,
    },
    children
  );
}

export function DynoRoutes({
  routes,
  lazy,
  moduleMap,
  notFoundPage,
  onDynoMatch,
}: {
  /** Dyno路由 */
  routes: DynoRoute[];
  /** 模块Map */
  moduleMap: DynoModuleMap;
  /** 未找到页面时提示Page */
  notFoundPage?: React.ComponentType;
  /** 是否懒加载 默认true */
  lazy?: boolean;
  /** 路由匹配到时回调 */
  onDynoMatch?: (dynoRoute: DynoRoute) => void;
}) {
  /** 参数检查 */
  const generateRoutes = useRef<any>(
    createDynoRouteFromPresentationLayer(moduleMap, {
      lazy,
      onDynoMatch,
      notFoundPage,
    })
  );

  /** 动态组件 */
  const dynoRouteComponent = useMemo(() => {
    return React.createElement(generateRoutes.current, {
      dynoRoutes: routes,
    });
  }, [routes]);

  return React.createElement(Suspense, { fallback: "loading" }, [
    dynoRouteComponent,
  ]);
}

export * from "./core/presentation/dynoPrefix";
export {
  routesSplitter,
  createDynoRouteFromPresentationLayer,
  createModuleMatcher,
};
