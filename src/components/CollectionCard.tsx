'use client';

import { useState, useRef, useEffect } from 'react';

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

interface CollectionCardProps {
  collection: Collection;
  isSelected: boolean;
  onMove: (collectionId: string, newPosition: { x: number; y: number }) => void;
  onSelect: () => void;
  onEdit: () => void;
  onDragStart?: (collectionId: string) => void;
  onDragEnd?: () => void;
  onDragMove?: (collectionId: string, offset: { x: number; y: number }) => void;
}

export default function CollectionCard({ 
  collection, 
  isSelected, 
  onMove, 
  onSelect, 
  onEdit,
  onDragStart,
  onDragEnd,
  onDragMove
}: CollectionCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - collection.position.x,
      y: e.clientY - collection.position.y
    });
    onSelect();
    onDragStart?.(collection.id);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: Math.max(0, e.clientX - dragStart.x), // Prevent negative positions
      y: Math.max(0, e.clientY - dragStart.y)
    };
    
    // Update drag offset for immediate visual feedback
    const offset = {
      x: newPosition.x - collection.position.x,
      y: newPosition.y - collection.position.y
    };
    setDragOffset(offset);
    
    // Immediate synchronous updates for real-time arrow tracking
    onDragMove?.(collection.id, offset);
    onMove(collection.id, newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    onDragEnd?.();
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'string':
        return 'T';
      case 'number':
        return '#';
      case 'boolean':
        return 'B';
      case 'timestamp':
        return 'D';
      case 'array':
        return '[]';
      case 'map':
        return '{}';
      case 'reference':
        return '→';
      case 'geopoint':
        return 'G';
      case 'null':
        return '∅';
      default:
        return 'F';
    }
  };

  return (
    <div
      ref={cardRef}
      data-collection-id={collection.id}
      className={`absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 transition-all cursor-move select-none min-w-64 ${
        isSelected 
          ? 'border-blue-500 shadow-blue-200 dark:shadow-blue-900/50' 
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
      } ${isDragging ? 'shadow-xl scale-105' : ''}`}
      style={{
        left: collection.position.x,
        top: collection.position.y,
        zIndex: isSelected ? 10 : 1
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
            <span className="mr-2 text-blue-600">DB</span>
            {collection.name}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded transition-colors"
            title="Edit Fields"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="p-4">
        <div className="space-y-2">
          {(() => {
            // Get all unique field names, types, and sample values from all documents
            const allFields = new Map<string, { 
              type: string; 
              referenceCollection?: string; 
              sampleValue: string;
            }>();
            
            collection.documents.forEach(document => {
              document.fields.forEach(field => {
                if (!allFields.has(field.name)) {
                  allFields.set(field.name, { 
                    type: field.type, 
                    referenceCollection: field.referenceCollection,
                    sampleValue: field.value || '(empty)'
                  });
                }
              });
            });

            const fieldsArray = Array.from(allFields.entries()).slice(0, 6);
            
            return fieldsArray.map(([fieldName, fieldInfo]) => (
              <div key={fieldName} className="flex items-center justify-between text-sm py-1">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <span className="font-medium text-gray-900 dark:text-white truncate">
                    {fieldName}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    ({fieldInfo.type})
                  </span>
                  {fieldInfo.type === 'reference' && fieldInfo.referenceCollection && (
                    <span className="text-blue-500 text-xs" title="Reference">→</span>
                  )}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-24">
                  {fieldInfo.sampleValue}
                </div>
              </div>
            ));
          })()}
          
          {(() => {
            const totalFields = new Set();
            collection.documents.forEach(doc => {
              doc.fields.forEach(field => totalFields.add(field.name));
            });
            
            if (totalFields.size > 6) {
              return (
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
                  +{totalFields.size - 6} more fields
                </div>
              );
            }
            
            if (totalFields.size === 0) {
              return (
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                  No fields defined
                </div>
              );
            }
            
            return null;
          })()}
        </div>
      </div>
    </div>
  );
}
