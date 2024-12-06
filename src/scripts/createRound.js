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
// função que ficará checando o resultado das partidas
const createRound = async () => {
  const { data: activeBets, error: activeBetsError } = await supabase.from("bets").select("*").eq("is_active", true);

  const roundNumber = activeBets[0].round_number;
  const championshipId = activeBets[0].championship_id;
  const { data } = await footballClient.get(`${FOOTBALL_BASE_URL}/campeonatos/${championshipId}/rodadas/${roundNumber}`);
  const roundStatus = data.status;

  if (roundStatus !== "encerrada") {
    return;
  }

  const matches = data.partidas;
  const matchesResults = matches.map((match) => ({
    match_id: match.partida_id,
    home_team: match.placar_mandante,
    away_team: match.placar_visitante,
  }));

  const HOME_TEAM_WIN = 1;
  const AWAY_TEAM_WIN = 2;
  const NOBODY_WINS = "X";

  const usersObtainedPoints = [];

  for (let index = 0; index < activeBets.length; index++) {
    const activeBet = activeBets[index];
    const chosenBets = JSON.parse(activeBet.chosen_bets);

    let winners = [];
    let points = 0;

    for (let i = 0; i < chosenBets.length; i++) {
      const chosenBet = chosenBets[i];
      const matchResult = matchesResults.find((item) => item.match_id === chosenBet.match_id);
      const homeTeamScore = matchResult.home_team;
      const awayTeamScore = matchResult.away_team;

      let oficialResult;
      const expectedResult = chosenBet.chosen_bet;

      if (homeTeamScore > awayTeamScore) {
        oficialResult = HOME_TEAM_WIN;
      } else if (homeTeamScore < awayTeamScore) {
        oficialResult = AWAY_TEAM_WIN;
      } else {
        oficialResult = NOBODY_WINS;
      }

      if (expectedResult === oficialResult) {
        points = points + 1;
      }
    }

    usersObtainedPoints.push({
      user_id: activeBet.user_id,
      bet_id: activeBet.id,
      points_obtained: points,
    });
  }

  const { error } = await supabase.from("users_points").insert(usersObtainedPoints);

  /**
   * [] - Não fazer o cálculo de apostas já calculadas
   * [] - Setar a aposta para "false" na coluna "is_active" após calcular o resultado final
   *
   */
};

module.exports = { createRound };
