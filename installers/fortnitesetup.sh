#!/usr/bin/env bash
FORTNITE_LINUX="v1.0.0"
PROTON_URL="https://github.com/GloriousEggroll/proton-ge-custom/releases/download/GE-Proton8-3/GE-Proton8-3.tar.gz"
EPICGAMES_URL="https://launcher-public-service-prod06.ol.epicgames.com/launcher/api/installer/download/EpicGamesLauncherInstaller.msi"
DOTNET_URL="https://download.visualstudio.microsoft.com/download/pr/85473c45-8d91-48cb-ab41-86ec7abc1000/83cd0c82f0cde9a566bae4245ea5a65b/windowsdesktop-runtime-6.0.16-win-x64.exe"
PROTON_BUILD="GE-Proton8-3"
EPICGAMES_INSTALLER="EpicInstaller-15.5.0.msi"

printf "%s\n" "INFO: Attempting to install Epic Games Launcher version: $FORTNITE_LINUX";
# Install's Steam Linux Sniper Runtime
steam steam://install/1628350
# Install's Easy Anti Cheat Runtime
steam steam://install/1826330
# Install's Battleye Runtime
steam steam://install/1161040

mkdir -p ~/.fortnitelinux/

cd ~/.fortnitelinux/

printf "%s\n" "DOWNLOAD: Downloading Fortnite-Linux setup version: $FORTNITE_LINUX";

rm -rf fortnite-linux || true
wget https://github.com/SirStig/fortnite-deck/releases/download/$FORTNITE_LINUX/fortnite-linux
chmod +x fortnite-linux

# set STEAM_RUNTIME_PATH to internal storage or sd card
if [ -f "$HOME/.steam/steam/steamapps/common/SteamLinuxRuntime_sniper/run" ]; then
    STEAM_RUNTIME_PATH="$HOME/.steam/steam/steamapps/common/SteamLinuxRuntime_sniper"
elif [ -f "/run/media/mmcblk0p1/steamapps/common/SteamLinuxRuntime_sniper/run" ]; then
    STEAM_RUNTIME_PATH="/run/media/mmcblk0p1/steamapps/common/SteamLinuxRuntime_sniper"
else
    printf "%s\n" "INFO: SteamLinuxRuntime Sniper not found!";
    sleep 3
    exit 1
fi

./fortnite-linux setConfig STEAM_RUNTIME_PATH $STEAM_RUNTIME_PATH
./fortnite-linux downloadProton "$PROTON_URL"
./fortnite-linux setProton "$PROTON_BUILD"
./fortnite-linux downloadEpic "$EPICGAMES_URL"
./fortnite-linux protonRunUrl "$DOTNET_URL" /q
./fortnite-linux setupEpicDesktop
./fortnite-linux installEpic "$EPICGAMES_INSTALLER"

cd ~/.-linux/compatdata/pfx/dosdevices

if [ -d "$HOME/.steam/steam/steamapps/common/" ]; then
    ln -s "$HOME/.steam/steam/steamapps/common/" j: || true
fi

if [ -d "/run/media/mmcblk0p1/steamapps/common/" ]; then
    ln -s "/run/media/mmcblk0p1/steamapps/common/" k: || true
fi

update-desktop-database || true

rm -f ~/Desktop/epicgameslauncher.desktop
ln -sf ~/.local/share/applications/epicgameslauncher.desktop ~/Desktop/

printf "%s\n" "SUCCESS: Closing in 3..."
sleep 3
