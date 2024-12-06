const asyncHandler = require("express-async-handler");
const AxiosService = require("../services/axiosService");
const { sanitize, validate, SIGNUP_SCHEMA, SIGNIN_SCHEMA } = require("../utils/validations");

const { api_football } = AxiosService;
const footballClient = api_football();
const FOOTBALL_BASE_URL = process.env.API_FOOTBALL_URL;

const supabase = require("../config/database");

const createBet = asyncHandler(async (req, res, next) => {
  const { user_id, championship_id, round_number, chosen_bets } = req.body;

  try {
    // verifica se usuário já realizou uma aposta na rodada
    const { data: userBets, error: betError } = await supabase.from("bets").select("user_id").eq("user_id", user_id).eq("round_number", round_number);

    if (betError) {
      throw betError;
    }

    if (userBets.length !== 0) {
      res.statusCode = 401;
      throw new Error("Você já fez uma aposta para essa rodada");
    }

    const { error: userError } = await supabase.from("users").select("id").eq("id", user_id).single();

    if (userError) {
      throw userError;
      // throw new Error("Não foi possível realizar a aposta, usuário não encontrado");
    }

    const betsToJSON = JSON.stringify(chosen_bets);
    const { error } = await supabase.from("bets").insert({
      user_id,
      championship_id,
      round_number,
      is_active: true,
      chosen_bets: betsToJSON,
    });

    if (error) {
      throw error;
    }

    res.status(201);
    res.json({
      success: {
        status: true,
        message: "Aposta realizada com sucesso!",
      },
      failed: null,
    });
  } catch (error) {
    next(error);
  }
});

const getResultBet = asyncHandler(async (req, res, next) => {
  const { user_id } = req.body;

  try {
    const { data, error } = await supabase.from("bets").select("*").eq("user_id", user_id).eq("is_active", true);
    const { championship_id, round_number, chosen_bets } = data[0];

    if (error) {
      throw error;
    }

    const round = await footballClient.get(`${FOOTBALL_BASE_URL}/campeonatos/${championship_id}/rodadas/${round_number}`);
    const oficialResults = round.data.partidas
      .filter((match) => {
        if (match.status !== "finalizado") {
          return false;
        }
        return true;
      })
      .map((match) => ({
        match_id: match.partida_id,
        championship_id: match.campeonato.campeonato_id,
        home_team_result: match.placar_mandante,
        away_team_result: match.placar_visitante,
      }));

    const { data: userBets, userBetError } = await supabase
      .from("bets")
      .select("chosen_bets")
      .eq("user_id", user_id)
      .eq("championship_id", championship_id)
      .eq("round_number", round_number)
      .single();

    res.json({
      oficial_results: oficialResults,
      userBets: JSON.parse(userBets.chosen_bets),
    });

    // res.status(201);
    // res.json({
    //   success: {
    //     status: true,
    //     message: "Rodada criada com sucesso!",
    //   },
    //   failed: null,
    // });
  } catch (error) {
    next(error);
  }
});

module.exports = { createBet, getResultBet };
