'use client';

import { useEffect, useState } from 'react';

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

interface Connection {
  fromId: string;
  toId: string;
  fieldName: string;
  fromPos: { x: number; y: number };
  toPos: { x: number; y: number };
}

interface ConnectionArrowsProps {
  collections: Collection[];
}

const CARD_WIDTH = 256;
const CARD_HEIGHT = 120;

export default function ConnectionArrows({ collections }: ConnectionArrowsProps) {
  const [connections, setConnections] = useState<Connection[]>([]);

  // Recalculate connections whenever collections change
  useEffect(() => {
    const newConnections: Connection[] = [];

    collections.forEach(collection => {
      collection.documents.forEach(document => {
        document.fields.forEach(field => {
          if (field.type === 'reference' && field.referenceCollection) {
            const targetCollection = collections.find(col => col.id === field.referenceCollection);
            if (targetCollection) {
              // Get current positions from DOM elements for real-time updates
              const fromElement = window.document.querySelector(`[data-collection-id="${collection.id}"]`) as HTMLElement;
              const toElement = window.document.querySelector(`[data-collection-id="${targetCollection.id}"]`) as HTMLElement;
              
              let fromPos = collection.position;
              let toPos = targetCollection.position;
              
              // Use actual DOM positions if available (for real-time drag updates)
              if (fromElement) {
                const rect = fromElement.getBoundingClientRect();
                const container = fromElement.closest('.canvas-container');
                if (container) {
                  const containerRect = container.getBoundingClientRect();
                  fromPos = {
                    x: rect.left - containerRect.left,
                    y: rect.top - containerRect.top
                  };
                }
              }
              
              if (toElement) {
                const rect = toElement.getBoundingClientRect();
                const container = toElement.closest('.canvas-container');
                if (container) {
                  const containerRect = container.getBoundingClientRect();
                  toPos = {
                    x: rect.left - containerRect.left,
                    y: rect.top - containerRect.top
                  };
                }
              }

              // Calculate connection points on card edges
              const fromCenterX = fromPos.x + CARD_WIDTH / 2;
              const fromCenterY = fromPos.y + CARD_HEIGHT / 2;
              const toCenterX = toPos.x + CARD_WIDTH / 2;
              const toCenterY = toPos.y + CARD_HEIGHT / 2;

              const dx = toCenterX - fromCenterX;
              const dy = toCenterY - fromCenterY;

              let fromX, fromY, toX, toY;

              // Determine connection points based on relative positions
              if (Math.abs(dx) > Math.abs(dy)) {
                // Horizontal connection
                if (dx > 0) {
                  // Target is to the right
                  fromX = fromPos.x + CARD_WIDTH;
                  fromY = fromCenterY;
                  toX = toPos.x;
                  toY = toCenterY;
                } else {
                  // Target is to the left
                  fromX = fromPos.x;
                  fromY = fromCenterY;
                  toX = toPos.x + CARD_WIDTH;
                  toY = toCenterY;
                }
              } else {
                // Vertical connection
                if (dy > 0) {
                  // Target is below
                  fromX = fromCenterX;
                  fromY = fromPos.y + CARD_HEIGHT;
                  toX = toCenterX;
                  toY = toPos.y;
                } else {
                  // Target is above
                  fromX = fromCenterX;
                  fromY = fromPos.y;
                  toX = toCenterX;
                  toY = toPos.y + CARD_HEIGHT;
                }
              }

              newConnections.push({
                fromId: collection.id,
                toId: targetCollection.id,
                fieldName: field.name,
                fromPos: { x: fromX, y: fromY },
                toPos: { x: toX, y: toY }
              });
            }
          }
        });
      });
    });

    setConnections(newConnections);
  }, [collections]);

  // Update connections on mouse move for real-time drag updates
  useEffect(() => {
    let animationFrame: number;

    const updateConnections = () => {
      const newConnections: Connection[] = [];

      collections.forEach(collection => {
        collection.documents.forEach(document => {
          document.fields.forEach(field => {
            if (field.type === 'reference' && field.referenceCollection) {
              const targetCollection = collections.find(col => col.id === field.referenceCollection);
              if (targetCollection) {
                // Always use DOM positions for real-time updates
                const fromElement = window.document.querySelector(`[data-collection-id="${collection.id}"]`) as HTMLElement;
                const toElement = window.document.querySelector(`[data-collection-id="${targetCollection.id}"]`) as HTMLElement;
                
                if (fromElement && toElement) {
                  const container = fromElement.closest('.canvas-container');
                  if (container) {
                    const containerRect = container.getBoundingClientRect();
                    const fromRect = fromElement.getBoundingClientRect();
                    const toRect = toElement.getBoundingClientRect();
                    
                    const fromPos = {
                      x: fromRect.left - containerRect.left,
                      y: fromRect.top - containerRect.top
                    };
                    const toPos = {
                      x: toRect.left - containerRect.left,
                      y: toRect.top - containerRect.top
                    };

                    // Calculate connection points
                    const fromCenterX = fromPos.x + CARD_WIDTH / 2;
                    const fromCenterY = fromPos.y + CARD_HEIGHT / 2;
                    const toCenterX = toPos.x + CARD_WIDTH / 2;
                    const toCenterY = toPos.y + CARD_HEIGHT / 2;

                    const dx = toCenterX - fromCenterX;
                    const dy = toCenterY - fromCenterY;

                    let fromX, fromY, toX, toY;

                    if (Math.abs(dx) > Math.abs(dy)) {
                      if (dx > 0) {
                        fromX = fromPos.x + CARD_WIDTH;
                        fromY = fromCenterY;
                        toX = toPos.x;
                        toY = toCenterY;
                      } else {
                        fromX = fromPos.x;
                        fromY = fromCenterY;
                        toX = toPos.x + CARD_WIDTH;
                        toY = toCenterY;
                      }
                    } else {
                      if (dy > 0) {
                        fromX = fromCenterX;
                        fromY = fromPos.y + CARD_HEIGHT;
                        toX = toCenterX;
                        toY = toPos.y;
                      } else {
                        fromX = fromCenterX;
                        fromY = fromPos.y;
                        toX = toCenterX;
                        toY = toPos.y + CARD_HEIGHT;
                      }
                    }

                    newConnections.push({
                      fromId: collection.id,
                      toId: targetCollection.id,
                      fieldName: field.name,
                      fromPos: { x: fromX, y: fromY },
                      toPos: { x: toX, y: toY }
                    });
                  }
                }
              }
            }
          });
        });
      });

      setConnections(newConnections);
      animationFrame = requestAnimationFrame(updateConnections);
    };

    // Start continuous updates
    animationFrame = requestAnimationFrame(updateConnections);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [collections]);

  if (connections.length === 0) return null;

  return (
    <svg 
      className="absolute inset-0 pointer-events-none z-10"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <marker
          id="arrowhead-new"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#3b82f6"
          />
        </marker>
      </defs>
      
      {connections.map((connection, index) => {
        const dx = connection.toPos.x - connection.fromPos.x;
        const dy = connection.toPos.y - connection.fromPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Create realistic curves using cubic Bézier with two control points
        const startX = connection.fromPos.x;
        const startY = connection.fromPos.y;
        const endX = connection.toPos.x;
        const endY = connection.toPos.y;
        
        // Determine connection direction for natural curve flow
        const isHorizontal = Math.abs(dx) > Math.abs(dy);
        
        let control1X, control1Y, control2X, control2Y;
        
        if (isHorizontal) {
          // Horizontal connections - curve outward naturally
          const curveOffset = Math.min(80, distance * 0.4);
          control1X = startX + (dx > 0 ? curveOffset : -curveOffset);
          control1Y = startY;
          control2X = endX + (dx > 0 ? -curveOffset : curveOffset);
          control2Y = endY;
        } else {
          // Vertical connections - curve outward naturally
          const curveOffset = Math.min(80, distance * 0.4);
          control1X = startX;
          control1Y = startY + (dy > 0 ? curveOffset : -curveOffset);
          control2X = endX;
          control2Y = endY + (dy > 0 ? -curveOffset : curveOffset);
        }
        
        // Create natural flowing cubic Bézier curve
        const pathData = `M ${startX} ${startY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${endX} ${endY}`;
        
        // Calculate label position on the curve (at t=0.5)
        const labelX = (startX + 3 * control1X + 3 * control2X + endX) / 8;
        const labelY = (startY + 3 * control1Y + 3 * control2Y + endY) / 8;
        
        return (
          <g key={`${connection.fromId}-${connection.toId}-${index}`}>
            {/* Natural curved arrow line */}
            <path
              d={pathData}
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead-new)"
              className="drop-shadow-sm"
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
              }}
            />
            
            {/* Field name label positioned on curve */}
            <rect
              x={labelX - connection.fieldName.length * 3}
              y={labelY - 8}
              width={connection.fieldName.length * 6}
              height={16}
              fill="rgba(255, 255, 255, 0.95)"
              stroke="#3b82f6"
              strokeWidth="1"
              rx="4"
              style={{
                filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1))'
              }}
            />
            
            <text
              x={labelX}
              y={labelY + 3}
              textAnchor="middle"
              className="fill-blue-600 text-xs font-medium"
              style={{ fontSize: '11px' }}
            >
              {connection.fieldName}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
