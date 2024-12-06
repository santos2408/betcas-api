import { badRequest, ok, serverError, notFound } from "../helpers.js";
import SignInUserUseCase from "../../use-cases/users/signin-user.js";
import validator from "validator";

export default class SignInUserController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.body;
      const requiredFields = ["email", "password"];

      for (const field of requiredFields) {
        const isAValidParam = params[field];
        const isAValidString = typeof params[field] === "string" && params[field].trim().length !== 0;

        if (!isAValidParam || !isAValidString) {
          return badRequest({ message: `Parâmetro não encontrado ou inválido: ${field}` });
        }
      }

      const isAValidEmail = validator.isEmail(params.email);
      const isAValidPassword = params.password.length >= 6;

      if (!isAValidEmail) {
        return badRequest({ message: "O 'email' fornecido não é válido" });
      }

      if (!isAValidPassword) {
        return badRequest({ message: "A 'senha' deve ter no mínimo 6 caracteres" });
      }

      const signInUserUseCase = new SignInUserUseCase();
      const { data, error } = await signInUserUseCase.execute(params);

      if (error) {
        return notFound({ message: "Usuário não encontrado" });
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
