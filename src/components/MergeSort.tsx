"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type ArrayElement = {
  value: number;
  isComparing: boolean;
  isMerging: boolean;
  isInLeft: boolean;
  isInRight: boolean;
  isMidpoint?: boolean;
};

type SortStep = {
  array: ArrayElement[];
  message: string;
  mid?: number;
};

const MergeSortVisualizer: React.FC = () => {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [autoPlay, setAutoPlay] = useState(false);

  // Initialize with a random array
  const generateRandomArray = useCallback(() => {
    const newArray: ArrayElement[] = [];
    const size = Math.floor(Math.random() * 10) + 5; // 5-15 elements
    for (let i = 0; i < size; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 100) + 1,
        isComparing: false,
        isMerging: false,
        isInLeft: false,
        isInRight: false,
      });
    }
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setError("");
    setAutoPlay(false);
  }, []);

  // Initialize with default array
  useEffect(() => {
    generateRandomArray();
  }, [generateRandomArray]);

  // Parse user input
  const handleInputChange = () => {
    if (!inputValue.trim()) {
      generateRandomArray();
      return;
    }

    try {
      const numbers = inputValue
        .split(",")
        .map((str) => parseInt(str.trim(), 10))
        .filter((num) => !isNaN(num));

      if (numbers.length < 2) {
        setError("Please enter at least 2 numbers");
        return;
      }

      if (numbers.length > 20) {
        setError("Please enter no more than 20 numbers");
        return;
      }

      const newArray: ArrayElement[] = numbers.map((num) => ({
        value: num,
        isComparing: false,
        isMerging: false,
        isInLeft: false,
        isInRight: false,
      }));

      setArray(newArray);
      setSteps([]);
      setCurrentStep(0);
      setError("");
      setAutoPlay(false);
    } catch (err) {
      setError("Invalid input. Please enter numbers separated by commas.");
    }
  };

  // Reset visualization
  const resetVisualization = () => {
    setIsSorting(false);
    setIsPaused(false);
    setAutoPlay(false);
    generateRandomArray();
  };

  // Merge function for merge sort
  const merge = async (
    arr: ArrayElement[],
    start: number,
    mid: number,
    end: number,
    stepList: SortStep[]
  ) => {
    const leftArray: ArrayElement[] = [];
    const rightArray: ArrayElement[] = [];

    // Create copies of left and right subarrays
    for (let i = start; i <= mid; i++) {
      leftArray.push({ ...arr[i], isInLeft: true });
    }
    for (let i = mid + 1; i <= end; i++) {
      rightArray.push({ ...arr[i], isInRight: true });
    }

    // Add step showing subarrays
    const subarrayStep = [...arr];
    for (let i = start; i <= mid; i++) {
      subarrayStep[i] = { ...subarrayStep[i], isInLeft: true };
    }
    for (let i = mid + 1; i <= end; i++) {
      subarrayStep[i] = { ...subarrayStep[i], isInRight: true };
    }
    stepList.push({
      array: [...subarrayStep],
      message: `Merging subarrays: [${leftArray.map(el => el.value).join(', ')}] and [${rightArray.map(el => el.value).join(', ')}]`,
      mid
    });

    let i = 0;
    let j = 0;
    let k = start;

    // Merge the arrays back into arr
    while (i < leftArray.length && j < rightArray.length) {
      if (isPaused) {
        await new Promise((resolve) => {
          const checkPaused = () => {
            if (!isPaused) {
              resolve(null);
            } else {
              setTimeout(checkPaused, 100);
            }
          };
          checkPaused();
        });
      }

      // Highlight elements being compared
      const newArr = [...arr];
      newArr[k] = { ...newArr[k], isComparing: true };
      stepList.push({
        array: [...newArr],
        message: `Comparing ${leftArray[i].value} and ${rightArray[j].value}`,
        mid
      });
      
      if (leftArray[i].value <= rightArray[j].value) {
        arr[k] = { ...leftArray[i], isMerging: true };
        i++;
      } else {
        arr[k] = { ...rightArray[j], isMerging: true };
        j++;
      }

      // Update visualization
      stepList.push({
        array: [...arr],
        message: `Merging ${arr[k].value} into position ${k}`,
        mid
      });

      // Reset highlighting
      arr[k] = { ...arr[k], isComparing: false, isMerging: false, isInLeft: false, isInRight: false };
      k++;
    }

    // Copy remaining elements
    while (i < leftArray.length) {
      arr[k] = { ...leftArray[i], isMerging: true };
      stepList.push({
        array: [...arr],
        message: `Adding remaining element ${leftArray[i].value}`,
        mid
      });
      
      arr[k] = { ...arr[k], isMerging: false, isInLeft: false };
      i++;
      k++;
    }

    while (j < rightArray.length) {
      arr[k] = { ...rightArray[j], isMerging: true };
      stepList.push({
        array: [...arr],
        message: `Adding remaining element ${rightArray[j].value}`,
        mid
      });
      
      arr[k] = { ...arr[k], isMerging: false, isInRight: false };
      j++;
      k++;
    }
  };

  // Merge sort implementation
  const mergeSort = async (
    arr: ArrayElement[], 
    start: number, 
    end: number,
    stepList: SortStep[]
  ) => {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    
    // Highlight midpoint
    const midStep = [...arr];
    midStep[mid] = { ...midStep[mid], isMidpoint: true };
    stepList.push({
      array: [...midStep],
      message: `Dividing array from index ${start} to ${end}. Midpoint at index ${mid} (value: ${arr[mid].value})`,
      mid
    });

    // Recursively sort left and right halves
    await mergeSort(arr, start, mid, stepList);
    await mergeSort(arr, mid + 1, end, stepList);

    // Merge the sorted halves
    await merge(arr, start, mid, end, stepList);
  };

  // Start/pause sorting
  const toggleSorting = async () => {
    if (isSorting) {
      if (isPaused) {
        setIsPaused(false);
        setAutoPlay(true);
      } else {
        setIsPaused(true);
        setAutoPlay(false);
      }
      return;
    }

    setIsSorting(true);
    setIsPaused(false);
    setAutoPlay(true);
    
    const stepList: SortStep[] = [];
    const arrCopy = [...array];
    
    await mergeSort(arrCopy, 0, arrCopy.length - 1, stepList);
    
    // Reset all highlighting after sorting
    const finalArray = arrCopy.map(item => ({
      ...item,
      isComparing: false,
      isMerging: false,
      isInLeft: false,
      isInRight: false,
      isMidpoint: false
    }));
    
    stepList.push({
      array: finalArray,
      message: "Sorting complete! Array is now sorted."
    });
    
    setSteps(stepList);
    setCurrentStep(0);
  };

  // Play next step
  const playNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setArray(steps[currentStep + 1].array);
      setIsPaused(true);
      setAutoPlay(false);
    }
  };

  // Play previous step
  const playPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setArray(steps[currentStep - 1].array);
      setIsPaused(true);
      setAutoPlay(false);
    }
  };

  // Auto-play steps
  useEffect(() => {
    if (isSorting && autoPlay && !isPaused && steps.length > 0) {
      const timer = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
          setArray(steps[currentStep + 1].array);
        } else {
          setIsSorting(false);
          setAutoPlay(false);
        }
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [isSorting, autoPlay, isPaused, currentStep, steps, speed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-indigo-800">
              Merge Sort Visualizer
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Visualize how merge sort algorithm works step by step
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="flex-1">
                <Label htmlFor="array-input" className="text-lg font-medium">
                  Customize Array
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="array-input"
                    placeholder="Enter numbers separated by commas (e.g., 5,2,8,1,9)"
                    value={inputValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleInputChange} className="border border-gray-300 bg-white text-gray-800 hover:bg-gray-100">
                    Update
                  </Button>
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                <div className="flex gap-2 mt-3">
                  <Button onClick={generateRandomArray} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                    Generate Random Array
                  </Button>
                  <Button onClick={resetVisualization} className="border border-gray-300 bg-white text-gray-800 hover:bg-gray-100">
                    Reset
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <div>
                  <Label className="text-lg font-medium">Speed Control</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm">Slow</span>
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="100"
                      value={1100 - speed}
                      onChange={(e) => setSpeed(1100 - parseInt(e.target.value))}
                      className="w-32"
                      disabled={isSorting && !isPaused}
                    />
                    <span className="text-sm">Fast</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={toggleSorting} 
                    disabled={array.length < 2 || (isSorting && currentStep === steps.length - 1)}
                    className={
                      `px-4 py-2 rounded-md font-medium transition-colors ` +
                      (isSorting ? (isPaused ? "bg-yellow-500 hover:bg-yellow-600" : "bg-red-500 hover:bg-red-600") : "bg-blue-600 hover:bg-blue-700 text-white")
                    }
                  >
                    {isSorting ? (isPaused ? "Resume" : "Pause") : "Start Sorting"}
                  </Button>
                  <Button 
                    onClick={resetVisualization} 
                    className="border border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                    disabled={!isSorting && steps.length === 0}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            {steps.length > 0 && (
              <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-indigo-800">Current Step</h3>
                  <div className="text-sm text-indigo-600">
                    Step {currentStep + 1} of {steps.length}
                  </div>
                </div>
                <p className="text-gray-700">
                  {steps[currentStep]?.message}
                </p>
                {steps[currentStep]?.mid !== undefined && (
                  <p className="text-sm text-indigo-600 mt-1">
                    Midpoint index: {steps[currentStep].mid}
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <Button 
                    onClick={playPreviousStep} 
                    disabled={currentStep === 0 || isSorting}
                    className="px-2 py-1 text-sm border border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                  >
                    Previous
                  </Button>
                  <Button 
                    onClick={playNextStep} 
                    disabled={currentStep === steps.length - 1 || isSorting}
                    className="px-2 py-1 text-sm border border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Visualization Legend:</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                  <span>Normal element</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div>
                  <span>Comparing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                  <span>Merging</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-300 rounded-sm"></div>
                  <span>Left subarray</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-pink-300 rounded-sm"></div>
                  <span>Right subarray</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-400 rounded-sm"></div>
                  <span>Midpoint</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:gap-4 min-h-[250px] p-4 bg-white rounded-lg border border-gray-200 relative">
              {array.map((item, index) => (
                <div
                  key={index}
                  className={`
                    flex flex-col items-center transition-all duration-300 relative
                    ${item.isComparing ? "bg-yellow-400 scale-110" : ""}
                    ${item.isMerging ? "bg-green-500 scale-105" : ""}
                    ${item.isInLeft ? "bg-purple-300" : ""}
                    ${item.isInRight ? "bg-pink-300" : ""}
                    ${item.isMidpoint ? "bg-orange-400 scale-110" : ""}
                    ${!item.isComparing && !item.isMerging && !item.isInLeft && !item.isInRight && !item.isMidpoint ? "bg-blue-500" : ""}
                    text-white font-bold rounded-md shadow-md
                  `}
                  style={{
                    height: `${Math.max(item.value * 3, 40)}px`,
                    minWidth: "40px",
                  }}
                >
                  <div className="flex items-center justify-center h-full">
                    {item.value}
                  </div>
                  {item.isMidpoint && (
                    <div className="absolute -bottom-6 text-xs font-bold text-orange-600">
                      Mid
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center text-gray-600">
              <p className="mb-2">
                <strong>Merge Sort</strong> is a divide-and-conquer algorithm that divides the array into halves,
                recursively sorts each half, and then merges the sorted halves.
              </p>
              <p>Time Complexity: O(n log n) | Space Complexity: O(n)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MergeSortVisualizer;