import { createSequelize, loadEnv } from './lib/database';
import { runSeed } from './lib/run-seed';
import { minimalDataset } from './data/minimal';

loadEnv();

async function main() {
  const sequelize = await createSequelize();
  try {
    await runSeed(sequelize, minimalDataset);
    console.log('\nSeed concluído com sucesso!');
  } catch (error) {
    console.error('Erro no seed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

main();
