import  { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, ArrowLeft, ArrowRight } from 'lucide-react';

export default function StringReverseVisualizer() {
  const [inputString, setInputString] = useState('123456789');
  const [charArray, setCharArray] = useState([]);
  const [leftPointer, setLeftPointer] = useState(null);
  const [rightPointer, setRightPointer] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(-50);
  const [completed, setCompleted] = useState(false);
  const [swapCount, setSwapCount] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const timerRef = useRef(null);

  // Initialize character array
  useEffect(() => {
    resetVisualization();
  }, [inputString]);

  const resetVisualization = () => {
    setCharArray(inputString.split(''));
    setLeftPointer(null);
    setRightPointer(null);
    setCompleted(false);
    setSwapCount(0);
    setIsSwapping(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
  };

  const startVisualization = () => {
    resetVisualization();
    setIsRunning(true);
    
    let arr = inputString.split('');
    let left = 0;
    let right = arr.length - 1;
    let count = 0;
    
    timerRef.current = setInterval(() => {
      // Update pointers
      setLeftPointer(left);
      setRightPointer(right);
      
      // Check if pointers have crossed
      if (left >= right) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsRunning(false);
        setCompleted(true);
        return;
      }

      // Visualize swap
      setIsSwapping(true);
      setCharArray([...arr]); // Show before swap
      
      setTimeout(() => {
        // Perform swap
        const temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        count++;
        setSwapCount(count);
        setCharArray([...arr]);
        setIsSwapping(false);
        
        // Move pointers
        left++;
        right--;
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
      <h1 className="text-3xl font-bold text-center text-gray-800">Two Pointer String Reversal</h1>
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-2/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Enter a string to reverse:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputString}
              onChange={(e) => setInputString(e.target.value)}
              disabled={isRunning}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type a word..."
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
        <div className="bg-white  p-6 rounded-lg shadow-md ">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">String Visualization</h2>
          
          <div className="flex justify-center flex-wrap gap-4 mb-6 ">
            {charArray.map((char, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-12 h-12 flex items-center justify-center border-2 rounded-lg text-lg font-medium transition-all duration-300 ${isSwapping && (index === leftPointer || index === rightPointer) ? 'bg-purple-100 border-purple-500 scale-110' : leftPointer === index ? 'bg-blue-100 border-blue-500' : rightPointer === index ? 'bg-red-100 border-red-500' : 'bg-gray-50 border-gray-200'}`}>
                  {char}
                </div>
                <div className="mt-2 text-xs text-gray-500 font-mono">
                  [{index}]
                </div>
                <div className="flex gap-1 mt-1">
                  {leftPointer === index && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full flex items-center">
                      <ArrowLeft className="h-3 w-3 mr-1" /> L
                    </span>
                  )}
                  {rightPointer === index && (
                    <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full flex items-center">
                      <ArrowRight className="h-3 w-3 mr-1" /> R
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg  ">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Left Pointer:</span> {leftPointer !== null ? leftPointer : '--'}
              </div>
              <div>
                <span className="font-medium">Right Pointer:</span> {rightPointer !== null ? rightPointer : '--'}
              </div>
              <div>
                <span className="font-medium">Swaps:</span> {swapCount}
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
          <div className="mb-2">function reverseString(str) {'{'}</div>
          <div className="ml-4 mb-2">let arr = str.split('');</div>
          <div className="ml-4 mb-2">let left = 0;</div>
          <div className="ml-4 mb-2">let right = arr.length - 1;</div>
          <div className="ml-4 mb-2">while (left {'<'} right) {'{'}</div>
          <div className="ml-8 mb-2">// Swap characters</div>
          <div className="ml-8 mb-2">[arr[left], arr[right]] = [arr[right], arr[left]];</div>
          <div className="ml-8 mb-2">left++;</div>
          <div className="ml-8 mb-2">right--;</div>
          <div className="ml-4 mb-2">{'}'}</div>
          <div className="ml-4 mb-2">return arr.join('');</div>
          <div>{'}'}</div>
        </div>
        
        <div className="mt-4 text-gray-700">
          <p className="mb-2">This algorithm uses two pointers that start at opposite ends of the string and move towards each other:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Initialize left pointer at start (0) and right pointer at end (length-1)</li>
            <li>Swap characters at left and right positions</li>
            <li>Move left pointer forward and right pointer backward</li>
            <li>Repeat until pointers meet in the middle</li>
          </ol>
          <p className="mt-2 font-medium">Time Complexity: O(n) | Space Complexity: O(1)</p>
        </div>
      </div>
    </div>
  );
}

