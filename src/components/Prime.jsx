import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Check, X } from 'lucide-react';

export default function PrimeNumberVisualizer() {
  const [limit, setLimit] = useState(30);
  const [numbers, setNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(2);
  const [currentMultiples, setCurrentMultiples] = useState([]);
  const [primes, setPrimes] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [completed, setCompleted] = useState(false);
  const timerRef = useRef(null);

  // Initialize number grid
  useEffect(() => {
    resetVisualization();
  }, [limit]);

  const resetVisualization = () => {
    const initialNumbers = Array.from({ length: limit - 1 }, (_, i) => ({
      value: i + 2,
      isPrime: null,
      isActive: false,
      isMultiple: false
    }));
    setNumbers(initialNumbers);
    setCurrentNumber(2);
    setCurrentMultiples([]);
    setPrimes([]);
    setCompleted(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
  };

  const startVisualization = () => {
    resetVisualization();
    setIsRunning(true);
    
    let currentNum = 2;
    let primesFound = [];
    let allMultiples = [];
    
    timerRef.current = setInterval(() => {
      if (currentNum > Math.sqrt(limit)) {
        // Mark remaining numbers as prime
        const updatedNumbers = numbers.map(num => ({
          ...num,
          isPrime: num.isPrime === null ? true : num.isPrime,
          isActive: false
        }));
        setNumbers(updatedNumbers);
        
        // Collect all primes
        const finalPrimes = updatedNumbers.filter(num => num.isPrime).map(num => num.value);
        setPrimes(finalPrimes);
        
        // Clean up
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsRunning(false);
        setCompleted(true);
        return;
      }

      // Mark current number as prime if not already marked as non-prime
      setNumbers(prevNumbers => 
        prevNumbers.map(num => 
          num.value === currentNum && num.isPrime === null 
            ? { ...num, isPrime: true, isActive: true } 
            : { ...num, isActive: false }
        )
      );

      // Find all multiples of current number
      const multiples = [];
      for (let i = currentNum * 2; i <= limit; i += currentNum) {
        multiples.push(i);
      }
      setCurrentMultiples(multiples);

      // Mark multiples as non-prime after a delay
      setTimeout(() => {
        setNumbers(prevNumbers => 
          prevNumbers.map(num => 
            multiples.includes(num.value) 
              ? { ...num, isPrime: false, isMultiple: true } 
              : num
          )
        );
        setCurrentMultiples([]);
        
        // Find next prime number
        const nextPrime = numbers.find(num => 
          num.value > currentNum && num.isPrime === null
        );
        if (nextPrime) {
          setCurrentNumber(nextPrime.value);
          currentNum = nextPrime.value;
        } else {
          currentNum = limit + 1; // Exit condition
        }
      }, (3000 - speed) / 2);

    }, 3000 - speed);
  };

  const togglePause = () => {
    if (isRunning) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      startVisualization();
    }
    setIsRunning(!isRunning);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">Sieve of Eratosthenes Visualizer</h1>
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-2/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Find primes up to:</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="2"
              max="100"
              value={limit}
              onChange={(e) => setLimit(Math.min(100, Math.max(2, parseInt(e.target.value) || 2)))}
              disabled={isRunning}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={resetVisualization}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Speed</label>
          <input
            type="range"
            min="100"
            max="900"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={!isRunning && !completed ? startVisualization : togglePause}
          className={`px-6 py-2 rounded-md flex items-center gap-2 ${isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors`}
        >
          {!isRunning && !completed ? (
            <>
              <Play className="h-5 w-5" /> Start
            </>
          ) : (
            <>
              {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              {isRunning ? 'Pause' : 'Resume'}
            </>
          )}
        </button>
      </div>

      <div className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Number Grid</h2>
          
          <div className="flex justify-center flex-wrap gap-3 mb-6">
            {numbers.map((num) => (
              <div 
                key={num.value} 
                className={`w-12 h-12 flex flex-col items-center justify-center border-2 rounded-lg text-lg font-medium transition-all duration-300 ${
                  num.isActive ? 'bg-blue-100 border-blue-500 scale-110' : 
                  currentMultiples.includes(num.value) ? 'bg-red-100 border-red-500 scale-105' : 
                  num.isMultiple ? 'bg-gray-100 border-gray-300' : 
                  num.isPrime === true ? 'bg-green-100 border-green-500' : 
                  'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  {num.value}
                  {num.isPrime === true && (
                    <Check className="h-4 w-4 ml-1 text-green-600" />
                  )}
                  {num.isPrime === false && (
                    <X className="h-4 w-4 ml-1 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Current Number:</span> {isRunning || completed ? currentNumber : '--'}
              </div>
              <div>
                <span className="font-medium">Marking Multiples:</span> {currentMultiples.join(', ') || '--'}
              </div>
              <div>
                <span className="font-medium">Primes Found:</span> {primes.join(', ') || '--'}
              </div>
              <div>
                <span className="font-medium">Status:</span> 
                {completed ? (
                  <span className="ml-2 text-green-600">Completed!</span>
                ) : isRunning ? (
                  <span className="ml-2 text-blue-600">Running</span>
                ) : (
                  <span className="ml-2 text-gray-600">Ready</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Algorithm Explanation</h2>
        
        <div className="bg-gray-800 text-gray-100 p-4 rounded-md font-mono text-sm">
          <div className="mb-2">function sieveOfEratosthenes(limit) {'{'}</div>
          <div className="ml-4 mb-2">// Create array of numbers from 2 to limit</div>
          <div className="ml-4 mb-2">let primes = new Array(limit + 1).fill(true);</div>
          <div className="ml-4 mb-2">primes[0] = primes[1] = false;</div>
          <div className="ml-4 mb-2">for (let p = 2; p * p {'<='} limit; p++) {'{'}</div>
          <div className="ml-8 mb-2">if (primes[p]) {'{'}</div>
          <div className="ml-12 mb-2">// Mark all multiples of p as non-prime</div>
          <div className="ml-12 mb-2">for (let i = p * p; i {'<='} limit; i += p) {'{'}</div>
          <div className="ml-16 mb-2">primes[i] = false;</div>
          <div className="ml-12 mb-2">{'}'}</div>
          <div className="ml-8 mb-2">{'}'}</div>
          <div className="ml-4 mb-2">{'}'}</div>
          <div className="ml-4 mb-2">// Return array of prime numbers</div>
          <div className="ml-4 mb-2">return primes.map((isPrime, num) ={'>'} isPrime ? num : null).filter(num ={'>'} num);</div>
          <div>{'}'}</div>
        </div>
        
        <div className="mt-4 text-gray-700">
          <p className="mb-2">The Sieve of Eratosthenes works by iteratively marking the multiples of each prime number:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Start with the first number (2) and mark it as prime</li>
            <li>Mark all multiples of that number as non-prime</li>
            <li>Move to the next unmarked number and repeat</li>
            <li>Continue until you've processed numbers up to √n</li>
            <li>All remaining unmarked numbers are primes</li>
          </ol>
          <p className="mt-2 font-medium">Time Complexity: O(n log log n) | Space Complexity: O(n)</p>
        </div>
      </div>
    </div>
  );
}

