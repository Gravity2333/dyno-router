import { DynoRoute } from '../typings';

export function changeRoutePrefix(
  route: DynoRoute,
  fromPath: string = '',
  toPath: string = '',
  set: Set<string> = new Set(),
) {
  if (route.path?.startsWith(fromPath)) {
    const childPath = route.path?.slice(fromPath?.length);
    let newPath = toPath + ( childPath?.startsWith('/') ? childPath :( '/' + childPath));
    if (set.has(newPath)) {
      newPath = newPath + '_duplice';
      set.add(newPath);
    }
    route.path = newPath;
  } else {
    const childPath = route.path;
    let newPath = toPath + (childPath?.startsWith('/') ? childPath : ('/' + childPath));
    if (set.has(newPath)) {
      newPath = newPath + '_duplice';
      set.add(newPath);
    }

    route.path = newPath?.startsWith('/') ? newPath : '/' + newPath;
  }

  if ('redirect' in route) {
    if (route.redirect?.startsWith(fromPath)) {
      const newRedirect = toPath + route.redirect?.slice(fromPath?.length);
      route.redirect = newRedirect;
    } else {
      const newRedirect = toPath + route.redirect;
      route.redirect = newRedirect;
    }
  }

  if (route.routes) {
    route.routes.forEach((routers) => {
      changeRoutePrefix(routers, fromPath, toPath, set);
    });
  }
}

/** 移除路由和子路由的前缀 */
export function removePrefix(route: DynoRoute, prefix: string = '') {
  if (prefix && route.path?.startsWith(prefix)) {
    route.path = route.path?.slice(prefix?.length);
  }

  if (route.routes) {
    route.routes.forEach((routers) => {
      removePrefix(routers, prefix);
    });
  }
}

/** 纯函数 */
export function toRemovePrefix(route: DynoRoute, prefix: string = '') {
  if (prefix && route.path?.startsWith(prefix)) {
    return route.path?.slice(prefix?.length);
  }

  return route.path;
}
