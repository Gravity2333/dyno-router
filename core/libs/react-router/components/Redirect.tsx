import { useContext, useEffect } from 'react';
import HistoryContext from '../contexts/HistoryContext';

type RedirectProps = {
  from?: string;
  to: string;
  push: boolean;
};
/** 重定向组件 */
export default function Redirect({ to, push = false }: RedirectProps) {

  const history = useContext(HistoryContext);
  const redirectFn = push ? history.push : history.replace;

  useEffect(() => {
    redirectFn(to);
  }, []);

  return null;
}
