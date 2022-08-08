import './App.css';
import Header from '../Header/Header';
import API from '../API/API';

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes className="App">
            <Route path="/" element={<div><Header /><API /></div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
