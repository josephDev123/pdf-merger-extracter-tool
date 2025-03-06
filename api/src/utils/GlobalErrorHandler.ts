export class GlobalError extends Error {
  operational: boolean;
  statusCode: number;
  name: string;
  constructor(
    name: string,
    message: string,
    statusCode: number,
    operational: boolean
  ) {
    super(message);
    // this.name = new.target.name; // Ensures correct class name in case of inheritance
    this.name = name;
    this.statusCode = statusCode;
    this.operational = operational;
    Error.captureStackTrace?.(this, this.constructor);
  }
}
