import React, { Component } from 'react';

import { Platform, StyleSheet, View, Text, Dimensions, Animated, PanResponder } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

class SwipeableCardView extends Component<{}>
{
  constructor()
  {
    super();
    this.panResponder;
    this.state = {
      Xposition: new Animated.Value(0),
      RightText: false,
      LeftText: false,
    }
    this.CardView_Opacity = new Animated.Value(1);
  }

  componentWillMount()
  {
    this.panResponder = PanResponder.create(
    {
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) =>
      {
        this.state.Xposition.setValue(gestureState.dx);

        if ( gestureState.dx > SCREEN_WIDTH - 250 )
        {
          this.setState({
            RightText: true,
            LeftText: false
          });

        }
        else if ( gestureState.dx < -SCREEN_WIDTH + 250 )
        {
          this.setState({
            LeftText: true,
            RightText: false
          });
        }
      },

      onPanResponderRelease: (evt, gestureState) =>
      {
        if( gestureState.dx < SCREEN_WIDTH - 300 && gestureState.dx > -SCREEN_WIDTH + 300 )
        {
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
        }

        else if( gestureState.dx > SCREEN_WIDTH - 300 )
        {

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

        }
        else if( gestureState.dx < -SCREEN_WIDTH + 300 )
        {
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

  render()
  {
    const rotateCard = this.state.Xposition.interpolate(
    {
       inputRange: [-200, 0, 200],
       outputRange: ['-20deg', '0deg', '20deg'],
    });

    return(

      <Animated.View {...this.panResponder.panHandlers}
        style = {[
          styles.cardView_Style, { backgroundColor: this.props.item.backgroundColor,
          opacity: this.CardView_Opacity,
          transform: [{ translateX: this.state.Xposition },
          { rotate: rotateCard }]}
          ]}>

        <Text style = { styles.CardView_Title }> { this.props.item.cardView_Title } </Text>

        { this.state.LeftText &&
          <Text style = { styles.Left_Text_Style }> Left Swipe </Text>
        }

        { this.state.RightText &&
          <Text style = { styles.Right_Text_Style }> Right Swipe </Text>}

      </Animated.View>
    );
  }
}

export default class MyApp extends Component<{}>
{
  constructor() {
    super();
    this.state = this.getDefaultState();
  }

  getDefaultState() {
    return {
      Sample_CardView_Items_Array: [
      {
        id: '1',
        cardView_Title: 'CardView 1',
        backgroundColor: '#4CAF50'
      },

      {
        id: '2',
        cardView_Title: 'CardView 2',
        backgroundColor: '#607D8B'
      },

      {
        id: '3',
        cardView_Title: 'CardView 3',
        backgroundColor: '#9C27B0'
      },

      {
        id: '4',
        cardView_Title: 'CardView 4',
        backgroundColor: '#00BCD4'
      },

      {
        id: '5',
        cardView_Title: 'CardView 5',
        backgroundColor: '#FFC107'
      },

    ], No_More_CardView: false };
  }

  componentDidMount()
  {
    this.setState({ Sample_CardView_Items_Array: this.state.Sample_CardView_Items_Array.reverse() });

    if( this.state.Sample_CardView_Items_Array.length == 0 )
    {
      this.setState(this.getDefaultState());
    }
  }

  removeCardView =(id)=>
  {
    this.state.Sample_CardView_Items_Array.splice( this.state.Sample_CardView_Items_Array.findIndex( x => x.id == id ), 1 );

    this.setState({ Sample_CardView_Items_Array: this.state.Sample_CardView_Items_Array }, () =>
    {
      if( this.state.Sample_CardView_Items_Array.length == 0 ) {
        this.setState(this.getDefaultState());
      }
    });
  }

  render()
  {
    return(
      <View style = { styles.MainContainer }>
      {
        this.state.Sample_CardView_Items_Array.map(( item, key ) =>
          <SwipeableCardView key = { key } item = { item } removeCardView = { this.removeCardView.bind( this, item.id ) }/>
        )
      }
      { this.state.No_More_CardView &&
          <Text style = {{ fontSize: 22, color: '#000' }}>
            No more paralegals female found. Sorry, Julio.
          </Text> }
      </View>
    );
  }
}

const styles = StyleSheet.create(
{
  MainContainer:
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0
  },

  cardView_Style:
  {
    width: '75%',
    height: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 7
  },

  CardView_Title:
  {
    color: '#fff',
    fontSize: 24
  },

  Left_Text_Style:
  {
    top: 22,
    right: 32,
    position: 'absolute',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },

  Right_Text_Style:
  {
    top: 22,
    left: 32,
    position: 'absolute',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  }
});
