import { Reflector } from "@nestjs/core";

export const SetMessage = Reflector.createDecorator<string>();