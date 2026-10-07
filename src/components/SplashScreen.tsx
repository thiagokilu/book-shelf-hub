import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the native splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

interface SplashScreenProps {
  onAnimationFinish: () => void;
}

export default function AnimatedSplashScreen({ onAnimationFinish }: SplashScreenProps) {
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    // Hide the native splash screen when component mounts
    SplashScreen.hideAsync();
  }, []);

  const handleAnimationFinish = () => {
    setAnimationFinished(true);
    onAnimationFinish();
  };

  if (animationFinished) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/introapp.json')}
        autoPlay
        loop={false}
        onAnimationFinish={handleAnimationFinish}
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#208AEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});
