import React from "react";

import $ from "./Loading.module.css";

const Loading = () => {
  return (
    <Image
      className={styles.posCenter}
      src={require("../../../assets/rocket.gif")}
      alt="Loading"
      width="200"
      height="200"
    />
  );
};

export default Loading;
