import Experience from "./Experience/Experience";
import { isMobile } from "./common/utils.ts";
const experience = new Experience(document.querySelector("canvas.webgl"));
const body = document.querySelector("body");

if (isMobile()) {
  body?.classList.add("mobile");
}
