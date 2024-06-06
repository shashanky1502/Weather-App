import React, { useState } from 'react';
import InputPage from './components/input';
import OutputPage from './components/output';

function App() {
  const [currentPage, setCurrentPage] = useState('input');
  const [city, setCity] = useState('input');

  
  const handlePageChange = (page, cityName) => {
    setCurrentPage(page);
    if (cityName) {
      setCity(cityName);
    }
  };

  return (
    <div className="App ">
      {currentPage === 'input' && <InputPage onPageChange={handlePageChange} />}
      {currentPage === 'output' && <OutputPage onPageChange={handlePageChange} city={city} />}
    </div>
  );
}

export default App;