import CreateBetsController from "../controllers/bets/create-bets.js";
import GetAllBetsController from "../controllers/bets/get-all-bets.js";

const createBetsHandler = async (request, response) => {
  const createBetsController = new CreateBetsController();
  const { statusCode, body } = await createBetsController.execute(request);
  response.status(statusCode).send(body);
};

const getBetsHandler = async (request, response) => {
  const getAllBetsController = new GetAllBetsController();
  const { statusCode, body } = await getAllBetsController.execute(request);
  response.status(statusCode).send(body);
};

export { createBetsHandler, getBetsHandler };
