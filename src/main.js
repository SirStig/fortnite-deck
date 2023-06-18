import { program } from "commander";

import { downloadProton, setProton, protonRunUrl } from "./lib/proton.js";
import {
  downloadEpic,
  installEpic,
  launchEpic,
  setupEpicDesktop,
} from "./lib/epic.js";

import { getConfig, setConfig } from "./lib/config.js";

const originalEmit = process.emit;
// eslint-disable-next-line
process.emit = function (name, data, ...args) {
  if (
    name === `warning` &&
    typeof data === `object` &&
    data.name === `ExperimentalWarning`
  ) {
    return false;
  }
  return originalEmit.apply(process, arguments);
};

// x-release-please-start-version
program.version("1.2.1");
// x-release-please-end

program
  .command("downloadProton <downloadUrl>")
  .description("Download Proton")
  .action(async (downloadUrl) => {
    await downloadProton(downloadUrl);
  });

program
  .command("setProton <protonBuild>")
  .description("Set Proton Build")
  .action((protonBuild) => {
    setProton(protonBuild);
  });

program
  .command("downloadEpic <downloadUrl>")
  .description("Download Epic Games Launcher")
  .action(async (downloadUrl) => {
    await downloadEPIC(downloadUrl);
  });

program
  .command("installEpic <epic Installer>")
  .description("Install Epic Games Launcher")
  .action(async (epicInstaller) => {
    await installEpic(epicInstaller);
  });

program
  .command("launchEpic [args...]")
  .description("Launch Epic Games Launcher")
  .action(async (args) => {
    await launchEpic(args);
  });

program
  .command("setupEpicDesktop")
  .description("Setup .desktop entry for Epic Games Launcher")
  .action(() => {
    setupEpicDesktop();
  });

program
  .command("getConfig")
  .description("Output config")
  .action(() => {
    console.log(JSON.stringify(getConfig(), null, 2));
  });

program
  .command("setConfig <key> [value]")
  .description("Set config key")
  .action((key, value) => {
    setConfig(key, value);
    console.log(JSON.stringify(getConfig(), null, 2));
  });

program
  .command("protonRunUrl <downloadUrl> [args]")
  .description("Download and run an .exe")
  .action(async (downloadUrl, args) => {
    await protonRunUrl(downloadUrl, args);
  });

program.parse(process.argv);
