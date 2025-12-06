import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PostGigPage from './components/PostGigPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/post-gig" element={<PostGigPage />} />
      </Routes>
    </Router>
  )
}

export default App
