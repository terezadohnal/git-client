import { Home } from 'pages/Home';
import { Repository } from 'pages/Repository';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';
import './App.css';
import AppStateProvider from 'context/AppStateContext/AppStateProvider';
import { CommitDetail } from 'pages/CommitDetail';

export default function App() {
  return (
    <NextUIProvider>
      <AppStateProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/repository/commits/:hash"
              element={<CommitDetail />}
            />
            <Route path="/repository" element={<Repository />} />
          </Routes>
        </Router>
      </AppStateProvider>
    </NextUIProvider>
  );
}
