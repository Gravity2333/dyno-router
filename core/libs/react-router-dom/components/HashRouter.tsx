import React, { JSX } from 'react';
import { createHashHistory } from '../../../libs/history';
import { Router } from '../../../libs/react-router';

export default function HashRouter({ children }: { children?: JSX.Element }) {
  const history = createHashHistory();
  return <Router history={history}>{children}</Router>;
}
