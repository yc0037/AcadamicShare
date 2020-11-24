import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './styles/App.css';

import NavBar from './NavBar';
import MainPage from './MainPage';
import Login from './Login';
import Register from './Register';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {
        userName: 'Alice',
      },
    };
  }
  render() {
    const userInfo = this.state.userInfo;
    return (
      <BrowserRouter>
        <NavBar userInfo={userInfo} />
        <Switch>
          <Route path="/login">
            <Login userInfo={userInfo}/>
          </Route>
          <Route path="/register">
            <Register userInfo={userInfo}/>
          </Route>
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
