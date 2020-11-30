import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './styles/App.css';

import NavBar from './NavBar';
import MainPage from './MainPage';
import Login from './Login';
import Register from './Register';
import Discuss from './Discuss';
import Paper from './Paper';
import Search from './Search';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {
        uid: "0",
        userName: 'Alice',
      },
    };
  }
  render() {
    const { userInfo } = this.state;
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
          <Route path="/discuss" component={Discuss} />
          <Route path="/paper" component={Paper} />
          <Route path="/search" component={Search} />
          <Route path="/test/hello">
            <h1>Hello World!</h1>
          </Route>
          <Route path="/">
            <MainPage userInfo={userInfo}/>
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
