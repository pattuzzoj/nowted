import { HttpStatus } from "@nestjs/common";

const success = {
  SYNCHRONIZED: {
    status: "success",
    statusCode: HttpStatus.OK,
    message: "Synchronized Successfully"
  }
}

const error = {
  ENTITY_NOT_EXIST: {
    status: "error",
    statusCode: HttpStatus.NOT_IMPLEMENTED,
    message: "Entity Not Exist"
  },
  TYPE_OPERATION_NOT_EXIST: {
    status: "error",
    statusCode: HttpStatus.NOT_IMPLEMENTED,
    message: "Type Operation Not Exist"
  }
}

export const SyncMessages = {
  ...success,
  ...error
};