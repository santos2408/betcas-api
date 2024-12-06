const xss = require("xss");
const yup = require("yup");

const SIGNUP_SCHEMA = "SIGNUP_SCHEMA";
const SIGNIN_SCHEMA = "SIGNIN_SCHEMA";
const RESET_PASSWORD_SCHEMA = "RESET_PASSWORD_SCHEMA";

const schemas = {
  [SIGNUP_SCHEMA]: yup.object().shape({
    email: yup.string().email("O email deve ser válido").required("O email é obrigatório"),
    password: yup.string().min(6, "A senha deve ter no mínimo 6 caracteres").required("A senha é obrigatória"),
    cpf: yup
      .string()
      .matches(/^\d{11}$/)
      .length(11, "Digite o CPF corretamente")
      .required("O CPF é obrigatório"),
  }),

  [SIGNIN_SCHEMA]: yup.object().shape({
    email: yup.string().email("O email deve ser válido").required("O email é obrigatório"),
    password: yup.string().min(6, "A senha deve ter no mínimo 6 caracteres").required("A senha é obrigatória"),
  }),

  [RESET_PASSWORD_SCHEMA]: yup.object().shape({
    email: yup.string().email("O email deve ser válido").required("O email é obrigatório"),
  }),
};

const sanitize = (values) => {
  return Object.entries(values).reduce((accumulator, item) => {
    accumulator[item[0]] = xss(item[1]);
    return accumulator;
  }, {});
};

const validate = async (values, schema) => {
  try {
    await schemas[schema].validate(values, { abortEarly: false });
    return {
      source: "validations",
      errors: null,
    };
  } catch (error) {
    const validationErrors = {};

    error.inner.forEach((error) => {
      validationErrors[error.path] = error.message;
    });

    return {
      source: "validations",
      errors: validationErrors,
    };
  }
};

module.exports = { sanitize, validate, SIGNUP_SCHEMA, SIGNIN_SCHEMA, RESET_PASSWORD_SCHEMA };
