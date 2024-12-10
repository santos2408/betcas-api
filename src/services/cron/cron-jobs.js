import cron from "node-cron";

import SyncChampionships from "../../use-cases/championships/sync-championships.js";
import SyncRounds from "../../use-cases/rounds/sync-rounds.js";

const cronJobs = () => {
  const schedule = {
    live: "* 3 * * *",
    test: "*/10 * * * * *",
  };

  cron.schedule(schedule.test, async () => {
    const syncChampionships = new SyncChampionships();
    const syncRounds = new SyncRounds();

    const promises = [syncChampionships.execute(), syncRounds.execute()];
    await Promise.all(promises);

    console.log("Agendamentos executados com sucesso!");
  });
};

export default cronJobs;
