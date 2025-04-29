import Sound from "react-native-sound";
import { useEffect } from "react";

export const usePlayResultSound = () => {
  useEffect(() => {
    let soundInstance = null;

    Sound.setCategory('Playback');

    soundInstance = new Sound('game_result.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        return;
      }
      soundInstance.play((success) => {
        if (success) {
          console.log('Sound played successfully');
        } else {
          console.error('Sound playback failed');
        }
      });
    });

    return () => {
      if (soundInstance) {
        soundInstance.release();
        soundInstance = null;
      }
    };

  }, []);
};