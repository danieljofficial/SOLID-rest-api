export class InvalidCredentialsError extends Error {
  constructor(message = "Invalid email or password!") {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

export class UserNotFoundError extends Error {
  constructor(message = "User not found!") {
    super(message);
    this.name = "UserNotFoundError";
  }
}

export class MissingPasswordError extends Error {
  constructor(message = "Password not set for this user") {
    super(message);
    this.name = "MissingPasswordError";
  }
}
