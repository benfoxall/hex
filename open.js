import __SNOWPACK_ENV__ from './__snowpack__/env.js';
import.meta.env = __SNOWPACK_ENV__;

console.log("open", import.meta);

export const open = (data) => {
  console.log("Open!!", data);
};

export default open;
