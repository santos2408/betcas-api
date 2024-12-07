import "dotenv/config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

import cronJobs from "./src/services/cron/cron-jobs.js";

import authRoutes from "./src/routes/auth.routes.js";
import betsRoutes from "./src/routes/bets.routes.js";

const __dirname = import.meta.dirname;

// // middlwares
import { notFoundHandler, errorHandler } from "./src/middlewares/errorHandler.js";

const corsOptions = {
  origin: process.env.FRONTEND_DOMAIN, // Substitua pelo domínio do seu frontend
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const app = express();

// environment
const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 4000;

// static files
app.use("/public", express.static(__dirname + "/public"));
app.use("/public/images", express.static(__dirname + "/public/images"));

// config
if (!isProduction) app.use(morgan("dev"));
app.disable("x-powered-by");
app.disable("etag");

app.use(helmet());
app.options("*", cors(corsOptions)); // Permite preflight para todas as rotas
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/bets", betsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

cronJobs();

// import { http_api_football } from "./src/services/axiosService.js";
// import { supabaseClient } from "./src/config/database.js";

// (async () => {
//   const result = await http_api_football.get("/campeonatos");
//   const championshipsRoundResults = [];

//   // cria um array com todas as rodadas que estão finalizadas junto com seu respectivo id do campeonato
//   for (const championship of result.data) {
//     const roundStatus = championship.rodada_atual.status;

//     // ativar quando estiver com a API real
//     // if (championship.status === "finalizado") {
//     //   continue;
//     // }

//     if (roundStatus !== "encerrada") {
//       continue;
//     }

//     const currentRound = championship.rodada_atual.rodada;
//     const championship_id = championship.campeonato_id;

//     const { data } = await http_api_football.get(`/campeonatos/${championship_id}/rodadas/${currentRound}`);
//     const matchResults = data.partidas.map((match) => ({
//       partida_id: match.partida_id,
//       placar_mandante: match.placar_mandante,
//       placar_visitante: match.placar_visitante,
//     }));

//     // console.log(data.partidas);

//     championshipsRoundResults.push({
//       championship_id,
//       round: { rodada: currentRound, status: championship.rodada_atual.status },
//       matchResults,
//     });
//   }

//   // console.log("1) -", championshipsRoundResults);

//   // itera pelo array de rodadas encerradas acima
//   if (championshipsRoundResults.length) {
//     for (const endedRounds of championshipsRoundResults) {
//       const { championship_id, round } = endedRounds;
//       const { rodada } = round;

//       // console.log("2) -", endedRounds);

//       // para cada rodada encerrada, busca as apostas correspondentes
//       const { data: bets, error } = await supabaseClient
//         .from("bets")
//         .select("*")
//         .eq("championship_id", championship_id)
//         .eq("round", rodada)
//         .eq("bet_status", true)
//         .eq("round_status", true);

//       // console.log("3) -", bets);

//       for (const bet of bets) {
//         const matchResults = endedRounds.matchResults;
//         const userPredictions = bet.predictions;

//         let totalPoints = 0;

//         for (const index in userPredictions) {
//           const userPrediction = userPredictions[index];
//           const matchResult = matchResults[index];

//           if (userPrediction.partida_id === matchResult.partida_id) {
//             const prediction = userPrediction.resultado;
//             const placar_mandante = matchResult.placar_mandante;
//             const placar_visitante = matchResult.placar_visitante;
//             let finalResult = "";

//             if (placar_mandante > placar_visitante) {
//               finalResult = "time_mandante";
//             }

//             if (placar_mandante < placar_visitante) {
//               finalResult = "time_visitante";
//             }

//             if (placar_mandante === placar_visitante) {
//               finalResult = "empate";
//             }

//             if (prediction === finalResult) {
//               totalPoints++;
//             }

//             console.log(totalPoints);
//           }
//         }
//       }
//     }
//   }
// })();

app.listen(process.env.PORT, () => console.log(`Listening on port ${PORT}`));
