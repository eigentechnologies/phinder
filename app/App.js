import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Animated,
  PanResponder,
  Button,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;


class Card extends Component {

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

export default class MyApp extends Component {

  constructor() {
    super();
    this.state = this.getDefaultState();
  }

  getDefaultState() {
    return {
      cards: [{
        id: '1',
        applicantName: 'CardView 1',
        backgroundColor: '#4CAF50'
      }, {
        id: '2',
        applicantName: 'CardView 2',
        backgroundColor: '#607D8B'
      }, {
        id: '3',
        applicantName: 'CardView 3',
        backgroundColor: '#9C27B0'
      }, {
        id: '4',
        applicantName: 'CardView 4',
        backgroundColor: '#00BCD4'
      }, {
        id: '5',
        applicantName: 'CardView 5',
        backgroundColor: '#FFC107'
      }],
      noCards: false,
    };
  }

  componentDidMount() {
    if( this.state.cards.length == 0 ) {
      this.setState(this.getDefaultState());
    }
  }

  removeCardView(id) {
    this.getNextApplicant();

    const newState = {...this.state};
    newState.cards.splice(this.state.cards.findIndex(x => x.id == id ), 1);
    this.setState(newState);
  }

  getNextApplicant() {
    fetch('http://127.0.0.1:5000/applicant', { method: 'GET' })
      .then(response => response.json())
      .then(json => this.addApplicantCard(json))
  }

  addApplicantCard(json) {
    const newState = {...this.state};
    newState.cards.push({
      id: json.id,
      applicantName: json.name,
      backgroundColor: '#FF0000',
    });
    this.setState(newState);
  }

  get cards() {
    const cards = [...this.state.cards].reverse();

    return cards.map(( item, key ) =>
      <Card
        key={key}
        item={item}
        removeCardView={() => this.removeCardView(item.id)}
      />
    )
  }

  render() {
    return(
      <View style = { styles.MainContainer }>
        { this.cards }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0
  },

  card: {
    width: '75%',
    height: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 7
  },

  applicantName: {
    color: '#fff',
    fontSize: 24
  },

  leftText: {
    top: 22,
    right: 32,
    position: 'absolute',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },

  rightText: {
    top: 22,
    left: 32,
    position: 'absolute',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  }
});
