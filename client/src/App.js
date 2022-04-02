import Dashboard from './components/Dashboard'
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';



function App() {

  return (
    <BrowserRouter>
        <Link to="/"></Link>
        <Switch>
        <Route path="/">
          <Dashboard />
        </Route>
        </Switch>
    </BrowserRouter>
  );
}

export default App;