import { createSequelize, loadEnv } from './lib/database';
import { runSeed } from './lib/run-seed';
import { fullDataset } from './data/full';

loadEnv();

async function main() {
  const sequelize = await createSequelize();
  try {
    await runSeed(sequelize, fullDataset);
    console.log('\nSeed completo! Ideal para demo/portfolio.');
    console.log('Usuários extras: ana, pedro, carla, lucas, julia @cine-review.com / user12345');
  } catch (error) {
    console.error('Erro no seed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

main();
