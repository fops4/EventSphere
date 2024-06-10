import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';

const PreloaderScreen = ({ navigation }) => {
  const animationDuration = 2000;

  const ePosition = useRef(new Animated.Value(-100)).current;
  const sPosition = useRef(new Animated.Value(100)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;
  const fadeInAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(ePosition, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
          easing: Easing.bounce,
        }),
        Animated.timing(sPosition, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
          easing: Easing.bounce,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeOutAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeInAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      navigation.replace('FirstScreen');
    });
  }, [ePosition, sPosition, fadeOutAnim, fadeInAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.letterContainer, transform: [{ translateY: ePosition }] }}>
        <Animated.Text style={{ ...styles.letter, opacity: fadeOutAnim }}>e</Animated.Text>
      </Animated.View>
      <Animated.View style={{ ...styles.letterContainer, transform: [{ translateY: sPosition }] }}>
        <Animated.Text style={{ ...styles.letter, opacity: fadeOutAnim }}>s</Animated.Text>
      </Animated.View>
      <Animated.View style={{ ...styles.letterContainer, opacity: fadeInAnim }}>
        <Text style={styles.word}>EventSphere</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  letterContainer: {
    position: 'absolute',
  },
  letter: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#fff',
  },
  word: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default PreloaderScreen;
