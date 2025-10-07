'use client';

import { useState } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const scrollToDocumentation = () => {
    const docSection = document.getElementById('documentation-section');
    if (docSection) {
      docSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const documentationSections = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Visual NoSQL Designer is a powerful tool for designing and visualizing NoSQL database schemas. 
            Create collections, define documents with fields, and visualize relationships between your data structures.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">✨ Visual Design</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Drag and drop interface for creating and organizing your database schema visually.
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">🔗 Relationships</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Define and visualize relationships between collections with interactive arrows.
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">📤 Export</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Export your schema as clean JSON for use in your applications.
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">🎨 Themes</h4>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Light, dark, and system theme support for comfortable designing.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'collections',
      title: 'Creating Collections',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Collections are the primary containers for your documents. Think of them as tables in a relational database.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">How to create a collection:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Click the <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded font-mono text-xs">+ Add Collection</span> button in the sidebar</li>
              <li>Enter a descriptive name for your collection (e.g., &quot;users&quot;, &quot;products&quot;, &quot;orders&quot;)</li>
              <li>The collection will appear in the main canvas where you can drag it to position</li>
              <li>Click on the collection to select it and start adding documents</li>
            </ol>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Best Practices</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>Use plural names for collections (users, not user)</li>
              <li>Keep names lowercase and use underscores for spaces</li>
              <li>Group related data in the same collection</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'documents',
      title: 'Adding Documents & Fields',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Documents are individual records within a collection, and fields define the structure of your data.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Adding Documents:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Select a collection by clicking on it</li>
              <li>Click <span className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded font-mono text-xs">+ Add Document</span> in the sidebar</li>
              <li>Give your document a meaningful name</li>
              <li>Start adding fields to define the document structure</li>
            </ol>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Adding Fields:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>With a document selected, click <span className="bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded font-mono text-xs">+ Add Field</span></li>
              <li>Enter the field name (e.g., &quot;email&quot;, &quot;age&quot;, &quot;created_at&quot;)</li>
              <li>Choose the appropriate data type (String, Number, Boolean, Date, etc.)</li>
              <li>Add a sample value to help visualize the data</li>
              <li>Optionally add a description for documentation</li>
            </ol>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">🏷️ Field Types</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-yellow-700 dark:text-yellow-300">
              <div><span className="font-mono bg-yellow-100 dark:bg-yellow-900 px-1 rounded">String</span> - Text data</div>
              <div><span className="font-mono bg-yellow-100 dark:bg-yellow-900 px-1 rounded">Number</span> - Numeric values</div>
              <div><span className="font-mono bg-yellow-100 dark:bg-yellow-900 px-1 rounded">Boolean</span> - True/false values</div>
              <div><span className="font-mono bg-yellow-100 dark:bg-yellow-900 px-1 rounded">Date</span> - Date/time values</div>
              <div><span className="font-mono bg-yellow-100 dark:bg-yellow-900 px-1 rounded">Array</span> - List of values</div>
              <div><span className="font-mono bg-yellow-100 dark:bg-yellow-900 px-1 rounded">Object</span> - Nested objects</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'relationships',
      title: 'ER Diagrams & Relationships',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Create relationships between collections to model how your data connects, similar to foreign keys in relational databases.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Creating Relationships:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Create a field in one collection that references another collection</li>
              <li>Set the field type to reference the target collection</li>
              <li>Visual arrows will automatically appear showing the relationship</li>
              <li>Drag collections around to organize your ER diagram</li>
            </ol>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">🔗 Relationship Types</h4>
            <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
              <div><strong>One-to-One:</strong> Each document in collection A relates to exactly one document in collection B</div>
              <div><strong>One-to-Many:</strong> One document in collection A relates to multiple documents in collection B</div>
              <div><strong>Many-to-Many:</strong> Multiple documents in collection A relate to multiple documents in collection B</div>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">📊 Visual Features</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-purple-700 dark:text-purple-300">
              <li>Automatic arrow drawing between related collections</li>
              <li>Drag and drop to reposition collections</li>
              <li>Clear visual indication of data flow</li>
              <li>Interactive canvas for exploring relationships</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'export',
      title: 'Export & Usage',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Export your schema design as clean JSON that can be used in your applications or for documentation.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">How to Export:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Click the <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded font-mono text-xs">Export Schema</span> button in the header</li>
              <li>Your schema will be downloaded as a JSON file</li>
              <li>Use this file in your application or share it with your team</li>
            </ol>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Example Export Format:</h4>
            <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`{
  "users": {
    "user_profile": {
      "id": "string",
      "email": "user@example.com",
      "name": "John Doe",
      "age": 30,
      "created_at": "2024-01-01"
    }
  },
  "posts": {
    "blog_post": {
      "id": "string",
      "title": "Sample Post",
      "content": "Post content...",
      "author_id": "reference:users",
      "published": true
    }
  }
}`}
            </pre>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💾 Import Feature</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              You can also import previously exported schemas using the Import button in the header. 
              This allows you to continue working on saved designs or share schemas with team members.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Visual NoSQL Designer
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Design, visualize, and export your NoSQL database schemas with an intuitive drag-and-drop interface
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
              >
                🚀 Get Started
              </button>
              <button
                onClick={scrollToDocumentation}
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 text-lg"
              >
                📖 View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Section */}
      <div id="documentation-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            User Documentation
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Learn how to use Visual NoSQL Designer to create amazing database schemas
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <nav className="space-y-2">
                {documentationSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              {documentationSections.map((section) => (
                <div
                  key={section.id}
                  className={activeSection === section.id ? 'block' : 'hidden'}
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {section.title}
                  </h3>
                  {section.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Design Your Database?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start creating your NoSQL schema visually and export it for your applications
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
          >
            🎨 Open Visual Designer
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Visual NoSQL Designer - Create beautiful database schemas visually
          </p>
        </div>
      </footer>
    </div>
  );
}
