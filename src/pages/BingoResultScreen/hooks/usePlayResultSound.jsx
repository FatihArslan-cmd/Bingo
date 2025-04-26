import Sound from "react-native-sound";
import { useEffect } from "react";

export const usePlayResultSound = () => {
  useEffect(() => {
    let sound = null;

    sound = new Sound('game_result.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        return;
      }
    });

    return () => {
      if (sound) {
        sound.release();
        sound = null;
      }
    };

  }, []);
};