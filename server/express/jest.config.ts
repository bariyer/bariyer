import { Config } from "@jest/types";

export default {
  preset: "ts-jest/presets/js-with-ts-esm",
  moduleNameMapper: {
    "^@[helpers|middlewares]$": "<rootDir>/$1",
  },
  extensionsToTreatAsEsm: [".ts"],
} as Config.InitialOptions;
