import { unauthorized, serverError } from "../controllers/helpers.js";
import GetUserController from "../controllers/users/get-user.js";

const isAdmin = async (request, response, next) => {
  const ADMIN = "admin";

  try {
    const getUserController = new GetUserController();
    const result = await getUserController.execute(request);
    const [user] = result.body;

    if (user.role !== ADMIN) {
      const responseError = unauthorized({ message: "Você não é um administrador" });
      next(responseError);
    }

    next();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
    return serverError();
  }
};

export { isAdmin };
