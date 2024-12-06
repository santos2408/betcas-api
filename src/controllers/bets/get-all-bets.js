import { ok, badRequest, serverError } from "../helpers.js";
import GetAllBetsUseCase from "../../use-cases/bets/get-all-bets.js";

export default class GetAllBetsController {
  async execute(httpRequest) {
    try {
      const getAllBetsUseCase = new GetAllBetsUseCase();
      const { data, error } = await getAllBetsUseCase.execute();

      if (error) {
        return badRequest({ message: "Não foi possível obter todas as apostas." });
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
