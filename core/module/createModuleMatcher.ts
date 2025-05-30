import React from "react";
import { DynoModuleId, DynoModuleMap } from "../typings";


export default function createModuleMatcher(
  moduleMap: DynoModuleMap,
  configOption: {
    /** 是否懒加载 默认true */
    lazy?: boolean;
  }
): (moduleId: DynoModuleId) => any {
  const { lazy = true } = configOption;

  const lazyModuleMap = new WeakMap()
  
  const _getModule = !lazy?function(moduleId: DynoModuleId){
    const matchedDynoModule = moduleMap[moduleId];
    if(!matchedDynoModule) return null
    return matchedDynoModule;
  }:function(moduleId: DynoModuleId){
    const matchedDynoModule = moduleMap[moduleId];
    if(!matchedDynoModule) return null
    /** 这里注意 需要保证lazy元素的稳定性 否则会导致unwind重复渲染 */
    if(lazyModuleMap.has(matchedDynoModule)){

      return lazyModuleMap.get(matchedDynoModule)
    }
    const lazyComp =  React.lazy(matchedDynoModule);
    lazyModuleMap.set(matchedDynoModule,lazyComp)
    return lazyComp
  }

  return _getModule;
}
