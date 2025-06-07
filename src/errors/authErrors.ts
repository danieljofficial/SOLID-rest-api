export class InvalidCredentialsError extends Error {
  statusCode: number;

  constructor(message = "Invalid email or password!") {
    super(message);
    this.name = "InvalidCredentialsError";
    this.statusCode = 401;
  }
}

export class UserNotFoundError extends Error {
  statusCode: number;
  constructor(message = "User not found!", statusCode = 300) {
    super(message);
    this.name = "UserNotFoundError";
    this.statusCode = statusCode;
  }
}

export class MissingPasswordError extends Error {
  statusCode: number;
  constructor(message = "Password not set for this user") {
    super(message);
    this.name = "MissingPasswordError";
    this.statusCode = 401;
  }
}
