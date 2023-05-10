exports.a = function () {
  return "a";
};
// comment
exports.b = function () {
  return "b";
};

const c = () => {
  return 42;
};
exports.c = c;
exports.d = c;
