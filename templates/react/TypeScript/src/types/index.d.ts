interface BuildConfig {
  outDir: string;
  assetsDir: string;
  minify: boolean;
}

interface FeaturesConfig {
  store: 'redux' | 'mobx' | null;
  router: boolean;
  eslint: boolean;
  prettier: boolean;
  devTools: boolean;
}

interface OdosConfig {
  framework: 'react' | 'vue3';
  language: 'javascript' | 'typescript';
  features: FeaturesConfig;
  build: BuildConfig;
}

export function defineConfig(config: OdosConfig): OdosConfig; 