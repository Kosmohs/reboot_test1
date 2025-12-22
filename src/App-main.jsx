// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TrainingProvider } from './contexts/TrainingContext';

import HomePage from './pages/HomePage';
import Zone1 from './pages/Zone1';
import Zone2 from './pages/Zone2';
import Zone3 from './pages/Zone3';
import Page1 from './pages/Page1';
import Page1_1 from './pages/Page1_1';
import Page1_2 from './pages/Page1_2';
import Page1_3 from './pages/Page1_3';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';
import Page5 from './pages/Page5';
import Page6 from './pages/Page6';
import Page7 from './pages/Page7';
import Page8 from './pages/Page8';
import Page9 from './pages/Page9';
import Page9_1 from './pages/Page9_1';
import Page9_2 from './pages/Page9_2';
import Page10 from './pages/Page10';
import Page11 from './pages/Page11';
import Page12 from './pages/Page12';
import Page13 from './pages/Page13';
import Page14 from './pages/Page14';
import Page15 from './pages/Page15';
import Page16 from './pages/Page16';
import Page17 from './pages/Page17';
import Page18 from './pages/Page18';
import Page20 from './pages/Page20';
import Page21 from './pages/Page21';
import Page21_test from './pages/Page21_test';
import Page22 from './pages/Page22';
import Page23 from './pages/Page23';


import { TestUseState } from './pages/PageTest';


// import DateTimeDisplay from './components/DateTimeDisplay'; // ← ЗАКОММЕНТИРУЙТЕ
import './App.css';

function App() {
  return (
    <TrainingProvider>
      <Router>
        <div className="App">
          {/* <DateTimeDisplay /> */} {/* ← ЗАКОММЕНТИРУЙТЕ */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/zone1" element={<Zone1 />} />
            <Route path="/zone2" element={<Zone2 />} />
            <Route path="/zone3" element={<Zone3 />} />
            <Route path="/page1" element={<Page1 />} />
            <Route path="/page1_1" element={<Page1_1 />} />
            <Route path="/page1_2" element={<Page1_2 />} />
            <Route path="/page1_3" element={<Page1_3 />} />
            <Route path="/page2" element={<Page2 />} />
            <Route path="/page3" element={<Page3 />} />
            <Route path="/page4" element={<Page4 />} />
            <Route path="/page5" element={<Page5 />} />
            <Route path="/page6" element={<Page6 />} />
            <Route path="/page7" element={<Page7 />} />
            <Route path="/page8" element={<Page8 />} />
            <Route path="/page9" element={<Page9 />} />
            <Route path="/page9_1" element={<Page9_1 />} />
            <Route path="/page9_2" element={<Page9_2 />} />
            <Route path="/page10" element={<Page10 />} />
            <Route path="/page11" element={<Page11 />} />
            <Route path="/page12" element={<Page12 />} />
            <Route path="/page13" element={<Page13 />} />
            <Route path="/page14" element={<Page14 />} />
            <Route path="/page15" element={<Page15 />} />
            <Route path="/page16" element={<Page16 />} />
            <Route path="/page17" element={<Page17 />} />
            <Route path="/page18" element={<Page18 />} />
            <Route path="/page20" element={<Page20 />} />
            <Route path="/page21" element={<Page21 />} />
            <Route path="/page21_test" element={<Page21_test />} />
            <Route path="/page22" element={<Page22 />} />
            <Route path="/page23" element={<Page23 />} />


            <Route path="/pagetest" element={<TestUseState />} />
          </Routes>
        </div>
      </Router>
    </TrainingProvider>
  );
}

export default App;