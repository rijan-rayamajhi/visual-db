'use client';

import { useState, useRef } from 'react';
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
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCollectionMove = (collectionId: string, newPosition: { x: number; y: number }) => {
    setCollections(collections.map(collection => 
      collection.id === collectionId 
        ? { ...collection, position: newPosition }
        : collection
    ));
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedCollection(null);
      setShowDocumentEditor(false);
    }
  };

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
        className="flex-1 relative overflow-hidden bg-gray-100 dark:bg-gray-900 canvas-container"
        onClick={handleCanvasClick}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Connection Arrows */}
        <ConnectionArrows collections={collections} />

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
