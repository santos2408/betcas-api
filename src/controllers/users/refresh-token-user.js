import { badRequest, ok, serverError, notFound } from "../helpers.js";
import RefreshTokenUserUseCase from "../../use-cases/users/refresh-token-user.js";

export default class RefreshTokenUserController {
  async execute(httpRequest) {
    try {
      const refreshToken = httpRequest.cookies.refresh_token;

      if (!refreshToken) {
        return badRequest({ message: "Token de refresh não encontrado" });
      }

      const refreshTokenUserUseCase = new RefreshTokenUserUseCase();
      const { data, error } = await refreshTokenUserUseCase.execute(refreshToken);

      if (error) {
        return badRequest({ message: "Token de refresh não encontrado ou usuário não autenticado" });
      }

      return ok({
        email: data.user.email,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }
      return serverError();
    }
  }
}
