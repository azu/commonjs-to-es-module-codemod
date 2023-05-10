export const a = function () {
  return "a";
};

// comment
export const b = function () {
  return "b";
};

const c = () => {
  return 42;
};
export { c };
export { c as d };
