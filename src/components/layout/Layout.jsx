import React from "react";
import CommonNav from "./CommonNav";

const Layout = ({ children }) => {
  return (
    <div>
      <CommonNav />
      <main style={{ paddingTop: "80px" }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
