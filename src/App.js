import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './styles/App.css';

import NavBar from './NavBar';
import MainPage from './MainPage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
    };
  }
  render() {
    setTimeout(() => {
      this.setState({
        userInfo: {
          userName: 'Alice',
        },
      });
    }, 2000);
    return (
      <BrowserRouter>
        <NavBar userInfo={this.state.userInfo} />
        <Switch>
          <Route path="/test/hello">
            <h1>Hello World!</h1>
          </Route>
          <Route path="/">
            <MainPage />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
