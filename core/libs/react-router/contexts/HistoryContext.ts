import { History } from '../../../libs/history';
import { createContext } from "react"

/** histiory上下文 用来提供history */
 const HistoryContext = createContext<History>({} as History)

 export default HistoryContext