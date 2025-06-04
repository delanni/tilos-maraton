/// <reference types="vite/client" />

// This file provides type information for CSS modules
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.less" {
  const classes: { [key: string]: string };
  export default classes;
}

// For CSS files without modules
declare module "*.css";
declare module "*.scss";
declare module "*.sass";
declare module "*.less";
