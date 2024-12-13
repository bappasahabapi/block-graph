/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";

const BLOCK_SIZE = 96;

const PlusMinus = () => {
  const [blocks, setBlocks] = useState([
    { id: "0", x: Math.random() * (window.innerWidth - 300) + 100, y: Math.random() * (window.innerHeight - 300) + 100, parentId: null },
  ]);

  const createNewBlock = (parentId) => {
    const newBlock = {
      id: blocks.length.toString(),
      x: Math.random() * (window.innerWidth - 300) + 100,
      y: Math.random() * (window.innerHeight - 300) + 100,
      parentId,
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (blockId) => {
    setBlocks(blocks.filter((block) => block.id !== blockId && block.parentId !== blockId));
  };

  const handleDrag = (blockId, x, y) => {
    setBlocks(
      blocks.map((block) =>
        block.id === blockId ? { ...block, x, y } : block
      )
    );
  };

  return (
    <div className="h-screen bg-pink-200 flex items-center justify-center relative overflow-hidden">
      {blocks.map((block) => (
        <React.Fragment key={block.id}>
          <Block block={block} onCreateNew={createNewBlock} onRemove={removeBlock} onDrag={handleDrag} />
          {block.parentId && (
            <Line
              parent={blocks.find((b) => b.id === block.parentId)}
              child={block}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const Block = ({ block, onCreateNew, onRemove, onDrag }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({ x: e.clientX - block.x, y: e.clientY - block.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      onDrag(block.id, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="bg-pink-500 text-white w-24 h-24 rounded-md shadow-lg flex flex-col items-center justify-center absolute cursor-move text-lg"
      style={{ left: block.x, top: block.y }}
      onMouseDown={handleMouseDown}
    >
      <span>{block.id}</span>
      <div className="flex justify-between w-full">
        <button
          className="bg-pink-700 w-10 h-6 text-sm rounded-sm"
          onClick={(e) => {
            e.stopPropagation();
            onCreateNew(block.id);
          }}
        >
          +
        </button>
        <button
          className="bg-pink-700 w-10 h-6 text-sm rounded-sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(block.id);
          }}
        >
          -
        </button>
      </div>
    </div>
  );
};

const Line = ({ parent, child }) => {
  const parentCenterX = parent.x + BLOCK_SIZE / 2;
  const parentCenterY = parent.y + BLOCK_SIZE / 2;
  const childCenterX = child.x + BLOCK_SIZE / 2;
  const childCenterY = child.y + BLOCK_SIZE / 2;

  const angle = Math.atan2(childCenterY - parentCenterY, childCenterX - parentCenterX);
  
  const parentEdgeX = parentCenterX + (BLOCK_SIZE / 2) * Math.cos(angle);
  const parentEdgeY = parentCenterY + (BLOCK_SIZE / 2) * Math.sin(angle);

  const childEdgeX = childCenterX - (BLOCK_SIZE / 2) * Math.cos(angle);
  const childEdgeY = childCenterY - (BLOCK_SIZE / 2) * Math.sin(angle);

  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        position: "absolute",
      }}
    >
      <line
        x1={parentEdgeX}
        y1={parentEdgeY}
        x2={childEdgeX}
        y2={childEdgeY}
        stroke="black"
        strokeWidth="2"
        strokeDasharray="5, 5" 
      />
    </svg>
  );
};

export default PlusMinus;