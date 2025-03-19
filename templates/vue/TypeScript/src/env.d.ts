/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // 在这里添加其他环境变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
