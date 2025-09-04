import React, { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, Carousel, Form, Hero, MyImage } from 'ui';

interface Item {
  id: string;
  type: string;
  content: string;
  editable?: boolean;
  properties?: {
    // Hero properties
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaUrl?: string;
    // Card properties
    description?: string;
    imageUrl?: string;
    linkUrl?: string;
    // Image properties
    src?: string;
    alt?: string;
    caption?: string;
    // Form properties
    fields?: Array<{ name: string; type: string; label: string; required?: boolean }>;
    submitUrl?: string;
    // Carousel properties
    images?: Array<{ src: string; alt: string; caption?: string }>;
  };
}

interface Template {
  id: string;
  name: string;
  components: Item[];
}

interface EditableItemProps {
  item: Item;
  onUpdate: (id: string, content: string) => void;
}

interface PreviewItemProps {
  item: Item;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

interface ComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComponent: (type: string, isExisting: boolean) => void;
  mode: 'new' | 'existing';
}

const EditableItem: React.FC<EditableItemProps> = ({ item, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.content);

  const handleSave = () => {
    onUpdate(item.id, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(item.content);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          style={{ flex: 1, padding: '4px' }}
          autoFocus
        />
        <button onClick={handleSave} style={{ padding: '4px 8px' }}>Save</button>
        <button onClick={handleCancel} style={{ padding: '4px 8px' }}>Cancel</button>
      </div>
    );
  }

  return (
    <div
      onClick={() => item.editable && setIsEditing(true)}
      style={{
        cursor: item.editable ? 'pointer' : 'default',
        padding: '4px',
        border: item.editable ? '1px dashed #ccc' : 'none'
      }}
    >
      {item.content}
      {item.editable && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>✏️</span>}
    </div>
  );
};

const ComponentModal: React.FC<ComponentModalProps> = ({ isOpen, onClose, onSelectComponent, mode }) => {
  if (!isOpen) return null;

  const newComponents = [
    { type: 'hero', name: 'Hero Section', description: 'Large banner with title and background', icon: '🎯' },
    { type: 'card', name: 'Content Card', description: 'Card layout for content blocks', icon: '📄' },
    { type: 'image', name: 'Image Component', description: 'Image display with placeholder', icon: '🖼️' },
    { type: 'form', name: 'Contact Form', description: 'Form for user input', icon: '📝' },
    { type: 'Carousel', name: 'Image Carousel', description: 'Rotating image gallery', icon: '🎠' }
  ];

  const existingEntries = [
    { id: '1', name: 'Welcome Hero', type: 'hero', lastModified: '2 days ago' },
    { id: '2', name: 'About Us Card', type: 'card', lastModified: '1 week ago' },
    { id: '3', name: 'Product Image', type: 'image', lastModified: '3 days ago' },
    { id: '4', name: 'Contact Form', type: 'form', lastModified: '5 days ago' },
    { id: '5', name: 'Hero Banner', type: 'hero', lastModified: '1 day ago' }
  ];

  const handleSelect = (type: string) => {
    onSelectComponent(type, mode === 'existing');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#333' }}>
            {mode === 'new' ? 'Add New Component' : 'Add Existing Entry'}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mode === 'new' ? (
            newComponents.map((component) => (
              <div
                key={component.type}
                onClick={() => handleSelect(component.type)}
                style={{
                  padding: '16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s',
                  backgroundColor: '#f8f9fa'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e9ecef';
                  e.currentTarget.style.borderColor = '#007bff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }}
              >
                <div style={{ fontSize: '24px' }}>{component.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>{component.name}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{component.description}</div>
                </div>
                <div style={{ color: '#007bff', fontSize: '18px' }}>→</div>
              </div>
            ))
          ) : (
            existingEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => handleSelect(entry.type)}
                style={{
                  padding: '16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s',
                  backgroundColor: '#f8f9fa'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e9ecef';
                  e.currentTarget.style.borderColor = '#007bff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }}
              >
                <div style={{ fontSize: '20px' }}>
                  {entry.type === 'hero' ? '🎯' :
                   entry.type === 'card' ? '📄' :
                   entry.type === 'image' ? '🖼️' :
                   entry.type === 'form' ? '📝' : '📦'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>{entry.name}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Type: {entry.type} • Modified: {entry.lastModified}
                  </div>
                </div>
                <div style={{ color: '#007bff', fontSize: '18px' }}>→</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const PreviewEditableItem: React.FC<EditableItemProps> = ({ item, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.content);

  const handleSave = () => {
    onUpdate(item.id, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(item.content);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '2px solid #007bff',
            borderRadius: '4px',
            fontSize: 'inherit',
            fontWeight: 'inherit'
          }}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
        />
        <div style={{ position: 'absolute', top: '-30px', right: '0', display: 'flex', gap: '4px' }}>
          <button onClick={handleSave} style={{ padding: '2px 6px', fontSize: '12px' }}>✓</button>
          <button onClick={handleCancel} style={{ padding: '2px 6px', fontSize: '12px' }}>✕</button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => item.editable && setIsEditing(true)}
      style={{
        cursor: item.editable ? 'pointer' : 'default',
        padding: '4px',
        borderRadius: '4px',
        transition: 'background-color 0.2s'
      }}
      onMouseEnter={(e) => {
        if (item.editable) {
          e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {item.content}
    </div>
  );
};

const PreviewItem: React.FC<PreviewItemProps> = ({ item, index, moveItem, onUpdate, onDelete }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'preview-item',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'preview-item',
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  drag(drop(ref));

  const renderPreviewContent = () => {
    switch (item.type) {
      case 'hero':
        return (<>
          <Hero />
              <PreviewEditableItem item={item} onUpdate={onUpdate} /> 
        </>
        );
      
      case 'card':
        return (<>
          <Card />
              <PreviewEditableItem item={item} onUpdate={onUpdate} />
           
        </>
        );
      case 'image':
        return (
          <MyImage>
            
          </MyImage>
        );
      case 'form':
        return (
         <Form></Form>
        );
      case 'Carousel':
        return (
          <Carousel></Carousel>
        );
      default:
        return (
          <div style={{ margin: '20px 0', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
            <PreviewEditableItem item={item} onUpdate={onUpdate} />
          </div>
        );
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        position: 'relative',
        margin: '0',
        cursor: isHovered ? 'move' : 'default'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover Overlay */}
      {isHovered && !isDragging && (
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          border: '2px solid #007bff',
          borderRadius: '8px',
          zIndex: 5,
          pointerEvents: 'none'
        }}>
          {/* Component Type Label */}
          <div style={{
            position: 'absolute',
            top: '-25px',
            left: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'capitalize'
          }}>
            {item.type}
          </div>
        </div>
      )}

      {/* Drag Handle - Only visible on hover */}
      {isHovered && !isDragging && (
        <div style={{
          position: 'absolute',
          left: '-35px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: '#007bff',
          color: 'white',
          padding: '6px 8px',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'move',
          zIndex: 10,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>⋮⋮</span>
          <span style={{ fontSize: '10px' }}>DRAG</span>
        </div>
      )}

      {/* Edit Indicator - Only visible on hover */}
      {isHovered && !isDragging && item.editable && (
        <div style={{
          position: 'absolute',
          right: '-35px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: '#28a745',
          color: 'white',
          padding: '6px 8px',
          borderRadius: '6px',
          fontSize: '12px',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
          title="Click to edit"
        >
          <span>✏️</span>
          <span style={{ fontSize: '10px' }}>EDIT</span>
        </div>
      )}

      {/* Delete Button - Only visible on hover */}
      {isHovered && !isDragging && (
        <button
          onClick={() => onDelete(item.id)}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            cursor: 'pointer',
            fontSize: '14px',
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Delete component"
        >
          ×
        </button>
      )}

      {/* Component Content */}
      <div style={{
        border: isDragging ? '2px dashed #007bff' : 'none',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        position: 'relative',
        zIndex: 1
      }}>
        {renderPreviewContent()}
      </div>
    </div>
  );
};

interface DraggableItemProps {
  item: Item;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
}

const DraggableItem: React.FC<DraggableItemProps & { onUpdate: (id: string, content: string) => void }> = ({ item, index, moveItem, onUpdate }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'item',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'item',
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        margin: '4px',
        border: '1px solid #ccc',
        backgroundColor: '#f9f9f9',
        cursor: 'move',
      }}
    >
      <EditableItem item={item} onUpdate={onUpdate} />
    </div>
  );
};

const ContentfulDashboard: React.FC = () => {
  // TODO: Integrate with Contentful API to fetch and update content entries
  // Use contentful-management SDK to get entries and update their order

  const templates: Template[] = [
    {
      id: '1',
      name: 'Home Page',
      components: [
        { id: '1', type: 'hero', content: 'This is home hero', editable: true },
        { id: '2', type: 'Carousel', content: 'This is carusel.', editable: true },
        { id: '3', type: 'card', content: 'This is Card', editable: true },
        { id: '4', type: 'form', content: 'This is form', editable: true },
        { id: '5', type: 'image', content: 'This is image ', editable: false },
      ]
    },
    {
      id: '2',
      name: 'Insights',
      components: [
        { id: '1', type: 'hero', content: 'This is Insight hero', editable: true },
        { id: '2', type: 'Card', content: 'insight card...', editable: true },
        { id: '3', type: 'image', content: 'insight  Image', editable: false },
        { id: '4', type: 'form', content: 'insight form', editable: true },
      
      ]
    },
    {
      id: '3',
      name: 'Pressrelease',
      components: [
        { id: '1', type: 'hero', content: 'This is pressrelease hero', editable: true },
        { id: '2', type: 'image', content: 'Product Image', editable: false },
        { id: '3', type: 'card', content: 'Product description...', editable: true },
        { id: '4', type: 'form', content: 'subscribe', editable: true },
       
      ]
    },
    {
      id: '4',
      name: 'Generic',
      components: [
        { id: '1', type: 'hero', content: 'This is generic hero', editable: true },
        { id: '2', type: 'card', content: 'Get in touch with us...', editable: true },
        { id: '3', type: 'form', content: 'Contact Form', editable: false },
        { id: '4', type: 'image', content: 'Address: 123 Main St', editable: true },
        
      ]
    }
  ];

  const [selectedTemplate, setSelectedTemplate] = useState<string>('1');
  const [items, setItems] = useState<Item[]>(templates[0].components);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'new' | 'existing'>('new');

  const selectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setItems(template.components);
    }
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);
  };

  const updateItem = (id: string, content: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, content } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const openModal = (mode: 'new' | 'existing') => {
    setModalMode(mode);
    setModalOpen(true);
  };

  const handleComponentSelect = (type: string, isExisting: boolean) => {
    const newId = Date.now().toString();
    const newComponent: Item = {
      id: newId,
      type,
      content: isExisting ? `Existing ${type} entry` : `New ${type} component`,
      editable: true
    };
    setItems([...items, newComponent]);
  };

  const renderPreview = (item: Item, index: number) => {
    return (
      <PreviewItem
        key={item.id}
        item={item}
        index={index}
        moveItem={moveItem}
        onUpdate={updateItem}
        onDelete={deleteItem}
      />
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: '20px', display: 'flex', gap: '20px', height: '100vh' }}>
        {/* Sidebar with Templates */}
        <div style={{ width: '250px', border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
          <h3>Page Templates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => selectTemplate(template.id)}
                style={{
                  padding: '8px',
                  backgroundColor: selectedTemplate === template.id ? '#007bff' : '#f8f9fa',
                  color: selectedTemplate === template.id ? 'white' : 'black',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
       {/*    <div>
            <h1>Contentful Dashboard - Drag and Drop Preview Editor</h1>
            <h2>Editor Panel - {templates.find(t => t.id === selectedTemplate)?.name}</h2>
            <div>
              {items.map((item, index) => (
                <DraggableItem
                  key={item.id}
                  item={item}
                  index={index}
                  moveItem={moveItem}
                  onUpdate={updateItem}
                />
              ))}
            </div>
          </div>  */}

          {/* Live Preview */}
          <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
            <h2>Live Preview</h2>
            <div style={{
              border: 'none',
              padding: '0',
              minHeight: '500px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              position: 'relative',
              boxShadow: '0 0 20px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
            

              {/* Page content */}
              <div style={{
                padding: '0',
                backgroundColor: '#ffffff',
                minHeight: '400px'
              }}>
                {items.length === 0 ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '300px',
                    color: '#6c757d',
                    textAlign: 'center',
                    padding: '20px'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>📄</div>
                    <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>No components yet</h3>
                    <p style={{ margin: '0', fontSize: '16px' }}>Click the buttons below to add components to your page</p>
                  </div>
                ) : (
                  <div style={{ padding: '20px' }}>
                    {items.map((item, index) => renderPreview(item, index))}
                  </div>
                )}
              </div>
            </div>

            {/* Add Component Buttons Below Preview */}
            <div style={{
              marginTop: '15px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#495057', fontWeight: 'bold' }}>Add Components:</h4>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => openModal('new')}
                  style={{
                    padding: '12px 20px',
                    fontSize: '14px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 4px rgba(0,123,255,0.2)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0056b3';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#007bff';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>➕</span>
                  Add New Entry
                </button>
                <button
                  onClick={() => openModal('existing')}
                  style={{
                    padding: '12px 20px',
                    fontSize: '14px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 4px rgba(40,167,69,0.2)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1e7e34';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#28a745';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>📚</span>
                  Add Existing Entry
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Component Selection Modal */}
        <ComponentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSelectComponent={handleComponentSelect}
          mode={modalMode}
        />
      </div>
    </DndProvider>
  );
};

export default ContentfulDashboard;

