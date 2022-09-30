import { Fragment, useEffect } from 'react';
import './css/index.css';
import Navbar from './components/layout/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/pages/auth/Login';
import Landing from './components/pages/Landing';
import AddTrip from './components/pages/AddTrip';


//redux
import { Provider } from 'react-redux';
import store from './store/store';
import NotFound404 from './components/pages/NotFound404';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './store/auth/authAction';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {

  useEffect(() => {
    store.dispatch(loadUser());

    return () => {

    }
  }, []);

  return (<Provider store={store}>
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/landing" element={<Landing />} />
          <Route exact path="/add-vacation" element={<AddTrip />} />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
        {/* <Landing /> */}
      </>
    </Router>
  </Provider>)
}

export default App;
