import { create } from 'react-test-renderer';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Home } from 'pages/Home';
import { CommitDetail } from 'pages/CommitDetail';
import { NewCommit } from 'pages/NewCommit';
import { Repository } from 'pages/Repository';

describe('My app', () => {
  it('renders correctly', () => {
    const renderer = create(
      <MemoryRouter>
        <Routes>
          {/* lll */}
          <Route path="/" element={<Home />} />
          <Route path="/repository/commits/:hash" element={<CommitDetail />} />
          <Route path="/repository/create-commit" element={<NewCommit />} />
          <Route path="/repository" element={<Repository />} />
        </Routes>
      </MemoryRouter>
    );

    expect(renderer.toJSON()).toMatchSnapshot();
  });
});
