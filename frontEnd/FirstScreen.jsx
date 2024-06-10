import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Text,
} from 'react-native';

const HorizontalAutoScrollView = ({navigation}) => {
  const {width} = useWindowDimensions();
  const scrollViewRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const images = [
    require('../images/assets/6.jpeg'),
    require('../images/assets/8.jpeg'),
    require('../images/assets/7.jpeg'),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage(prevPage => (prevPage + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({x: currentPage * width, animated: true});
    }
  }, [currentPage, width]);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}>
      {images.map((image, index) => (
        <View key={index} style={[styles.imageContainer, {width}]}>
          <Image source={image} style={styles.image} />
          <TouchableOpacity style={styles.btnn} onPress={() => navigation.navigate('AccueilScreen')}>
            <Text style={styles.test}>Get started</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    zIndex: 2,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  btnn: {
    zIndex: 1,
    position: 'absolute',
    backgroundColor: 'red',
    width: '30%',
    height: '7%',
    bottom: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  test: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default HorizontalAutoScrollView;
