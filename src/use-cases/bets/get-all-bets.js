import SupabaseGetAllBetsRepository from "../../repositories/supabase/bets/get-all-bets.js";

export default class GetAllBetsUseCase {
  async execute() {
    const supabaseGetAllBetsRepository = new SupabaseGetAllBetsRepository();
    const data = await supabaseGetAllBetsRepository.execute();
    return data;
  }
}
