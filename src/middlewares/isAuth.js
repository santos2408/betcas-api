import { unauthorized } from "../controllers/helpers.js";
import GetUserSessionController from "../controllers/users/get-user-session.js";

const isAuth = async (request, response, next) => {
  const cookies = request.cookies;
  const refreshToken = cookies?.refresh_token;
  const accessToken = request.headers?.authorization?.split(" ")[1];
  const hasHeaderBearerPrefix = request?.headers?.authorization?.includes("Bearer ");

  const isAuthorized = hasHeaderBearerPrefix && accessToken && refreshToken;

  if (!isAuthorized) {
    const responseError = unauthorized({ message: "Usuário não autenticado" });
    response.statusCode = responseError.statusCode;
    next(responseError);
    return;
  }

  try {
    const params = { accessToken, refreshToken };
    const getUserSessionController = new GetUserSessionController();
    const result = await getUserSessionController.execute(params); // verifica se usuário está autenticado

    if (result.statusCode !== 200) {
      throw result;
    }

    const newUserSession = result.body?.session;

    if (newUserSession) {
      response.setHeader("Authorization", `Bearer ${newUserSession.access_token}`);
      response.cookie("refresh_token", newUserSession.refresh_token, {
        httpOnly: true, // Impede o acesso via JavaScript no cliente
        secure: process.env.NODE_ENV === "production", // só envia por https
        sameSite: "Strict", // Protege contra ataques CSRF
        maxAge: 72 * 60 * 60 * 1000, // 3 dias
      });
    }

    request.user = result.body.user;
    next();
  } catch (error) {
    next(error);
    return;
  }
};

export { isAuth };
