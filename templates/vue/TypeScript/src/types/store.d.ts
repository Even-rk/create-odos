import "pinia";
import "vuex";

declare module "pinia" {
  export interface PiniaCustomProperties {
    // 在这里添加自定义属性
  }
}

declare module "vuex" {
  export interface Store<S> {
    // 在这里添加自定义属性
  }
}
