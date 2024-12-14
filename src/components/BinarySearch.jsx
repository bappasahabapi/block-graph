// BinarySearch

import { useState, useEffect } from 'react';

const BinarySearch = () => {
  const [array, setArray] = useState([]);
  const [target, setTarget] = useState(0);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [minValue, setMinValue] = useState('0');
  const [maxValue, setMaxValue] = useState('100');
  const [arraySize, setArraySize] = useState('10');

  useEffect(() => {
    const generateRandomArray = () => {
      const arr = [];
      const min = parseInt(minValue);
      const max = parseInt(maxValue);
      const size = parseInt(arraySize);
      for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
      }
      arr.sort((a, b) => a - b);
      setArray(arr);
    };
    generateRandomArray();
  }, [minValue, maxValue, arraySize]);

  useEffect(() => {
    const performBinarySearch = () => {
      const stepsArr = [];
      let left = 0;
      let right = array.length - 1;
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        stepsArr.push({ array, target, left, right, mid });
        if (array[mid] === target) {
          break;
        } else if (array[mid] < target) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
      setSteps(stepsArr);
    };

    if (array.length > 0) {
      performBinarySearch();
    }
  }, [array, target]);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSetTarget = () => {
    const num = parseInt(userInput);
    if (!isNaN(num) && num >= 0) {
      setTarget(num);
      setCurrentStep(0);
    }
    setUserInput('');
  };

  const handleSetArray = () => {
    const min = parseInt(minValue);
    const max = parseInt(maxValue);
    const size = parseInt(arraySize);
    if (!isNaN(min) && !isNaN(max) && !isNaN(size) && size > 0 && min < max) {
      setCurrentStep(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Binary Search Visualizer</h1>
      <div className="flex justify-between mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handlePrevStep}
        >
          Previous Step
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleNextStep}
        >
          Next Step
        </button>
      </div>
      <div className="flex flex-wrap justify-center mb-4">
  {array.map((num, index) => (
    <div key={index} className="flex flex-col items-center mx-2">
      <div
        className={`w-12 h-12 flex justify-center items-center border-2 border-gray-400 rounded-lg ${
          index === steps[currentStep]?.mid
            ? 'bg-green-200'
            : index >= steps[currentStep]?.left && index <= steps[currentStep]?.right
            ? 'bg-yellow-200'
            : 'bg-gray-200'
        }`}
      >
        {num}
      </div>
      <span className="mt-1 text-sm">{index}</span>  {/* Display the index under the number */}
    </div>
  ))}
</div>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-24 h-8 pl-2 border-2 border-gray-400 rounded-lg"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={handleSetTarget}
        >
          Set Target
        </button>
      </div>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={minValue}
          onChange={(e) => setMinValue(e.target.value)}
          className="w-24 h-8 pl-2 border-2 border-gray-400 rounded-lg"
          placeholder="Min Value"
        />
        <input
          type="text"
          value={maxValue}
          onChange={(e) => setMaxValue(e.target.value)}
          className="w-24 h-8 pl-2 border-2 border-gray-400 rounded-lg ml-2"
          placeholder="Max Value"
        />
        <input
          type="text"
          value={arraySize}
          onChange={(e) => setArraySize(e.target.value)}
          className="w-24 h-8 pl-2 border-2 border-gray-400 rounded-lg ml-2"
          placeholder="Array Size"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={handleSetArray}
        >
          Set Array
        </button>
        
      </div>
      <p className="text-lg font-bold mb-4">Target: {target}</p>
      <p className="text-lg font-bold mb-4">
        Current Step: {currentStep + 1} / {steps.length}
      </p>
      <div className="bg-gray-200 p-4 rounded-lg">
        <p className="text-lg font-bold mb-2">Checking Condition:</p>
        <p className="text-lg mb-2">Left: {steps[currentStep]?.left}</p>
        <p className="text-lg mb-2">Right: {steps[currentStep]?.right}</p>
        <p className="text-lg mb-2">Mid: {steps[currentStep]?.mid}</p>
        <p className="text-lg mb-2">
          Array[{steps[currentStep]?.mid}]: {array[steps[currentStep]?.mid]}
        </p>
        <p className="text-lg mb-2">Target: {target}</p>
        <p className="text-lg font-bold mb-2">
          Condition: {array[steps[currentStep]?.mid] === target ? 'Found' : array[steps[currentStep]?.mid] < target ? 'Too Low' : 'Too High'}
        </p>
      </div>
      <h1 className="text-2xl text-center  opacity-50  ">
        Tree Binary Search O(logn)| using react js | bappa saha | page: 01
      </h1>
    </div>
  );
};

export default BinarySearch;
