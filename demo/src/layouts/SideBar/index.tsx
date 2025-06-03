import React, { useContext, useState } from "react";
import styles from "./index.less";
import { useHistory } from "../../../../core/libs/react-router";
import dynoIcon from "../../../assets/dyno.png";
import { DynoContext, histroy } from "../../app";
import { DynoRoute } from "../../../../core/typings";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
type SidebarProps = {
  onChange?: (updatedMenu: DynoRoute[]) => void;
  onReset?: ()=>void
};

const Sidebar: React.FC<SidebarProps> = ({ onChange,onReset=()=>{} }) => {
  const history = useHistory();
  const { dynoRoute } = useContext(DynoContext);

  const [menuData, setMenuData] = useState<DynoRoute[]>(dynoRoute);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");

  const handleEditSave = (route: DynoRoute) => {
    debugger
    const updateName = (routes: DynoRoute[]): DynoRoute[] =>
      routes.map((r) => {
        if (r.path === route.path) {
          return { ...r, name: editingValue };
        } else if (r.routes) {
          return { ...r, routes: updateName(r.routes) };
        }
        return r;
      });
    const updated = updateName(menuData);
    setMenuData(updated);
    setEditingKey(null);
    if (onChange) {
      onChange(updated); // 触发统一回调
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    
    // 如果没有目标位置或拖拽到相同位置，直接返回
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }
  
    // 深拷贝当前菜单数据
    const newMenuData = JSON.parse(JSON.stringify(menuData));
  
    // 1. 查找并移除被拖拽的节点
    let removedNode: DynoRoute | null = null;
    const removeNode = (routes: DynoRoute[], path: string): DynoRoute[] => {
      return routes.filter((route) => {
        if (route.path === path) {
          removedNode = route;
          return false;
        }
        if (route.routes) {
          route.routes = removeNode(route.routes, path);
        }
        return true;
      });
    };
  
    const menuAfterRemove = removeNode(newMenuData, draggableId);
    if (!removedNode) return;
  
    // 2. 在目标位置插入节点
    const insertNode = (
      routes: DynoRoute[],
      targetDroppableId: string,
      targetIndex: number,
      node: DynoRoute,
      currentLevel = 0,
      currentPath = "menu"
    ): DynoRoute[] => {
      const currentDroppableId = `${currentPath}-${currentLevel}`;
      
      // 如果当前是目标层级，插入节点
      if (currentDroppableId === targetDroppableId) {
        const newRoutes = [...routes];
        newRoutes.splice(targetIndex, 0, node);
        return newRoutes;
      }
  
      // 否则继续递归查找
      return routes.map((route) => {
        if (route.routes) {
          const newPath = `${currentPath}-${routes.indexOf(route)}`;
          return {
            ...route,
            routes: insertNode(
              route.routes,
              targetDroppableId,
              targetIndex,
              node,
              currentLevel + 1,
              newPath
            ),
          };
        }
        return route;
      });
    };
  
    const updatedMenu = insertNode(
      menuAfterRemove,
      destination.droppableId,
      destination.index,
      removedNode
    );
  
    setMenuData(updatedMenu);
    if (onChange) onChange(updatedMenu);
  };
  

  // 渲染菜单的地方我帮你增加个编辑按钮示例：
  const renderMenu = (
    routes: DynoRoute[],
    level = 0,
    droppableIdPrefix = "menu"
  ) => {
    return (
      <Droppable droppableId={`${droppableIdPrefix}-${level}`} type={`LEVEL-${level}`}>
        {(provided) => (
          <ul className={styles.menu} ref={provided.innerRef} {...provided.droppableProps}>
            {routes.map((route, index) => {
              if (!route.name) return null;

              return (
                <Draggable draggableId={route.path} index={index} key={route.path}>
                  {(draggableProvided) => (
                    <li
                      className={styles[`level${level}`]}
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                    >
                      <div
                        className={styles.menuItem}
                        onClick={() => {
                          if (
                            route.path &&
                            !route.redirect &&
                            !route.routes?.length &&
                            editingKey !== route.path // 编辑状态时禁止跳转
                          ) {
                            history.push(route.path);
                          }
                        }}
                        style={{
                          paddingLeft: `${16 + level * 16}px`,
                          color: histroy.location.pathname === route.path ? "#1890ff" : "",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        {editingKey === route.path ? (
                          <input
                            value={editingValue}
                            autoFocus
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={() => handleEditSave(route)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleEditSave(route);
                            }}
                            style={{ flexGrow: 1, marginRight: 8 }}
                          />
                        ) : (
                          <span style={{ flexGrow: 1 }}>{route.name}</span>
                        )}

                        {/* 编辑按钮 */}
                        {editingKey !== route.path && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingKey(route.path);
                              setEditingValue(route.name);
                            }}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#1890ff",
                              cursor: "pointer",
                            }}
                          >
                            编辑
                          </button>
                        )}
                      </div>

                      {route.routes?.length > 0 &&
                        renderMenu(route.routes, level + 1, `${droppableIdPrefix}-${index}`)}
                    </li>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    );
  };

 // 新增一级菜单函数
 const handleAddMenu = () => {
  const newMenu: DynoRoute = {
    path: `/new-menu-${Date.now()}`, // 唯一路径
    name: "新菜单",
    routes: [],
  };
  const updated = [...menuData, newMenu];
  setMenuData(updated);
  if (onChange) onChange(updated);
};

return (
  <div className={styles.sidebar}>
    <div className={styles.logo}>
      <img
        style={{ width: "100px", cursor: "pointer", userSelect: "none" }}
        onClick={() => history.push("/")}
        src={dynoIcon}
        alt="logo"
      />
    </div>

    {/* 新增按钮 */}
    <div style={{ padding: "8px 16px" }}>
      <button
        onClick={handleAddMenu}
        style={{
          width: "100%",
          padding: "6px 12px",
          cursor: "pointer",
          backgroundColor: "#1890ff",
          border: "none",
          color: "white",
          borderRadius: 4,
          fontSize: 14,
        }}
      >
        新增一级菜单
      </button>
      <button
        onClick={onReset}
        style={{
          marginTop:'10px',
          width: "100%",
          padding: "6px 12px",
          cursor: "pointer",
          backgroundColor: "#1890ff",
          border: "none",
          color: "white",
          borderRadius: 4,
          fontSize: 14,
        }}
      >
       重置
      </button>
    </div>

    <DragDropContext onDragEnd={onDragEnd}>
      {renderMenu(menuData)}
    </DragDropContext>
  </div>
);
};


export default Sidebar;
