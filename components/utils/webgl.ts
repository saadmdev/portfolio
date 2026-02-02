export type WebGLContextType = "webgl" | "webgl2";

export const supportsWebGL = (contextType: WebGLContextType = "webgl") => {
  if (typeof document === "undefined") return false;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext(contextType);
  return Boolean(context);
};
