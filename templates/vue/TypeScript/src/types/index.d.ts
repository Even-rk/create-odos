interface BuildConfig {
  outDir: string;
  assetsDir: string;
  minify: boolean;
}

interface FeaturesConfig {
  store: "vuex" | "pinia" | null;
  router: boolean;
  eslint: boolean;
  prettier: boolean;
  jsx: boolean;
  devTools: boolean;
}

interface OdosConfig {
  framework: "react" | "vue3";
  language: "javascript" | "typescript";
  features: FeaturesConfig;
  build: BuildConfig;
}

export function defineConfig(config: OdosConfig): OdosConfig;
