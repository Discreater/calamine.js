export class CalamineError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "CalamineError";
  }
}

export class CalamineNotImplementedError extends CalamineError {
  public constructor(message: string) {
    super(message);
    this.name = "CalamineNotImplementedError";
  }
}
