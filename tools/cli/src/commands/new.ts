import chalk from 'chalk';
import { $ } from 'zx';

export async function newCmd(projectName: string) {
  console.log(chalk.blue(`Initializing new VisLab component: ${projectName}`));
  // Mock logic since we are building structural foundation
  console.log(chalk.green(`Successfully scaffolded ${projectName}!`));
  console.log(`Run ${chalk.yellow(`cd ${projectName} && vislab preview`)} to start hacking.`);
}
