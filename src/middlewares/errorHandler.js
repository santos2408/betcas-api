import { badRequest, notFound } from "../controllers/helpers.js";

// not found
const notFoundHandler = (request, response, next) => {
  const responseError = notFound({ message: `Not found : ${request.originalUrl}` });
  response.status(responseError.statusCode);
  next(responseError);
};

// error handler
const errorHandler = (error, request, response, next) => {
  // const statusCode = response.statusCode == 200 ? 500 : response.statusCode;
  const statusCode = error.statusCode == 200 ? 500 : error.statusCode;
  response.status(statusCode).send(error.body);
};

export { notFoundHandler, errorHandler };
