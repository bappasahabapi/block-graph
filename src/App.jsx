


import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BinarySearch from './components/BinarySearch';
import PlusMinus from './components/PlusMinus';
import StringReverseVisualizer from './components/ReverseString';
import PrimeNumberVisualizer from './components/Prime';


const App = () => {
  return (
    <Router>
      <div>
      <div className="flex space-x-4 justify-center mt-6">
  <Link to="/binary-search">
    <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out">
      Binary Search
    </button>
  </Link>
  <Link to="/block-graph">
    <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out">
      Block Graph
    </button>
  </Link>
  <Link to="/string-reverse">
    <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out">
      Two Pointer
    </button>
  </Link>
  <Link to="/prime">
    <button className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out">
      Prime Number 
    </button>
  </Link>
</div>
<hr className="mt-5 p-0 border-t-2 border-black" />


        {/* Define Routes */}
        <Routes>
          <Route path="/binary-search" element={<BinarySearch />} />
          <Route path="/string-reverse" element={<StringReverseVisualizer />} />
          <Route path="/prime" element={<PrimeNumberVisualizer />} />
          <Route path="/block-graph" element={<PlusMinus />} /> {/* Default route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
