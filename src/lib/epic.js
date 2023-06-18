import path from "path";
import {
  chmodSync,
  createWriteStream,
  existsSync,
  mkdirSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import { promisify } from "util";
import { pipeline } from "stream";

import { BASE_DIR } from "./config.js";
import { protonRun } from "./proton.js";

import epicIcon from "../assets/epicgameslauncher.ico";
import epicDesktop from "../assets/epicgameslauncher.desktop";

const pipelineAsync = promisify(pipeline);

const EPIC_DIR = path.join(
  BASE_DIR,
  "compatdata",
  "pfx",
  "drive_c",
  "Program Files (x86)",
  "Epic Games",
  "Launcher",
  "Portal",
  "Binaries",
  "Win32"
);

export const downloadEpic = async (downloadUrl) => {
  const installersPath = path.join(BASE_DIR, "epic-installer");

  try {
    // Create installersPath directory if it doesn't exist
    if (!existsSync(installersPath)) {
      mkdirSync(installersPath, { recursive: true });
    }

    const filename = path.basename(downloadUrl);
    const targetPath = path.join(installersPath, filename);

    // Delete the file if it already exists
    if (existsSync(targetPath)) {
      unlinkSync(targetPath);
    }

    // Download the file
    const response = await fetch(downloadUrl);
    await pipelineAsync(response.body, createWriteStream(targetPath));

    console.log("SUCCESS: Epic Games Launcher downloaded successfully!");
  } catch (error) {
    console.error("ERROR: Error downloading Epic Games Launcher:", error);
  }
};

export const installEpic = async (epicInstaller) => {
  const epicInstallerPath = path.join(
    BASE_DIR,
    "epic-installer",
    epicInstaller
  );
  const command = `"${epicInstallerPath}" /S`;
  await protonRun(command);
};

export const setupEpicDesktop = () => {
  const applicationsPath = path.join(
    process.env.HOME,
    ".local",
    "share",
    "applications"
  );
  const iconPath = path.join(applicationsPath, "epicgameslauncher.ico");
  const desktopPath = path.join(applicationsPath, "epicgameslauncher.desktop");

  // Create applicationsPath directory if it doesn't exist
  if (!existsSync(applicationsPath)) {
    mkdirSync(applicationsPath, { recursive: true });
  }

  // Write icon and desktop files
  const iconData = Buffer.from(epicIcon.split(",")[1], "base64");
  const desktopData = epicDesktop
    .replace("%%EPIC_PATH%%", EPIC_DIR)
    .replace("%%EPIC_EXEC%%", `"${__filename}" launchEpic -- -d %u`)
    .replace("%%EPIC_ICON%%", iconPath);

  writeFileSync(iconPath, iconData);
  writeFileSync(desktopPath, desktopData, "utf-8");
  chmodSync(desktopPath, "755");
};

export const launchEpic = async (args) => {
  const epicExe = path.join(EPIC_DIR, "EpicGamesLauncher.exe");
  let fullCommand = `"${epicExe}"`;

  if (["-d", "-i"].includes(args?.[0]) && args?.length === 1) {
    console.info(`No url provided, ignoring ${args[0]}`);
  } else {
    fullCommand += ` ${args.join(" ")}`;
  }

  await protonRun(fullCommand);
};
