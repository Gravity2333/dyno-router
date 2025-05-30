/** Dyno Router 类型 */

/** Dyno Router 基础配置 */
export interface DynoRouteBase {
  path: string;
  redirect?: string;
  hideInMenu?: boolean;
  name?: string;
  icon?: string;
  layout?: boolean;
  flatMenu?: boolean;
  readonly?: boolean;
}

/**  Dyno Router 原始配置 */
export interface DynoRouteConfig extends DynoRouteBase {
  routes?: DynoRouteConfig[];
  component?: any;
}

/** Dyno模块id 实现路由配置和模块分离 */
export type DynoModuleId = string;

/** Dyno模块类型 */
export type DynoModule = any;

/** Dyno模块Map  DynoRoute => DynoModuleMap */
export type DynoModuleMap = Record<DynoModuleId, DynoModule>;

/** DynoRoute 展示层 */
export interface DynoRoute extends DynoRouteBase {
  /** Dyno子路径 */
  routes?: DynoRoute[];
  /** Dyno 模块 id */
  moduleId: DynoModuleId;
  /** 是否重定向 */
  isRedirect?: boolean;
}

/** 路由信息 */
export interface DynoSplitedResult {
  /** 展示层 presenstation配置 */
  dynoRoute: DynoRoute[];
  /** 模块 Map */
  moduleMap: DynoModuleMap;

  /** 原始配置 */
  dynoRouteConfigs: DynoRouteConfig[];
  /** iconMap */
  routerIconMap: Record<string, any>;
}

export const PAGE_LAYOUT_KEY = "PAGE_LAYOUT_KEY";

/** dyno组件props */
export interface DynoComponentProps {
  dynoRoutes: DynoRoute[];
}
