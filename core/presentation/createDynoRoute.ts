import React, { Suspense } from "react";
import { DynoComponentProps, DynoModuleMap, DynoRoute } from "../typings";
import { Route, Switch, Redirect } from "../libs/react-router-dom";
import { encodeToBase64 } from "../utils/encode";
import createModuleMatcher from "../module/createModuleMatcher";

const DynoNotFound = () => {
  const styles = {
    container: {
      textAlign: "center",
      padding: "80px 20px",
      fontFamily: "Arial, sans-serif",
      color: "#333",
    },
    title: {
      fontSize: "48px",
      marginBottom: "16px",
      fontWeight: "bold",
    },
    subtitle: {
      fontSize: "18px",
      color: "#666",
    },
  };

  return React.createElement(
    "div",
    { style: styles.container },
    React.createElement(
      "div",
      { style: styles.title },
      "404 - Dyno 未找到资源"
    ),
    React.createElement(
      "div",
      { style: styles.subtitle },
      "访问的资源不存在，请检查路径和配置！"
    )
  );
};

/**
 * 通过 PresentationLayer 创建Dyno Router
 * @param moduleMap
 * @param configOption
 * @returns
 */
export default function createDynoRouteFromPresentationLayer(
  moduleMap: DynoModuleMap,
  configOption: {
    /** 未找到页面时提示Page */
    notFoundPage?: React.ComponentType;
    /** 是否懒加载 默认true */
    lazy?: boolean;
    /** 路由匹配到时回调 */
    onDynoMatch?: (dynoRoute: DynoRoute) => void;
  }
) {
  const {
    notFoundPage = DynoNotFound,
    lazy = true,
    onDynoMatch = () => { },
  } = configOption;

  const matchModule = createModuleMatcher(moduleMap, { lazy });
  
  const DynoRoute = ({ dynoRoutes }: DynoComponentProps) => {
    const children = dynoRoutes
      .map((dynoRoute) => {
        let childRoutes: any = null;
        if (dynoRoute.routes && dynoRoute.routes?.length > 0) {
          childRoutes = React.createElement(DynoRoute, {
            dynoRoutes: dynoRoute.routes,
          });
        }

        if (dynoRoute.redirect) {
          return React.createElement(Redirect, {
            from: dynoRoute.path,
            to: dynoRoute.redirect,
            exact: true,
          } as any);
        }

        /** 通过moduleId 匹配Module */
        const matchedDynoModule = matchModule(dynoRoute.moduleId);
        console.log(matchedDynoModule,dynoRoute)
        if (matchedDynoModule) {
          /** 匹配到Module 渲染Router组件 */

          /** 处理 wrapper的情况 由于使用的是react-v5 没有outlet的概念，如果Route存在children就会忽略component */
          if (childRoutes) {
            return React.createElement(Route, {
              key: encodeToBase64(JSON.stringify(dynoRoute)),
              meta: dynoRoute,
              path: dynoRoute.path,
              exact: false,
              render: () => {
                onDynoMatch(dynoRoute);
                return React.createElement(
                  matchedDynoModule,
                  {
                    meta: dynoRoute,
                  },
                  childRoutes
                );
              },
            });
          }
       
          return React.createElement(Route, {
            key: encodeToBase64(JSON.stringify(dynoRoute)),
            meta: dynoRoute,
            path: dynoRoute.path,
            render: () => {
              onDynoMatch(dynoRoute);
              return React.createElement(
                matchedDynoModule,
                {
                  meta: dynoRoute,
                },
                childRoutes
              );
            },
          });
        } else {
          /** 没匹配到 渲染childRoutes */
          return React.createElement(
            Route,
            {
              key: encodeToBase64(JSON.stringify(dynoRoute)),
              meta: dynoRoute,
              path: dynoRoute.path,
            },
            childRoutes
          );
        }
      })
      .concat(
        React.createElement(Route, {
          key: "NOT_FOUND_PAGE" + Math.random().toString(36).substring(2, 8),
          path: "*",
          component: notFoundPage,
        })
      )

    return React.createElement(
      Switch,
      {
        meta: dynoRoutes,
      } as any,
      children
    );
  };

  return DynoRoute;
}
