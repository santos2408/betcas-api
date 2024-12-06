import { badRequest, ok, serverError, notFound } from "../helpers.js";
import SignOutUserUseCase from "../../use-cases/users/signout-user.js";

export default class SignOutUserController {
  async execute(httpRequest) {
    try {
      const refreshToken = httpRequest.cookies.refresh_token;

      if (!refreshToken) {
        return badRequest({ message: "Token de refresh não encontrado" });
      }

      const signOutUserUseCase = new SignOutUserUseCase();
      const { error } = await signOutUserUseCase.execute();

      if (error) {
        return badRequest({ message: "Token de refresh não encontrado ou usuário não autenticado" });
      }

      return ok({
        message: "Logout realizado com sucesso!",
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }
      return serverError();
    }
  }
}
