export default class AuthorizationError extends Error {
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
  }

  /**
   * Server response
   * @param message
   * @returns
   */
  static response(message: string) {
    return { message };
  }
}
