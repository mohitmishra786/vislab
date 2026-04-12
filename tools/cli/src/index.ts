#!/usr/bin/env node
import { Command } from 'commander';
import { newCmd } from './commands/new';
import { previewCmd } from './commands/preview';
import { buildCmd } from './commands/build';

const program = new Command();

program
  .name('vislab')
  .description('CLI to generate, preview, and build VisLab visualization projects')
  .version('0.1.0');

program
  .command('new <project-name>')
  .description('Create a new VisLab component workspace')
  .action(newCmd);

program
  .command('preview')
  .description('Start the local development server to preview your visualization')
  .action(previewCmd);

program
  .command('build')
  .description('Build the visualization into IIFE/ESM for Jekyll/React distribution')
  .action(buildCmd);

program.parse(process.argv);
