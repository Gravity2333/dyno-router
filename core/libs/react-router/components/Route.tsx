import { History, Location } from '../../../libs/history';
import React from 'react';
import { useContext, useMemo } from 'react';
import RouterContext, { RouterContextType } from '../contexts/RouterContext';
import { Match, RouteInputType, RouteProps } from '../typings';
import { matchPath } from '../utils';

/** Route组件 */
export default function Route({
  meta,
  path,
  component,
  render,
  children,
  sensitive = false,
  exact = false,
  computedMatch,
}: RouteProps) {
  const routerContext = useContext(RouterContext);
  /** 计算当前组件是否匹配 */
  const match = computedMatch
    ? computedMatch
    : !!path
    ? matchPath(path, routerContext?.location?.pathname, {
        sensitive,
        exact,
      })
    : routerContext.match;

  return !!match ? (
    <RouteCore
      meta={meta}
      history={routerContext.history}
      match={match}
      location={routerContext.location}
      render={render}
      component={component}
    >
      {children}
    </RouteCore>
  ) : null;
}

/** 匹配到之后，负责渲染逻辑 */
function RouteCore({
  meta,
  match,
  location,
  history,
  render,
  component,
  children,
}: {
  match: Match;
  location: Location;
  history: History;
  render?: RouteProps['render'];
  component?: RouteProps['component'];
  children?: RouteProps['children'];
  meta?: RouteProps['meta'];
}) {

  const NewRouterContextValue: RouterContextType = useMemo(() => {
    return {
      history,
      match,
      location,
      meta,
    };
  }, []);

  const routeInputProps: RouteInputType = useMemo(() => {
    return {
      match,
      location,
      meta,
    };
  }, []);

  /** 渲染内容 */
  let renderContext =
    typeof children === 'function' ? (children as any)(routeInputProps) : children;

  /** 如果有 component则覆盖 */
  if (component) {
    renderContext = React.createElement(component, routeInputProps as any);
  }

  /** 如果有render则覆盖 */
  if (render) {
    renderContext = render(routeInputProps);
  }

  return (
    <RouterContext.Provider value={NewRouterContextValue}>{renderContext}</RouterContext.Provider>
  );
}
