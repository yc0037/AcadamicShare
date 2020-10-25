import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/test/hello">
          <h1>Hello World!</h1>
        </Route>
        <Route path="/">
          <h1>Index</h1>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
