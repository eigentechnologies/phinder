import React, { Component } from 'react';

import {
  View,
  Text,
  Button,
} from 'react-native';

import Card from './card';
import styles from './styles';


const URL = 'http://127.0.0.1:5000';

export default class App extends Component {

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

  removeCardView(id, judgement) {
    this.getNextApplicant();

    const newState = {...this.state};
    newState.cards.splice(this.state.cards.findIndex(x => x.id == id ), 1);
    this.setState(newState);

    console.log(judgement);
    // TODO SEND JUDGEMENT
  }

  getNextApplicant() {
    fetch(`${URL}/applicant`, { method: 'GET' })
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
        passJudgement={j => this.removeCardView(item.id, j)}
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
