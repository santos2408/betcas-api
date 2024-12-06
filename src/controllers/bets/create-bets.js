import { created, badRequest, serverError } from "../helpers.js";
import CreateBetsUseCase from "../../use-cases/bets/create-bets.js";

export default class CreateBetsController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.body;
      const requiredFields = ["user_name", "user_phone", "championship_id", "round", "predictions"];

      // verifica se todos os parâmetros foram passados
      for (const field of requiredFields) {
        const isAValidParam = params[field];

        if (!isAValidParam) {
          return badRequest({ message: `Parâmetro não encontrado ou inválido: ${field}` });
        }
      }

      const createBetsUseCase = new CreateBetsUseCase();
      const { data, error } = await createBetsUseCase.execute(params);

      console.log(error);

      if (error) {
        return badRequest({ message: "Não foi possível criar a aposta, tente novamente." });
      }

      return created(data);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }
      return serverError();
    }
  }
}
