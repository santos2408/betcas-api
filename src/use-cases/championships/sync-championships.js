import { http_api_football } from "../../services/axiosService.js";

import SupabaseGetChampionshipsByIdRepository from "../../repositories/supabase/championships/get-championships-by-id.js";
import SupabaseCreateChampionshipsRepository from "../../repositories/supabase/championships/create-championships.js";
import SupabaseUpdateChampionshipsByIdRepository from "../../repositories/supabase/championships/update-championships-by-id.js";

export default class SyncChampionships {
  async execute() {
    try {
      const response = await http_api_football.get("/me");
      const availableChampionships = response.data.campeonatos;

      availableChampionships.forEach(async (availableChampionship) => {
        const availableChampionshipId = availableChampionship.campeonato_id;
        const response = await http_api_football.get(`/campeonatos/${availableChampionshipId}`);
        const championship_api = response.data;

        const params = { id: availableChampionshipId };
        const supabaseGetChampionshipsByIdRepository = new SupabaseGetChampionshipsByIdRepository();
        const { data } = await supabaseGetChampionshipsByIdRepository.execute(params);

        // already exists
        if (data) {
          const id = data.id;
          const championship_api_status = championship_api.status === "finalizado" ? false : true;
          const currentStatus = data.status;

          if (currentStatus === championship_api_status) {
            return;
          }

          // should update status
          const params = { id, status: championship_api_status };
          const supabaseUpdateChampionshipsByIdRepository = new SupabaseUpdateChampionshipsByIdRepository();
          const { error: errorUpdateChampionshipsById } = await supabaseUpdateChampionshipsByIdRepository.execute(params);

          if (errorUpdateChampionshipsById) {
            throw errorUpdateChampionshipsById;
          }

          return;
        }

        const championship = {
          championship_api_id: championship_api.campeonato_id,
          name: championship_api.nome,
          popular_name: championship_api.nome_popular,
          slug: championship_api.slug,
          status: championship_api.status === "finalizado" ? false : true,
          logo: championship_api.logo,
        };

        const supabaseCreateChampionshipsRepository = new SupabaseCreateChampionshipsRepository();
        const { error: errorCreateChampionships } = await supabaseCreateChampionshipsRepository.execute({ championship });

        if (errorCreateChampionships) {
          throw errorCreateChampionships;
        }
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }
    }
  }
}
