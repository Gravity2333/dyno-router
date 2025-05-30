/** Dyno 路由切割机 */
const {validate} = require('schema-utils')

module.exports = function (content) {
  return content;
};


function _deepClone(target) {
  // 定义一个变量
  let result;
  // 如果当前需要深拷贝的是一个对象的话
  if (typeof target === "object") {
    // 如果是一个数组的话
    if (Array.isArray(target)) {
      result = []; // 将result赋值为一个数组，并且执行遍历
      for (let i in target) {
        // 递归克隆数组中的每一项
        result.push(_deepClone(target[i]));
      }
      // 判断如果当前的值是null的话；直接赋值为null
    } else if (target === null) {
      result = null;
      // 判断如果当前的值是一个RegExp对象的话，直接赋值
    } else if (target.constructor === RegExp) {
      result = target;
    } else {
      // 否则是普通对象，直接for in循环，递归赋值对象的所有值
      result = {};
      for (let i in target) {
        result[i] = _deepClone(target[i]);
      }
    }
    // 如果不是对象的话，就是基本数据类型，那么直接赋值
  } else {
    result = target;
  }
  // 返回最终结果
  return result;
}

/** 遍历 router config */
function traverseRoute(DynoRouteConfig, callback) {
  {
    DynoRouteConfig.map((route) => {
      callback(route);
      if (route.routes && route.routes?.length > 0) {
        traverseRoute(route.routes, callback);
      }
    });
  }
}

function splitRouterConfig(
  dynoRouteConfigs=[],
  routerIconMap = {},
  customModuleIds = []
) {
  const displayLayer = _deepClone(dynoRouteConfigs);
  const moduleMap = {};
  traverseRoute(displayLayer, (routeConfig) => {
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

const schema = {
  type: "object",
  properties: {
    loader: {
      type: "object",
      properties: {
        moduleIds: {
          type: "array",
          items: {
            type: "object",
            properties: {
              test: { instanceof: "RegExp" },
              moduleId: { type: "string" },
            },
            required: ["test", "moduleId"],
            additionalProperties: false,
          },
        },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};

/** 生成展示层对象 =>  */
module.exports.pitch = function(remainingRequest){
  const options = this.getOptions();
  validate(schema, options, {
    name: "dyno-split-loader",
    baseDataPath: "options",
  });
  const customModuleIds = options.loader?.moduleIds;
  console.log(`📦 ➔ 📦 ➔📦 正在创建路由和组件层分割器`);

  return `
    import DynoRouteConfigs,{routerIconMap} from "${remainingRequest}";
    ${traverseRoute}
    ${_deepClone}
    export default (${splitRouterConfig})(DynoRouteConfigs,routerIconMap,${customModuleIds})
  `;
};
