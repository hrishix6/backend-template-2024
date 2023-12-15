export enum HttpStatus {
  NotFound = 404,
  NoContent = 204,
  Ok = 200,
  Created = 201,
  InternalServerError = 500,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  MethodNotSupported = 405,
}

export enum AppErrorCode {
  //SUCCESS
  NO_ERROR = 0,
  //SERVER
  SERVER_NOT_REACHABLE = 5000,
  SERVER_FAILURE = 5001,
  SERVER_UNSUPPORTED_OPERATION = 5002,
}

export class ServerResponse {
  public data?: any = undefined;
  public success: boolean;
  public errorCode: AppErrorCode;

  static OkResponse(data: any) {
    const response = new ServerResponse();
    response.success = true;
    response.errorCode = AppErrorCode.NO_ERROR;
    response.data = data;
    return response;
  }

  static ErrorResponse(appErrorCode: AppErrorCode) {
    const response = new ServerResponse();
    response.success = false;
    response.errorCode = appErrorCode;
    return response;
  }
}
