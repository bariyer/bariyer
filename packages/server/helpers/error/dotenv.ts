export default class DotEnvError extends Error {
  constructor(key: string) {
    super(`${key} enviroment variable must be declared`);
  }
}
