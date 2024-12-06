const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
const { sanitize, validate, SIGNUP_SCHEMA, SIGNIN_SCHEMA } = require("../utils/validations");
const AxiosService = require("../services/axiosService");

const supabase = require("../config/database");

// dotenv.config();

const { api_football } = AxiosService;
const footballClient = api_football();
const FOOTBALL_BASE_URL = process.env.API_FOOTBALL_URL;

const checkIfRoundExists = async (id, currentRound) => {
  const { data: existingRound, error: existingRoundError } = await supabase
    .from("rounds")
    .select("*")
    .eq("championship_id", id)
    .eq("round_number", currentRound);

  return { existingRound, existingRoundError };
};

const createChampionship = asyncHandler(async (req, res, next) => {
  const { championship_id, name, season } = req.body;

  try {
    const { data: existingChampionship, error: existingChampionshipError } = await supabase
      .from("championships")
      .select("*")
      .eq("api_id", championship_id)
      .eq("season", season);

    if (existingChampionshipError) {
      res.statusCode = 401;
      throw existingChampionshipError;
    }

    if (existingChampionship.length !== 0) {
      res.statusCode = 401;
      throw new Error("Já existe um campeonato dessa temporada cadastrado");
    }

    const { error } = await supabase.from("championships").insert({ api_id: championship_id, name, season });

    if (error) {
      res.statusCode = 401;
      throw error;
    }

    res.status(200).json({
      success: {
        status: true,
        message: "Campeonato criado com sucesso!",
      },
      failed: null,
    });
  } catch (error) {
    next(error);
  }
});

const createRound = asyncHandler(async (req, res, next) => {
  try {
    const { data: championships, championshipsError } = await supabase.from("championships").select("*");
    const { id, api_id } = championships[0];

    const response = await footballClient.get(`${FOOTBALL_BASE_URL}/campeonatos/${api_id}/`);
    const currentRound = response.data.rodada_atual.rodada;

    // obtém o API_ID de todos os campeonatos cadastrados
    const { existingRound, existingRoundError } = await checkIfRoundExists(id, currentRound);
    const roundExists = existingRound.length !== 0;

    if (existingRoundError) {
      res.statusCode = 401;
      throw existingRoundError;
    }

    if (roundExists) {
      res.statusCode = 401;
      throw new Error("Esta rodada já está cadastrada");
    }

    // get last round added and active
    const { data: previousRound, error: previousRoundError } = await supabase
      .from("rounds")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("is_active", true)
      .limit(1);

    const previousRoundExists = previousRound.length !== 0;

    if (previousRoundError) {
      res.statusCode = 401;
      throw previousRoundError;
    }

    if (previousRoundExists) {
      const { error: updatePreviousRoundError } = await supabase.from("rounds").update({ is_active: false }).eq("id", previousRound[0].id);

      if (updatePreviousRoundError) {
        res.statusCode = 401;
        throw updatePreviousRoundError;
      }
    }

    const { data: newRound, error } = await supabase
      .from("rounds")
      .insert({ championship_id: id, round_number: currentRound, is_active: true })
      .select("id")
      .single();

''    if (error) {
      res.statusCode = 401;
      throw error;
    }

    const currentRoundDetails = await footballClient.get(`${FOOTBALL_BASE_URL}/campeonatos/${api_id}/rodadas/${currentRound}`);
    const matches = currentRoundDetails.data.partidas;

    const matchesArray = matches.map((match) => ({
      round_id: newRound.id,
      api_match_id: match.partida_id,
      home_team: match.time_mandante.nome_popular,
      away_team: match.time_visitante.nome_popular,
    }));

    for (const match of matchesArray) {
      const { error } = await supabase.from("matches").insert(match);

      if (error) {
        res.statusCode = 401;
        throw error;
      }
    }

    res.status(200).json({
      success: {
        status: true,
        message: "Rodada e partidas criadas com sucesso!",
      },
      failed: null,
    });
  } catch (error) {
    next(error);
  }
});

const createMatches = asyncHandler(async (req, res, next) => {
  const { round_id, home_team, away_team } = req.body;

  try {
    // get round
  } catch (error) {
    next(error);
  }
});

module.exports = { createChampionship, createRound, createMatches };
