import React from 'react';

export default class Discuss extends React.Component {
  render() {
    return <h1>{new URLSearchParams(this.props.location.search).get('id')}</h1>;
  }
}