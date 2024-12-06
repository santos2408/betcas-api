import SignUpUserController from "../controllers/users/signup-user.js";
import SignInUserController from "../controllers/users/signin-user.js";
import SignOutUserController from "../controllers/users/signout-user.js";
import RefreshTokenUserController from "../controllers/users/refresh-token-user.js";

// helper functions
const bodyWithoutRefreshToken = (body) => {
  let newBody = {};

  for (const item in body) {
    if (item === "refresh_token") {
      continue;
    }
    newBody = { ...newBody, [item]: body[item] };
  }

  return newBody;
};

const cookieOptions = {
  httpOnly: true, // Impede o acesso via JavaScript no cliente
  secure: process.env.NODE_ENV === "production", // só envia por https
  sameSite: "Strict", // Protege contra ataques CSRF
  maxAge: 72 * 60 * 60 * 1000, // 3 dias
};

const signUpHandler = async (request, response) => {
  const signUpUserController = new SignUpUserController();
  const { statusCode, body } = await signUpUserController.execute(request);
  const refreshToken = body?.refresh_token;
  const bodyData = refreshToken ? bodyWithoutRefreshToken(body) : body;

  if (refreshToken) {
    response.cookie("refresh_token", refreshToken, cookieOptions);
  }

  response.status(statusCode).send(bodyData);
};

const signInHandler = async (request, response) => {
  const signInUserController = new SignInUserController();
  const { statusCode, body } = await signInUserController.execute(request);
  const refreshToken = body?.refresh_token;
  const bodyData = refreshToken ? bodyWithoutRefreshToken(body) : body;

  if (refreshToken) {
    response.cookie("refresh_token", refreshToken, cookieOptions);
  }

  response.status(statusCode).send(bodyData);
};

const signOutHandler = async (request, response) => {
  const signOutUserController = new SignOutUserController();
  const { statusCode, body } = await signOutUserController.execute(request);

  response.clearCookie("refresh_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  response.status(statusCode).send(body);
};

const refreshTokenHandler = async (request, response) => {
  const refreshTokenAdminController = new RefreshTokenUserController();
  const { statusCode, body } = await refreshTokenAdminController.execute(request);
  const refreshToken = body?.refresh_token;
  const bodyData = refreshToken ? bodyWithoutRefreshToken(body) : body;

  if (refreshToken) {
    response.cookie("refresh_token", refreshToken, cookieOptions);
  }

  response.status(statusCode).send(bodyData);
};

export { signUpHandler, signInHandler, signOutHandler, refreshTokenHandler };
