export enum ErrorStatusCode {
    UnknownError = 10000,
    Failure = 10002,
    ValidationError = 10003,
    Unauthorized = 10004,
    InvalidUsername = 10005,
    InvalidPassword = 10006,
    UserAlreadyExists = 10007,
    InsufficientMoney = 10008
}


export enum SuccessStatusCode {
    Success = 20000,
    SuccessfulLogin = 20001,
    SuccessfulRegistraion = 20002
}

export function getDescription(status: SuccessStatusCode | ErrorStatusCode): string {
    return status in SuccessStatusCode ? SuccessStatusCodeDescription[status] : ErrorStatusCodeDescription[status];
}

const ErrorStatusCodeDescription: { [key: number]: string } = {
    10000: "Unknown error, please try again.",
    10002: "Failed to execute operation.",
    10003: "Invalid payload format",
    10004: "Unauthorized",
    10005: "Invalid username",
    10006: "Invalid password",
    10007: "User with provided username already exists",
    10008: "Insufficient money in account",
}

const SuccessStatusCodeDescription: { [key: number]: string } = {
    20000: "Operation executed successfully.",
    20001: "Successful login",
    20002: "Successful registration"
}
