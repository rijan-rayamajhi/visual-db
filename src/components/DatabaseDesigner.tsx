'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import CollectionCard from './CollectionCard';
import DocumentEditor from './DocumentEditor';
import ConnectionArrows from './ConnectionArrows';

interface Collection {
  id: string;
  name: string;
  documents: Document[];
  position: { x: number; y: number };
}

interface Document {
  id: string;
  name: string;
  fields: Field[];
}

interface Field {
  id: string;
  name: string;
  value: string;
  type: string;
  description?: string;
  referenceCollection?: string;
}

interface DatabaseDesignerProps {
  collections: Collection[];
  setCollections: (collections: Collection[]) => void;
  selectedCollection: Collection | null;
  setSelectedCollection: (collection: Collection | null) => void;
}

export default function DatabaseDesigner({ 
  collections, 
  setCollections, 
  selectedCollection, 
  setSelectedCollection 
}: DatabaseDesignerProps) {
  const [showDocumentEditor, setShowDocumentEditor] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  const MIN_ZOOM = 0.25;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.1;

  const handleCollectionMove = (collectionId: string, newPosition: { x: number; y: number }) => {
    setCollections(collections.map(collection => 
      collection.id === collectionId 
        ? { ...collection, position: newPosition }
        : collection
    ));
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isPanning) {
      setSelectedCollection(null);
      setShowDocumentEditor(false);
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      e.preventDefault();
    }
  }, [panOffset]);

  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      const newOffset = {
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      };
      setPanOffset(newOffset);
    }
  }, [isPanning, panStart]);

  const handleGlobalMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Add global mouse event listeners for smooth panning
  useEffect(() => {
    if (isPanning) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isPanning, handleGlobalMouseMove, handleGlobalMouseUp]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Prevent all default wheel behaviors including browser navigation
    e.preventDefault();
    e.stopPropagation();
    
    // Check if Ctrl/Cmd key is pressed for zooming
    if (e.ctrlKey || e.metaKey) {
      const zoomDelta = -e.deltaY * 0.001;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel + zoomDelta));
      setZoomLevel(newZoom);
    } else {
      // Regular panning
      const sensitivity = 1;
      const newOffset = {
        x: panOffset.x - (e.deltaX * sensitivity),
        y: panOffset.y - (e.deltaY * sensitivity)
      };
      setPanOffset(newOffset);
    }
  }, [panOffset, zoomLevel]);

  // Add global wheel event listener to prevent browser navigation
  useEffect(() => {
    const handleGlobalWheel = (e: WheelEvent) => {
      if (canvasRef.current?.contains(e.target as Node)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Add passive: false to ensure preventDefault works
    document.addEventListener('wheel', handleGlobalWheel, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', handleGlobalWheel);
    };
  }, []);

  const zoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const resetView = useCallback(() => {
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(1);
  }, []);

  const updateCollection = (updatedCollection: Collection) => {
    setCollections(collections.map(collection => 
      collection.id === updatedCollection.id ? updatedCollection : collection
    ));
    setSelectedCollection(updatedCollection);
  };
  return (
    <div className="flex-1 flex">
      {/* Main Canvas */}
      <div 
        ref={canvasRef}
        className={`flex-1 relative overflow-hidden bg-gray-100 dark:bg-gray-900 canvas-container ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          touchAction: 'none',
          overscrollBehavior: 'none'
        }}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        {/* Zoom and View Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
          {/* Zoom In */}
          <button
            onClick={zoomIn}
            disabled={zoomLevel >= MAX_ZOOM}
            className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom In (Ctrl + Scroll)"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>

          {/* Zoom Level Display */}
          <div className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-xs text-center text-gray-600 dark:text-gray-400 min-w-[60px]">
            {Math.round(zoomLevel * 100)}%
          </div>

          {/* Zoom Out */}
          <button
            onClick={zoomOut}
            disabled={zoomLevel <= MIN_ZOOM}
            className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom Out (Ctrl + Scroll)"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </button>

          {/* Reset View */}
          <button
            onClick={resetView}
            className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="Reset View (Center & 100%)"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>

        {/* Infinite Grid Background - Fixed to viewport */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: `${20 * zoomLevel}px ${20 * zoomLevel}px`,
            backgroundPosition: `${(panOffset.x * zoomLevel) % (20 * zoomLevel)}px ${(panOffset.y * zoomLevel) % (20 * zoomLevel)}px`
          }}
        />

        {/* Pannable Content Container */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.1s ease-out'
          }}
        >

          {/* Connection Arrows */}
          <ConnectionArrows collections={collections} zoomLevel={zoomLevel} />

          {/* Collections */}
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              isSelected={selectedCollection?.id === collection.id}
              onMove={handleCollectionMove}
              onSelect={() => {
                setSelectedCollection(collection);
                setShowDocumentEditor(false);
              }}
              onEdit={() => {
                setSelectedCollection(collection);
                setShowDocumentEditor(true);
              }}
            />
          ))}
        </div>

        {/* Empty State */}
        {collections.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              <h3 className="text-lg font-medium mb-2">Start Designing Your Database</h3>
              <p className="text-sm">Create collections from the sidebar to begin designing your NoSQL database</p>
            </div>
          </div>
        )}
      </div>

      {/* Document Editor Panel */}
      {showDocumentEditor && selectedCollection && (
        <DocumentEditor
          collection={selectedCollection}
          allCollections={collections}
          onUpdate={updateCollection}
          onClose={() => setShowDocumentEditor(false)}
        />
      )}
    </div>
  );
}
