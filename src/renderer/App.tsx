import { Home } from 'pages/Home';
import { Repository } from 'pages/Repository';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';
import './App.css';
import AppStateProvider from 'context/AppStateContext/AppStateProvider';
import { CommitDetail } from 'pages/CommitDetail';
import { NewCommit } from 'pages/NewCommit';
import { theme } from 'theme';

export default function App() {
  return (
    <NextUIProvider theme={theme}>
      <AppStateProvider>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/repository/commits/:hash"
              element={<CommitDetail />}
            />
            <Route path="/repository/create-commit" element={<NewCommit />} />
            <Route path="/repository" element={<Repository />} />
          </Routes>
        </MemoryRouter>
      </AppStateProvider>
    </NextUIProvider>
  );
}
