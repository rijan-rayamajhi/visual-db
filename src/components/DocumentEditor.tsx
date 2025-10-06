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
  referenceCollection?: string; // For reference type fields
}

interface DocumentEditorProps {
  collection: Collection;
  allCollections: Collection[];
  onUpdate: (collection: Collection) => void;
  onClose: () => void;
}

const FIELD_TYPES = [
  'string',
  'number',
  'boolean',
  'map',
  'array',
  'null',
  'timestamp',
  'geopoint',
  'reference'
];

export default function DocumentEditor({ collection, allCollections, onUpdate, onClose }: DocumentEditorProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [isCreatingField, setIsCreatingField] = useState(false);
  const [newDocumentName, setNewDocumentName] = useState('');
  const [newField, setNewField] = useState<Partial<Field>>({
    name: '',
    value: '',
    type: 'string',
    description: '',
    referenceCollection: ''
  });

  const handleCreateDocument = () => {
    if (newDocumentName.trim()) {
      const newDocument: Document = {
        id: Date.now().toString(),
        name: newDocumentName.trim(),
        fields: []
      };

      const updatedCollection = {
        ...collection,
        documents: [...collection.documents, newDocument]
      };

      onUpdate(updatedCollection);
      setNewDocumentName('');
      setIsCreatingDocument(false);
      setSelectedDocument(newDocument);
    }
  };

  const handleCreateField = () => {
    if (selectedDocument && newField.name?.trim()) {
      const field: Field = {
        id: Date.now().toString(),
        name: newField.name.trim(),
        value: newField.value || '',
        type: newField.type || 'string',
        description: newField.description || '',
        referenceCollection: newField.type === 'reference' ? newField.referenceCollection : undefined
      };

      const updatedDocument = {
        ...selectedDocument,
        fields: [...selectedDocument.fields, field]
      };

      const updatedCollection = {
        ...collection,
        documents: collection.documents.map(doc => 
          doc.id === selectedDocument.id ? updatedDocument : doc
        )
      };

      onUpdate(updatedCollection);
      setSelectedDocument(updatedDocument);
      setNewField({
        name: '',
        value: '',
        type: 'string',
        description: '',
        referenceCollection: ''
      });
      setIsCreatingField(false);
    }
  };

  const handleUpdateField = (fieldId: string, updates: Partial<Field>) => {
    if (!selectedDocument) return;

    const updatedDocument = {
      ...selectedDocument,
      fields: selectedDocument.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    };

    const updatedCollection = {
      ...collection,
      documents: collection.documents.map(doc =>
        doc.id === selectedDocument.id ? updatedDocument : doc
      )
    };

    onUpdate(updatedCollection);
    setSelectedDocument(updatedDocument);
  };

  const handleDeleteField = (fieldId: string) => {
    if (!selectedDocument) return;

    const updatedDocument = {
      ...selectedDocument,
      fields: selectedDocument.fields.filter(field => field.id !== fieldId)
    };

    const updatedCollection = {
      ...collection,
      documents: collection.documents.map(doc =>
        doc.id === selectedDocument.id ? updatedDocument : doc
      )
    };

    onUpdate(updatedCollection);
    setSelectedDocument(updatedDocument);
  };

  const handleDeleteDocument = (documentId: string) => {
    const updatedCollection = {
      ...collection,
      documents: collection.documents.filter(doc => doc.id !== documentId)
    };

    onUpdate(updatedCollection);
    if (selectedDocument?.id === documentId) {
      setSelectedDocument(null);
    }
  };

  return (
    <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {collection.name} Collection
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Documents List */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Documents</h4>
            <button
              onClick={() => setIsCreatingDocument(true)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add Document
            </button>
          </div>

          {isCreatingDocument && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <input
                type="text"
                value={newDocumentName}
                onChange={(e) => setNewDocumentName(e.target.value)}
                placeholder="Document ID (e.g., user123, post456)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleCreateDocument}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreatingDocument(false);
                    setNewDocumentName('');
                  }}
                  className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {collection.documents.map((document) => (
              <div
                key={document.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedDocument?.id === document.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                onClick={() => setSelectedDocument(document)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      {document.name}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {document.fields.length} fields
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDocument(document.id);
                    }}
                    className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Delete Document"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fields Editor */}
        {selectedDocument && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Fields for {selectedDocument.name}
              </h4>
              <button
                onClick={() => setIsCreatingField(true)}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Add Field
              </button>
            </div>

            {isCreatingField && (
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Field Name
                  </label>
                  <input
                    type="text"
                    value={newField.name || ''}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., name, email, age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    value={newField.value || ''}
                    onChange={(e) => setNewField({ ...newField, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., John Doe, john@example.com, 25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={newField.type || 'string'}
                    onChange={(e) => setNewField({ ...newField, type: e.target.value, referenceCollection: '' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {FIELD_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {newField.type === 'reference' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reference Collection
                    </label>
                    <select
                      value={newField.referenceCollection || ''}
                      onChange={(e) => setNewField({ ...newField, referenceCollection: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a collection...</option>
                      {allCollections
                        .filter(col => col.id !== collection.id) // Don't allow self-reference
                        .map(col => (
                          <option key={col.id} value={col.id}>{col.name}</option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      This field will reference documents in the selected collection
                    </p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={handleCreateField}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Field
                  </button>
                  <button
                    onClick={() => {
                      setIsCreatingField(false);
                      setNewField({ name: '', value: '', type: 'string', description: '', referenceCollection: '' });
                    }}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {selectedDocument.fields.map((field) => (
                <div key={field.id} className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {field.name}
                        </span>
                        <span className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                          {field.type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Value:</strong> {field.value || '(empty)'}
                      </div>
                      {field.type === 'reference' && field.referenceCollection && (
                        <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                          <strong>References:</strong> {allCollections.find(col => col.id === field.referenceCollection)?.name || 'Unknown Collection'}
                        </div>
                      )}
                      {field.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {field.description}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteField(field.id)}
                      className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded transition-colors"
                      title="Delete Field"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {selectedDocument.fields.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <p>No fields in this document</p>
                  <p className="text-sm mt-1">Click "Add Field" to create the first field</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!selectedDocument && collection.documents.length > 0 && (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <p>Select a document to view and edit its fields</p>
          </div>
        )}

        {collection.documents.length === 0 && (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <p>No documents in this collection</p>
            <p className="text-sm mt-1">Click "Add Document" to create the first document</p>
          </div>
        )}
      </div>
    </div>
  );
}
