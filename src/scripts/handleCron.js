const cron = require("node-cron");

const { createRound } = require("./createRound");

const handleCronJob = async () => {
  try {
    console.log("executou!");
    await createRound();
  } catch (error) {
    console.error("Erro ao criar rodada:", error.message);
  }
};

// Configure o cron job para executar a função diariamente às 00:00
// const task = cron.schedule("0 0 * * *", handleCronJob);

// Configure o cron job para executar a função à cada segundo
cron.schedule("*/10 * * * * *", handleCronJob);

// Configure o cron job para executar a função à cada minuto
// cron.schedule("* * * * *", handleCronJob);

// console.log("Cron job configurado para executar diariamente às 00:00");

// module.exports = { task };
