import supabaseAuthErrorMessages from "../../errors/supabase-auth-error-messages.js";
import { isAuthApiError } from "../../config/database.js";
import { badRequest, ok, serverError, notFound } from "../helpers.js";

import SignUpUserUseCase from "../../use-cases/users/signup-user.js";
import validator from "validator";

export default class SignUpUserController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.body;
      const requiredFields = ["email", "password"];

      // verifica se todos os parâmetros foram passados
      for (const field of requiredFields) {
        const isAValidParam = params[field];
        const isAValidString = typeof params[field] === "string" && params[field].trim().length !== 0;

        if (!isAValidParam || !isAValidString) {
          return badRequest({ message: `Parâmetro não encontrado ou inválido: ${field}` });
        }
      }

      // verifica se todos os parâmetros atendem os requisitos
      const isAValidEmail = validator.isEmail(params.email);
      const isAValidPassword = params.password.length >= 6;

      if (!isAValidEmail) {
        return badRequest({ message: "O 'email' fornecido não é válido" });
      }

      if (!isAValidPassword) {
        return badRequest({ message: "A 'senha' deve ter no mínimo 6 caracteres" });
      }

      const signUpUserUseCase = new SignUpUserUseCase();
      const { user, session } = await signUpUserUseCase.execute(params);

      return ok({
        email: user.email,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }

      if (isAuthApiError(error)) {
        const errorMessage = supabaseAuthErrorMessages[error.code];
        return serverError({ message: errorMessage });
      }

      return serverError();
    }
  }
}
