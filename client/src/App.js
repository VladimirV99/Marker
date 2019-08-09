import React from 'react';
import store from './store';
import { Provider } from 'react-redux';

import './App.css';

import Navbar from './components/Navbar';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Navbar></Navbar>
      </div>
    </Provider>
  );
}

export default App;
