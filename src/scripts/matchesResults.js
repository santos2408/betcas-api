const supabase = require("../config/database");
const AxiosService = require("../services/axiosService");

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

const matchResults = async () => {
  //

  console.log("Rodada e partidas criadas com sucesso!");
};

module.exports = { matchResults };
