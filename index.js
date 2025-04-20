const axios = require('axios');
const cron = require('node-cron');

// ⚠️ Substitua pelos seus dados do Railway (ou use .env)
const RAILWAY_API_KEY = process.env.RAILWAY_API_KEY;
const PROJECT_ID = process.env.PROJECT_ID;
const ENVIRONMENT_ID = process.env.ENVIRONMENT_ID;

const headers = {
  Authorization: `Bearer ${RAILWAY_API_KEY}`,
};

async function pauseEnv() {
  try {
    await axios.post('https://backboard.railway.app/graphql/v2', {
      query: `
        mutation {
          environmentPause(id: "${ENVIRONMENT_ID}") {
            id
          }
        }
      `
    }, { headers });

    console.log('✅ Ambiente pausado');
  } catch (e) {
    console.error('❌ Erro ao pausar ambiente:', e.message);
  }
}

async function resumeEnv() {
  try {
    await axios.post('https://backboard.railway.app/graphql/v2', {
      query: `
        mutation {
          environmentResume(id: "${ENVIRONMENT_ID}") {
            id
          }
        }
      `
    }, { headers });

    console.log('✅ Ambiente retomado');
  } catch (e) {
    console.error('❌ Erro ao retomar ambiente:', e.message);
  }
}

// Execução manual para testes (isso será removido depois)
(async () => {
  console.log("🔄 Iniciando teste manual de retomada...");
  try {
    await resumeEnv();
  } catch (err) {
    console.error("❌ Erro ao retomar ambiente:", err);
  }

  console.log("🔄 Iniciando teste manual de pausa...");
  try {
    await pauseEnv();
  } catch (err) {
    console.error("❌ Erro ao pausar ambiente:", err);
  }
})();

// Agendamentos normais mantidos para produção
cron.schedule('0 23 * * *', pauseEnv);
cron.schedule('0 8 * * *', resumeEnv);
