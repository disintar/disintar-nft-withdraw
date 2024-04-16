import './App.scss'

import {Header} from "./components/Header/Header";
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { NftSell } from './pages/NftSell';
import { NftWithdraw } from './pages/NftWithdraw';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/withdraw' element={<NftWithdraw />} />
          <Route path='/sell' element={<NftSell />} />
        </Route>
      </Routes>
    </BrowserRouter>
}

export default App
