'use client';

import React from 'react';

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

interface Relationship {
  fromCollection: string;
  toCollection: string;
  fromPosition: { x: number; y: number };
  toPosition: { x: number; y: number };
  fieldName: string;
}

interface RelationshipArrowsProps {
  collections: Collection[];
  draggedCollectionId?: string;
  dragOffset?: { x: number; y: number };
}

export default function RelationshipArrows({ collections, draggedCollectionId, dragOffset }: RelationshipArrowsProps) {
  // Calculate relationships directly for immediate updates during drag
  const relations: Relationship[] = [];
  
  collections.forEach(collection => {
    collection.documents.forEach(document => {
      document.fields.forEach(field => {
        if (field.type === 'reference' && field.referenceCollection) {
          const targetCollection = collections.find(col => col.id === field.referenceCollection);
          if (targetCollection) {
            // Use more accurate card dimensions (min-w-64 = 256px, typical height ~120-150px)
            const cardWidth = 256;
            const cardHeight = 120;
            
            // Apply drag offset immediately for real-time arrow updates
            const isDraggingFrom = draggedCollectionId === collection.id;
            const isDraggingTo = draggedCollectionId === targetCollection.id;
            
            const fromPosX = collection.position.x + (isDraggingFrom && dragOffset ? dragOffset.x : 0);
            const fromPosY = collection.position.y + (isDraggingFrom && dragOffset ? dragOffset.y : 0);
            const toPosX = targetCollection.position.x + (isDraggingTo && dragOffset ? dragOffset.x : 0);
            const toPosY = targetCollection.position.y + (isDraggingTo && dragOffset ? dragOffset.y : 0);
            
            const fromCenterX = fromPosX + cardWidth / 2;
            const fromCenterY = fromPosY + cardHeight / 2;
            const toCenterX = toPosX + cardWidth / 2;
            const toCenterY = toPosY + cardHeight / 2;
            
            // Calculate connection points on card edges
            const dx = toCenterX - fromCenterX;
            const dy = toCenterY - fromCenterY;
            
            // Determine which edge to connect to based on angle
            let fromX, fromY, toX, toY;
            
            if (Math.abs(dx) > Math.abs(dy)) {
              // Horizontal connection (left/right edges)
              if (dx > 0) {
                // Target is to the right
                fromX = fromPosX + cardWidth;
                fromY = fromCenterY;
                toX = toPosX;
                toY = toCenterY;
              } else {
                // Target is to the left
                fromX = fromPosX;
                fromY = fromCenterY;
                toX = toPosX + cardWidth;
                toY = toCenterY;
              }
            } else {
              // Vertical connection (top/bottom edges)
              if (dy > 0) {
                // Target is below
                fromX = fromCenterX;
                fromY = fromPosY + cardHeight;
                toX = toCenterX;
                toY = toPosY;
              } else {
                // Target is above
                fromX = fromCenterX;
                fromY = fromPosY;
                toX = toCenterX;
                toY = toPosY + cardHeight;
              }
            }
            
            relations.push({
              fromCollection: collection.id,
              toCollection: targetCollection.id,
              fromPosition: { x: fromX, y: fromY },
              toPosition: { x: toX, y: toY },
              fieldName: field.name
            });
          }
        }
      });
    });
  });

  if (relations.length === 0) return null;

  return (
    <svg 
      className="absolute inset-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#3b82f6"
            className="fill-blue-500"
          />
        </marker>
      </defs>
      
      {relations.map((relation: Relationship, index: number) => {
        // const dx = relation.toPosition.x - relation.fromPosition.x;
        // const dy = relation.toPosition.y - relation.fromPosition.y;
        // const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Always use straight lines for simplicity and reliability
        const pathData = `M ${relation.fromPosition.x} ${relation.fromPosition.y} L ${relation.toPosition.x} ${relation.toPosition.y}`;
        const midX = (relation.fromPosition.x + relation.toPosition.x) / 2;
        const midY = (relation.fromPosition.y + relation.toPosition.y) / 2;
        
        return (
          <g key={`${relation.fromCollection}-${relation.toCollection}-${index}`}>
            {/* Arrow line */}
            <path
              d={pathData}
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
              className="stroke-blue-500"
            />
            
            {/* Field name label with background */}
            <rect
              x={midX - relation.fieldName.length * 3}
              y={midY - 8}
              width={relation.fieldName.length * 6}
              height={16}
              fill="white"
              fillOpacity="0.9"
              rx="3"
              className="fill-white dark:fill-gray-800"
              stroke="#3b82f6"
              strokeWidth="1"
            />
            
            <text
              x={midX}
              y={midY + 3}
              textAnchor="middle"
              className="fill-blue-600 dark:fill-blue-400 text-xs font-medium"
              style={{ fontSize: '11px' }}
            >
              {relation.fieldName}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
