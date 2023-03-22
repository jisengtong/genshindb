import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Routes,
  Route,
  HashRouter
} from "react-router-dom";
import Header from './components/Header';
import Home from './components/Home';
import Characters from './components/Characters'
import ViewCharacter from './components/ViewCharacter';
import Weapons from './components/Weapons';
import Artifacts from './components/Artifacts';
import ViewWeapons from './components/ViewWeapons';
import ViewArtifacts from './components/ViewArtifacts';
import Footer from './components/Footer';
import Error from './components/Error';
import './style/style.css';
import './custom.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <Header />

    <Routes>
      <Route path="*" element={<Error message={'Page does not exist.'} />}></Route>
      <Route path="/" element={<Home />}></Route>
      <Route path="/Home" element={<Home />}></Route>
      <Route path="/Characters" element={<Characters />}></Route>
      <Route path="/ViewCharacter/:name" element={<ViewCharacter />}></Route>
      <Route path="/Weapons" element={<Weapons />}></Route>
      <Route path="/ViewWeapons/:name" element={<ViewWeapons />}></Route>
      <Route path="/Artifacts" element={<Artifacts />}></Route>
      <Route path="/ViewArtifacts/:name" element={<ViewArtifacts />}></Route>
    </Routes>

    <Footer />

  </HashRouter >
);
