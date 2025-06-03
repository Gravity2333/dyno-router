import { DynoRouteConfig } from "../../core/typings";

const routesConfig: DynoRouteConfig[] = [
  {
    path: "/",
    redirect: "/home", // 仍然保留重定向
  },
  {
    path: "/home",
    name: "首页",
    component: "./pages/Home",
  },
  {
    path: "/config",
    name: "配置",
    routes: [
      {
        path: "/config",
        redirect: "/config/menu",
      },
      {
        path: "/config/menu",
        name: "菜单",
        component: "./pages/Menu",
      },
    ],
  },
  {
    path: "/about",
    name: "关于",
    component: "./pages/About",
  },
];

export default routesConfig;
