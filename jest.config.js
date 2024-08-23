/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};
// En la terminal ejecutamos el comando  npm i -D supertest @types/supertest jest @types/jest ts-jest para instalar esas dependencia y poder usar jest y supertest, y luego para crear este archivo ejecutamos el comando npx ts-jest config:init