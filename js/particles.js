import {Inspector, Runtime} from "https://unpkg.com/@observablehq/notebook-runtime@1.0.1?module";
import notebook from "./connected_particles.js";
const renders = {
  "canvas": "#homecanvas"
};
Runtime.load(notebook, (variable) => {
  const selector = renders[variable.name];
  if (selector) {
    return new Inspector(document.querySelector(selector));
  } else {
    return true;
  }
});