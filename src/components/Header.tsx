'use client';

import { useState, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

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

interface HeaderProps {
  collections?: Collection[];
  onImport?: (collections: Collection[]) => void;
}

export default function Header({ collections = [], onImport }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);


  const exportSchema = () => {
    // Create simplified schema format
    const simplifiedSchema: Record<string, Record<string, Record<string, string>>> = {};
    
    collections.forEach(collection => {
      simplifiedSchema[collection.name] = {};
      
      collection.documents.forEach(document => {
        simplifiedSchema[collection.name][document.name] = {};
        
        document.fields.forEach(field => {
          simplifiedSchema[collection.name][document.name][field.name] = field.value;
        });
      });
    });

    const dataStr = JSON.stringify(simplifiedSchema, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `database-schema-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importSchema = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const schema = JSON.parse(e.target?.result as string);
          if (schema.collections && Array.isArray(schema.collections)) {
            // Convert old format to new format if needed
            const collections = schema.collections.map((collection: any) => {
              // If it has the old format (fields directly on collection)
              if (collection.fields && !collection.documents) {
                return {
                  ...collection,
                  documents: collection.fields.length > 0 ? [{
                    id: 'default-doc',
                    name: 'Sample Document',
                    fields: collection.fields.map((field: any) => ({
                      ...field,
                      value: field.value || '',
                      referenceCollection: field.referenceCollection
                    }))
                  }] : [],
                  fields: undefined // Remove old fields property
                };
              }
              // Already in new format
              return collection;
            });
            onImport?.(collections);
          } else {
            alert('Invalid schema format');
          }
        } catch (error) {
          alert('Error parsing JSON file');
        }
      };
      reader.readAsText(file);
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        style={{ display: 'none' }}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Visual NoSQL Designer
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Design your NoSQL database visually
          </span>
          <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
            {theme} Mode
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={importSchema}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Import Schema
          </button>
          
          <button
            onClick={exportSchema}
            disabled={collections.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Export Schema
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Current: ${theme} • Click to switch`}
          >
            {theme === 'light' ? (
              // Moon icon for light mode (to switch to dark)
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              // Sun icon for dark mode (to switch to light)
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
