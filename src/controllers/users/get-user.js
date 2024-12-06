import { badRequest, ok, serverError, notFound } from "../helpers.js";
import validator from "validator";
import GetUserUseCase from "../../use-cases/users/get-user.js";

export default class GetUserController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.user;
      const userId = params.id;

      if (!userId) {
        return badRequest({ message: "O parâmetro 'id' não foi encontrado" });
      }

      const isAValidId = validator.isUUID(userId);

      if (!isAValidId) {
        return badRequest({ message: "O parâmetro 'id' não é válido" });
      }

      const getUserUseCase = new GetUserUseCase();
      const data = await getUserUseCase.execute({ id: userId });

      if (data.length === 0) {
        return badRequest({ message: "Usuário não encontrado." });
      }

      return ok(data);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }
      return serverError();
    }
  }
}
