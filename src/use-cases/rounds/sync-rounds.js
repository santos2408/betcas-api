import { http_api_football } from "../../services/axiosService.js";

import SupabaseGetAllChampionshipsRepository from "../../repositories/supabase/championships/get-all-championships.js";
import SupabaseGetRoundsByNumberAndChampionshipIdRepository from "../../repositories/supabase/rounds/get-rounds-by-number-and-championship-id.js";
import SupabaseUpdateRoundsByIdAndStatusRepository from "../../repositories/supabase/rounds/update-rounds-by-id-and-status.js";
import SupabaseCreateRoundsRepository from "../../repositories/supabase/rounds/create-rounds.js";

export default class SyncRounds {
  async execute() {
    try {
      const supabaseGetAllChampionshipsRepository = new SupabaseGetAllChampionshipsRepository();
      const { data: championships } = await supabaseGetAllChampionshipsRepository.execute();

      championships.forEach(async (championship) => {
        const championship_api_id = championship.championship_api_id;
        const response = await http_api_football.get(`/campeonatos/${championship_api_id}/rodadas`);
        const rounds = response.data;

        rounds.forEach(async (item) => {
          const supabaseGetRoundsByNumberAndChampionshipIdRepository = new SupabaseGetRoundsByNumberAndChampionshipIdRepository();
          const { data } = await supabaseGetRoundsByNumberAndChampionshipIdRepository.execute({
            championship_api_id,
            round: item.rodada,
          });

          if (data) {
            const id = data.id;
            const round_api_status = item.status === "encerrada" ? false : true;
            const currentRoundStatus = data.status;

            if (currentRoundStatus === round_api_status) {
              return;
            }

            // should update status
            const params = { id, status: round_api_status };
            const supabaseUpdateRoundsByIdAndStatusRepository = new SupabaseUpdateRoundsByIdAndStatusRepository();
            const { error: errorUpdateRoundsByIdAndStatus } = await supabaseUpdateRoundsByIdAndStatusRepository.execute(params);

            if (errorUpdateRoundsByIdAndStatus) {
              throw errorUpdateRoundsByIdAndStatus;
            }

            return;
          }

          const round = {
            name: item.nome,
            round: item.rodada,
            status: item.status === "encerrada" ? false : true,
          };

          /**
           * QUANDO O LIMITE DE REQUISIÇÕES VOLTAR, VERIFICAR SE A VARIÁVEL ACIMA
           * "ROUND" ESTÁ COM TODAS AS SUAS PROPRIEDADES CORRETAS, EM SEGUIDA
           * VERIFICAR AS LINHAS ABAIXO SE ESTÃO FUNCIONANDO.
           */

          const supabaseCreateRoundsRepository = new SupabaseCreateRoundsRepository();
          const { error: errorCreateRounds } = await supabaseCreateRoundsRepository.execute({ round });

          if (errorCreateRounds) {
            throw errorCreateRounds;
          }
        });
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }
    }
  }
}
