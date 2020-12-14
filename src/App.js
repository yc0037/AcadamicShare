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
import AddDiscuss from './AddDiscuss';

import { conf } from './conf.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
      login: false
    };
    this.updateLogin = this.updateLogin.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
  }
  // componentDidMount() {
  //   this.updateLogin();
  // }
  handleSwitch(checked) {
    if (checked) {
      this.setState({
        userInfo: { userName: 'Alice' },
        login: true
      });
    } else {
      this.setState({
        userInfo: null,
        login: false
      });
    }
  }
  updateLogin() {
    fetch(`${conf.server}/user_system/get_name`, {
      credentials: 'include'
    })
    .then(response => response.json())
    .then(result => {
      if (!result.hasOwnProperty('code')) {
        this.setState({
          userInfo: { userName: result.username }
        });
      }
    });
  }
  render() {
    const { userInfo } = this.state;
    return (
      <BrowserRouter>
        <NavBar
          userInfo={userInfo} 
          handleSwitch={this.handleSwitch}
          login={this.state.login}
        />
        <Switch>
          <Route path="/login">
            <Login userInfo={userInfo} updateLogin={this.updateLogin} />
          </Route>
          <Route path="/register">
            <Register userInfo={userInfo}/>
          </Route>
          <Route path="/discuss" component={Discuss} />
          <Route path="/paper" component={Paper} />
          <Route path="/search" component={Search} />
          <Route path="/adddiscuss" component={AddDiscuss} />
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
