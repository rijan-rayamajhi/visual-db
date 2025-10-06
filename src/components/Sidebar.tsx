'use client';

import { useState } from 'react';

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

interface SidebarProps {
  collections: Collection[];
  setCollections: (collections: Collection[]) => void;
  selectedCollection: Collection | null;
  setSelectedCollection: (collection: Collection | null) => void;
}

export default function Sidebar({ 
  collections, 
  setCollections, 
  selectedCollection, 
  setSelectedCollection 
}: SidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const createCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection: Collection = {
        id: Date.now().toString(),
        name: newCollectionName.trim(),
        documents: [],
        position: { x: 100, y: 100 }
      };
      
      setCollections([...collections, newCollection]);
      setNewCollectionName('');
      setIsCreating(false);
      setSelectedCollection(newCollection);
    }
  };

  const deleteCollection = (collectionId: string) => {
    setCollections(collections.filter(c => c.id !== collectionId));
    if (selectedCollection?.id === collectionId) {
      setSelectedCollection(null);
    }
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Collections
          </h2>
          <button
            onClick={() => setIsCreating(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Add Collection"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {isCreating && (
          <div className="space-y-2">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Collection name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && createCollection()}
            />
            <div className="flex space-x-2">
              <button
                onClick={createCollection}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewCollectionName('');
                }}
                className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {collections.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-sm">No collections yet</p>
            <p className="text-xs mt-1">Click the + button to create your first collection</p>
          </div>
        ) : (
          <div className="space-y-2">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedCollection?.id === collection.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                onClick={() => setSelectedCollection(collection)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {collection.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(() => {
                        const uniqueFields = new Set();
                        collection.documents.forEach(doc => {
                          doc.fields.forEach(field => uniqueFields.add(field.name));
                        });
                        return uniqueFields.size;
                      })()} fields
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCollection(collection.id);
                    }}
                    className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Delete Collection"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
