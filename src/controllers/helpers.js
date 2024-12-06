export const customError = (statusCode, body) => ({
  statusCode: statusCode,
  body,
});

export const ok = (body) => ({
  statusCode: 200,
  body,
});

export const created = (body) => ({
  statusCode: 201,
  body,
});

export const badRequest = (body) => ({
  statusCode: 400,
  body,
});

export const unauthorized = (body) => ({
  statusCode: 401,
  body,
});

export const notFound = (body) => ({
  statusCode: 404,
  body,
});

export const serverError = (
  body = {
    message: "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.",
  },
) => ({
  statusCode: 500,
  body,
});
