import React, { Component } from 'react';

import {
  View,
  Text,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';

import styles from './styles';

const SCREEN_WIDTH = Dimensions.get('window').width;


export default class Card extends Component {

  constructor() {
    super();
    this.panResponder;
    this.state = {
      Xposition: new Animated.Value(0),
      RightText: false,
      LeftText: false,
    }
    this.CardView_Opacity = new Animated.Value(1);
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,

      onMoveShouldSetPanResponder: (evt, gestureState) => true,

      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,

      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderMove: (evt, gestureState) => {
        this.state.Xposition.setValue(gestureState.dx);

        if ( gestureState.dx > SCREEN_WIDTH - 250 ) {
          this.setState({
            RightText: true,
            LeftText: false
          });

        } else if ( gestureState.dx < -SCREEN_WIDTH + 250 ) {
          this.setState({
            LeftText: true,
            RightText: false
          });
        }
      },

      onPanResponderRelease: (evt, gestureState) => {
        if( gestureState.dx < SCREEN_WIDTH - 300 && gestureState.dx > -SCREEN_WIDTH + 300 ) {
          this.setState({
            LeftText: false,
            RightText: false
          });

          Animated.spring( this.state.Xposition,
          {
            toValue: 0,
            speed: 5,
            bounciness: 10,
          }, { useNativeDriver: true }).start();

        } else if( gestureState.dx > SCREEN_WIDTH - 300 ) {

          Animated.parallel(
          [
            Animated.timing( this.state.Xposition,
            {
              toValue: SCREEN_WIDTH,
              duration: 200
            }),

            Animated.timing( this.CardView_Opacity,
            {
              toValue: 0,
              duration: 200
            })
          ], { useNativeDriver: true }).start(() =>
          {
            this.setState({ LeftText: false, RightText: false }, () =>
            {
              this.props.removeCardView();
            });
          });

        } else if( gestureState.dx < -SCREEN_WIDTH + 300 ) {
          Animated.parallel(
          [
            Animated.timing( this.state.Xposition,
            {
              toValue: -SCREEN_WIDTH,
              duration: 200
            }),

            Animated.timing( this.CardView_Opacity,
            {
              toValue: 0,
              duration: 200
            })
          ], { useNativeDriver: true }).start(() =>
          {
            this.setState({ LeftText: false, RightText: false }, () =>
            {
              this.props.removeCardView();
            });
          });
        }
      }
    });
  }

  render() {
    const rotateCard = this.state.Xposition.interpolate({
       inputRange: [-200, 0, 200],
       outputRange: ['-20deg', '0deg', '20deg'],
    });

    return (
      <Animated.View {...this.panResponder.panHandlers}
        style = {[
          styles.card, { backgroundColor: this.props.item.backgroundColor,
          opacity: this.CardView_Opacity,
          transform: [{ translateX: this.state.Xposition },
          { rotate: rotateCard }]}
        ]}
      >

        <Text style = { styles.applicantName }>
          { this.props.item.applicantName }
        </Text>

        { this.state.LeftText &&
          <Text style = { styles.leftText }> Left Swipe </Text>
        }

        { this.state.RightText &&
          <Text style = { styles.rightText }> Right Swipe </Text>}

      </Animated.View>
    );
  }
}
