import Sound from "react-native-sound";
import { useEffect } from "react";
import { storage } from "../../../../../../src/utils/storage";

export const usePlayResultSound = () => {
  useEffect(() => {
    let soundInstance = null;

    Sound.setCategory('Playback');

    const soundFileName = 'game_result.mp3';

    soundInstance = new Sound(soundFileName, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        return;
      }

      let shouldPlaySound = false;
      try {
        const settingsString = storage.getString('gameSettings');
        if (settingsString) {
          const gameSettings = JSON.parse(settingsString);
          if (gameSettings && typeof gameSettings.sound === 'boolean' && gameSettings.sound) {
            shouldPlaySound = true;
          }
        }
      } catch (settingsError) {
        console.error("Error reading or parsing game settings for result sound:", settingsError);
      }

      if (shouldPlaySound && soundInstance) {
        soundInstance.play((success) => {
          if (!success) {
            console.error('Result sound playback failed');
          }
        });
      } else {
         if (soundInstance) {
             soundInstance.release();
         }
      }
    });

    return () => {
      if (soundInstance) {
        soundInstance.release();
        soundInstance = null;
      }
    };
  }, []);
};