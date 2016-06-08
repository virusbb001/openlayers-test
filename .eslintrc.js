module.exports = {
 "globals": {
  "ol": true,
  "Vue": true
 },
 "env": {
  "browser": true,
  "es6": true
 },
 "extends": "eslint:recommended",
 "installedESLint": true,
 "parserOptions": {
  "ecmaFeatures": {
   "experimentalObjectRestSpread": true,
   "jsx": true
  },
  "sourceType": "module"
 },
 "plugins": [
  "react"
 ],
 "rules": {
  "indent": [
   "error",
   2,
   {
    "VariableDeclarator": {
     "var": 2,
     "let": 2,
     "const": 3
    }
   }
  ],
  "linebreak-style": [
   "error",
   "unix"
  ],
  "quotes": [
   "error",
   "double"
  ],
  "semi": [
   "error",
   "always"
  ],
  "react/jsx-uses-vars": 1
 }
};
