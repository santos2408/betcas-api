import SupabaseCreateBetsRepository from "../../repositories/supabase/bets/create-bets.js";

export default class CreateBetsUseCase {
  async execute(params) {
    const supabaseCreateBetsRepository = new SupabaseCreateBetsRepository();
    // TODO: Antes de criar, verificar se essa posta já está cadastrada
    const data = await supabaseCreateBetsRepository.execute(params);
    return data;
  }
}
