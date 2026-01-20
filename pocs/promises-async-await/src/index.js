import { 
  runTickProof, 
  runBenchmark, 
  runErrorTrap, 
  runRaceCondition 
} from './async-utils.js';

async function main() {
  console.log("Initializing: ASYNC AND PROMISES");

  runTickProof();
  
  await new Promise(res => setTimeout(res, 50));

  await runBenchmark();

  await runErrorTrap();
  
  await new Promise(res => setTimeout(res, 50));

  await runRaceCondition();

  console.log("\nFINISHED");
}

main().catch(err => console.error("Error in Runner:", err));
