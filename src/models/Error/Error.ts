import { errorName } from "../../constant/errorName";
import { httpStatus } from "../../constant/httpStatus";
import { Message } from "../../constant/message";

export class CustomError extends Error {
  /**
   *
   */
  constructor(
    public message: string,
    public statusCode: number,
    public name: string
  ) {
    super(message);
  }
}

export class InternalServerError extends CustomError {
  /**
   *
   */
  constructor(
    public message: string = Message.INTERNAL_SERVER_ERROR,
    public statusCode: number = httpStatus.INTERNAL_ERROR,
    public name: string = errorName.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode, name);
  }
}
