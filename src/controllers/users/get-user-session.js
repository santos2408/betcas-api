import { ok, serverError, unauthorized, customError } from "../helpers.js";

import GetUserSessionUseCase from "../../use-cases/users/get-user-session.js";

export default class GetUserSessionController {
  async execute(params) {
    try {
      const { accessToken, refreshToken } = params;
      const getUserSessionUseCase = new GetUserSessionUseCase();
      const userSession = await getUserSessionUseCase.execute(accessToken, refreshToken);
      return ok(userSession);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }
      return serverError();
    }
  }
}
