import { DynoModuleMap, DynoRouteConfig, DynoSplitedResult } from "../typings";
import { deepClone } from "../utils/deepClone";

function traverseRoute(dynoRouteConfig: DynoRouteConfig[], callback: any) {
  {
    dynoRouteConfig.map((route) => {
      callback(route);
      if (route.routes && route.routes?.length > 0) {
        traverseRoute(route.routes, callback);
      }
    });
  }
}

type CustomModuleId = {
  use: RegExp;
  moduleId: string;
};

function splitRouterConfig(
  dynoRouteConfigs: DynoRouteConfig[],
  routerIconMap: Record<string, any> = {},
  customModuleIds: CustomModuleId[] = []
): DynoSplitedResult {
  const displayLayer = deepClone(dynoRouteConfigs);
  const moduleMap: DynoModuleMap = {};
  traverseRoute(displayLayer, (routeConfig: any) => {
    const moduleId = routeConfig?.moduleId || routeConfig.path;
    const componentPath = routeConfig.componentPath || "";
    let matchedCustom = false;
    for (const customModuleIdConfig of customModuleIds) {
      if (componentPath.match(customModuleIdConfig.use)) {
        matchedCustom = true;
        const moduleId = customModuleIdConfig.moduleId;
        if (!moduleMap[moduleId]) {
          moduleMap[moduleId] = routeConfig.component;
        }
        routeConfig.moduleId = moduleId;
        delete routeConfig.component;
        delete routeConfig.componentPath;
      }
    }
    if (!matchedCustom && moduleId && routeConfig.component) {

      moduleMap[moduleId] = routeConfig.component;
      routeConfig.moduleId = moduleId;
      delete routeConfig.component;
    }
  });

  return {
    dynoRouteConfigs,
    dynoRoute: displayLayer,
    moduleMap,
    routerIconMap,
  };
}

/**
 *  用来切分路由配置
 * @param dynoRouteConfigs
 * @param routerIconMap
 * @param customModuleIds
 * @returns
 */
export default function routesSplitter(
  dynoRouteConfigs: DynoRouteConfig[],
  routerIconMap: Record<string, any> = {},
  customModuleIds: CustomModuleId[] = []
): DynoSplitedResult {
  return splitRouterConfig(dynoRouteConfigs, routerIconMap, customModuleIds);
}
