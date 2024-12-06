const asyncHandler = require("express-async-handler");
const { sanitize, validate, SIGNUP_SCHEMA, SIGNIN_SCHEMA } = require("../utils/validations");

// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");

const supabase = require("../config/database");

// const { generateToken } = require("../config/jwtToken");
// const { generateRefreshToken } = require("../config/refreshToken");
// const { validateMongodbId } = require("../utils/validatedMongodbId");

// const { sendEmail } = require("./emailController");

// const User = require("../models/userModel");

// const signupConfirm = asyncHandler(async (req, res) => {
//   const token_hash = req.query.token_hash;
//   const type = req.query.type;
//   const next = req.query.next ?? "/";

//   if (token_hash && type) {
//     const { error } = await supabase.auth.verifyOtp({
//       type,
//       token_hash,
//     });

//     if (!error) {
//       res.redirect(303, `/${next.slice(1)}`);
//     }
//   }

//   // return the user to an error page with some instructions
//   res.redirect(303, "/auth/auth-code-error");
// });

// create a user

const createUser = asyncHandler(async (req, res, next) => {
  const { email, password, cpf } = sanitize(req.body);
  const formattedCPF = cpf.replaceAll(".", "").replaceAll("-", "");
  const validatedValues = await validate({ email, password, cpf: formattedCPF }, SIGNUP_SCHEMA);

  if (validatedValues.errors) {
    res.statusCode = 400;
    console.log(validatedValues);
    throw validatedValues;
  }

  try {
    const { data: dataUser, error: errorUser } = await supabase.from("users").select("id").eq("cpf", formattedCPF);
    const alreadyRegisteredCPF = dataUser ? dataUser.length !== 0 : false;

    if (alreadyRegisteredCPF) {
      res.statusCode = 400;
      throw new Error("CPF já cadastrado");
    }

    if (errorUser) {
      throw errorUser;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });

    // res.json(signUpData, signUpError);

    if (signUpError) {
      throw signUpError;
    }

    const { error: updateError } = await supabase.from("users").update({ cpf: formattedCPF }).eq("id", signUpData.user.id);

    if (updateError) {
      throw updateError;
    }

    const refreshToken = signUpData.session.refresh_token;
    const token = signUpData.session.access_token;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "strict",
      maxAge: 72 * 60 * 60 * 1000, // 3 days
    });

    res.json({
      id: signUpData.user.id,
      email: signUpData.user.email,
      name: signUpData.user.name,
      token,
    });
  } catch (error) {
    next(error);
  }
});

// login a user
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = sanitize(req.body);
  const validatedValues = await validate({ email, password }, SIGNIN_SCHEMA);

  try {
    if (validatedValues.errors) {
      res.status(404).json(validatedValues);
      return;
    }

    // get user from supabase
    const { data: userData, error: userError } = await supabase.from("users").select("id").eq("email", email);

    if (userError) {
      throw userError;
    }

    if (!userData.length) {
      throw new Error("Email ou senha inválidos");
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      throw signInError;
    }

    const { data: user, error } = await supabase.from("users").select("*").eq("email", signInData.user.email).single();

    if (error) {
      throw error;
    }

    res.cookie("refreshToken", signInData.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "strict",
      maxAge: 72 * 60 * 60 * 1000, // 3 days
    });

    res.json({
      id: user.id,
      email: user.email,
      name: user.name !== "n/a" ? user.name : "",
      // phone: user.name !== "n/a" ? user[0].name : "",
      token: signInData.session.access_token,
    });
  } catch (error) {
    next(error);
  }
});

// // login admin
// const loginAdmin = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   // check if user exists or not
//   const findAdmin = await User.findOne({ email });

//   if (findAdmin.role !== "admin") {
//     throw new Error("Not Authorised");
//     return;
//   }

//   const isPasswordMatched = findAdmin ? await findAdmin.isPasswordMatched(password) : false;

//   if (findAdmin && isPasswordMatched) {
//     const refreshToken = generateRefreshToken(findAdmin?._id);
//     const updateUser = await User.findByIdAndUpdate(findAdmin._id, { refreshToken }, { new: true });

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: false, // true in production
//       maxAge: 72 * 60 * 60 * 1000,
//     });
//     res.json({
//       _id: findAdmin?._id,
//       firstname: findAdmin?.firstname,
//       lastname: findAdmin?.lastname,
//       email: findAdmin?.email,
//       mobile: findAdmin?.mobile,
//       token: generateToken(findAdmin?._id),
//     });
//   } else {
//     throw new Error("Invalid credentials");
//   }
// });

// lougout a user
const logoutUser = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  const noRefreshToken = !cookies?.refreshToken;

  // if (noRefreshToken) {
  //   throw new Error("No refresh token in cookies");
  // }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
  });

  res.status(200).json({
    success: {
      status: true,
      message: "Desconectado com sucesso!",
    },
    failed: null,
  });
});

// // handle refresh token
const getSession = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  const refresh_token = cookies?.refreshToken;
  const hasHeaderBearerPrefix = req?.headers?.authorization?.includes("Bearer ");

  if (!refresh_token) {
    res.statusCode = 401;
    throw new Error("Usuário não autenticado");
  }

  if (hasHeaderBearerPrefix) {
    const currentToken = req?.headers?.authorization.split(" ")[1];

    if (currentToken) {
      try {
        const { data, error: invalidToken } = await supabase.auth.getUser(currentToken);

        if (invalidToken) {
          const { data: refreshedSession, error: invalidRefreshSession } = await supabase.auth.refreshSession({ refresh_token });

          if (invalidRefreshSession) {
            throw invalidRefreshSession;
            // res.statusCode = 401;
            // throw new Error("Sessão inválida, usuário não autenticado");
          }

          const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", refreshedSession.user.id).single();

          if (userError) {
            throw userError;
            // res.statusCode = 401;
            // throw new Error("Erro interno do servidor");
          }

          res.cookie("refreshToken", refreshedSession.session.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: "strict",
            maxAge: 72 * 60 * 60 * 1000, // 3 dayz
          });

          return res.status(200).json({
            id: user.id,
            name: user.name !== "n/a" ? user.name : "",
            email: user.email,
            token: refreshedSession.session.access_token,
            // phone: user.phone !== "n/a" ? user.phone : "",
          });
        }

        const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", data.user.id).single();

        res.status(200).json({
          id: user.id,
          name: user.name !== "n/a" ? user.name : "",
          email: user.email,
          token: currentToken,
          // phone: user.phone !== "n/a" ? user.phone : "",
        });
      } catch (error) {
        next(error);
      }
    } else {
      res.statusCode = 401;
      throw new Error("Token não fornecido, usuário não autenticado");
    }
  } else {
    res.statusCode = 401;
    throw new Error("Falha ao obter a sessão");
  }
});

// // get all users
// const getAllUsers = asyncHandler(async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// // get a single user
// const getUser = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongodbId(id);

//   try {
//     const user = await User.findById(id);
//     res.json({ user });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// // update a user
// const updateUser = asyncHandler(async (req, res) => {
//   const { id } = req.user;
//   validateMongodbId(id);

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       {
//         firstname: req?.body?.firstname,
//         lastname: req?.body?.lastname,
//         email: req?.body?.email,
//         mobile: req?.body?.mobile,
//       },
//       {
//         new: true,
//       },
//     );
//     res.json({ updatedUser });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// // delete a single user
// const deleteUser = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongodbId(id);

//   try {
//     const deletedUser = await User.findByIdAndDelete(id);
//     res.json({ deletedUser });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// // block a user
// const blockUser = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongodbId(id);

//   try {
//     const blockedUser = await User.findByIdAndUpdate(
//       id,
//       {
//         isBlocked: true,
//       },
//       {
//         new: true,
//       },
//     );

//     if (!blockedUser) {
//       throw new Error("User not found");
//       return;
//     }

//     res.json({
//       message: "User Blocked",
//     });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// // unblock a user
// const unblockUser = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongodbId(id);

//   try {
//     const unblockedUser = await User.findByIdAndUpdate(
//       id,
//       {
//         isBlocked: false,
//       },
//       {
//         new: true,
//       },
//     );
//     res.json({
//       user: `${unblockedUser.firstname} ${unblockedUser.lastname}`,
//       message: `User Unblocked`,
//     });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const updatePassword = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const { password } = req.body;

//   validateMongodbId(_id);

//   const user = await User.findById(_id);

//   if (password) {
//     user.password = password;
//     const updatePassword = await user.save();
//     res.json(updatePassword);
//   } else {
//     res.json(user);
//   }
// });

// const forgotPasswordToken = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new Error("User not found with this email");
//   }

//   try {
//     const token = await user.createPasswordResetToken();
//     await user.save();
//     const resetUrl = `Hi, please fallow this link to reset your password. This link is valid till 10 minutes from now <a href="http://localhost:4000/api/user/reset-password/${token}">Click here</a>`;
//     const data = {
//       to: email,
//       text: "Hey User",
//       subject: "Forgot Password Link",
//       html: resetUrl,
//     };
//     sendEmail(data);
//     res.json(token);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const resetPassword = asyncHandler(async (req, res) => {
//   const { password } = req.body;
//   const { token } = req.params;
//   const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });

//   if (!user) {
//     throw new Error("Token expired, please try again later");
//   }

//   user.password = password;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;

//   await user.save();
//   res.json(user);
// });

// const getWishlist = asyncHandler(async (req, res) => {
//   //
// });

// module.exports = {
//   createUser,
//   loginUser,
//   logoutUser,
//   getAllUsers,
//   getUser,
//   deleteUser,
//   updateUser,
//   blockUser,
//   unblockUser,
//   handleRefreshToken,
//   updatePassword,
//   forgotPasswordToken,
//   resetPassword,
//   loginAdmin,
// };

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getSession,
};
