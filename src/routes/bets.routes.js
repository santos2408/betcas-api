import express from "express";

// handlers
import { createBetsHandler, getBetsHandler } from "../handlers/bets-handlers.js";

// middlewares
import { isAuth } from "../middlewares/isAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

// post routes
router.post("/create", isAuth, isAdmin, createBetsHandler);

// get routes
router.get("/all", isAuth, isAdmin, getBetsHandler);

export default router;
