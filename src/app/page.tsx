'use client';

import { useState } from 'react';
import DatabaseDesigner from '@/components/DatabaseDesigner';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

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

export default function Home() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  const handleImport = (importedCollections: Collection[]) => {
    setCollections(importedCollections);
    setSelectedCollection(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header collections={collections} onImport={handleImport} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          collections={collections}
          setCollections={setCollections}
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
        />
        <DatabaseDesigner 
          collections={collections}
          setCollections={setCollections}
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
        />
      </div>
    </div>
  );
}
