import cron from "node-cron";

import SyncChampionships from "../../use-cases/championships/sync-championshipsjs";

const cronJobs = () => {
  cron.schedule("* 3 * * *", async () => {
    const syncChampionships = new SyncChampionships();
    await syncChampionships.execute();
    console.log("Agendamentos executados com sucesso!");
  });
};

export default cronJobs;
