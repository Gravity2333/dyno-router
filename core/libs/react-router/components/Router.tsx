import React from 'react';
import { History, Location } from '../../../libs/history';
import { JSX, useEffect, useMemo, useState } from 'react';
import HistoryContext from '../contexts/HistoryContext';
import RouterContext, { RouterContextType } from '../contexts/RouterContext';
import { computeRootMatch } from '../utils';

/** 全局Router组件 */
export default function Router({
  history,
  children,
}: {
  history: History;
  children?: JSX.Element;
}) {
  /** 保存 Location */
  const [location, setLocation] = useState<Location>(history.location);

  /** Router Provider 内容 */
  const routerContextValue: RouterContextType = useMemo(() => {
    return {
      history,
      location,
      match: computeRootMatch(),
    };
  }, [location]);

  /** 对 history设置监听 */
  useEffect(() => {}, [
    history.listen((update) => {
      setLocation(update.location);

      if (location.pathname === '') {
        history.replace('/');
      }
    }),
  ]);

  return (
    <HistoryContext.Provider value={history} key={+new Date()}>
      <RouterContext.Provider value={routerContextValue}>{children}</RouterContext.Provider>
    </HistoryContext.Provider>
  );
}
