import React, { useContext } from "react";
import styles from "./index.less";
import { useHistory } from "../../../../core/libs/react-router";
import dynoIcon from "../../../assets/dyno.png";

const Sidebar = () => {
  const histroy = useHistory();

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <img
          style={{ width: "100px", cursor: "pointer", userSelect: "none" }}
          onClick={() => {
            histroy.push("/");
          }}
          src={dynoIcon}
        />
      </div>
      <ul className={styles.menu}>
        <li
          onClick={() => {
            histroy.push("/home");
          }}
        >
          首页
        </li>
        <li
          onClick={() => {
            histroy.push("/about");
          }}
        >
          关于
        </li>
        <li>设置</li>
      </ul>
    </div>
  );
};

export default Sidebar;
