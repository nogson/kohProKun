import * as CANNON from "cannon-es";

declare module "cannon-es" {
  interface Body {
    name?: string; // 任意のプロパティとして追加
  }
}