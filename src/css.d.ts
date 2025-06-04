// This file provides type definitions for CSS modules
declare module "*.css" {
  const content: string;
  export default content;
}

// For Tailwind CSS directives
declare module "tailwindcss" {
  const tailwindcss: unknown;
  export default tailwindcss;
}

declare module "tailwindcss/plugin" {
  const plugin: unknown;
  export default plugin;
}

declare module "@tailwindcss/postcss" {
  const postcss: unknown;
  export default postcss;
}
