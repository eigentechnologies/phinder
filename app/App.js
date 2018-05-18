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
      cards: [],
    };
  }

  componentWillMount() {
    if( this.state.cards.length == 0 ) {
      this.getNextApplicant();
    }
  }

  passJudgement(id, judgement) {
    fetch(`${URL}/applicant`, {
      method: 'PUT',
      body: JSON.stringify({id: id, decision: judgement})
    })
    .then(() => this.removeCard(id))
    .then(() => this.getNextApplicant())
  }

  removeCard(id) {
    const newState = {...this.state};
    newState.cards.splice(this.state.cards.findIndex(x => x.id == id));
    this.setState(newState);
  }

  getNextApplicant() {
    fetch(`${URL}/applicant`, { method: 'GET' })
      .then(response => response.json())
      .then(json => this.addApplicantCard(json))
  }

  addApplicantCard(json) {
    console.log(json);
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
        passJudgement={j => this.passJudgement(item.id, j)}
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
