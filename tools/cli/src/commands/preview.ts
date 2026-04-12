import chalk from 'chalk';
import { $ } from 'zx';

export async function previewCmd() {
  console.log(chalk.cyan('Starting local VisLab dev server...'));
  // Mock logic
  console.log(chalk.gray('Listening on http://localhost:3000'));
}
