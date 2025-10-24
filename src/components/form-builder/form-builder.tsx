'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCenter } from '@dnd-kit/core';
import { useFormStore } from '@/store/form-store';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { PropertiesPanel } from './properties-panel';
import { BuilderContent } from './builder-content';
import { PreviewContent } from './preview-content';
import { CodeContent } from './code-content';

export function FormBuilder() {
  const [activeTab, setActiveTab] = useState<'builder' | 'preview' | 'code'>('builder');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const { reorderFields, formConfig } = useFormStore();

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    // Handle reordering existing fields within canvas
    if (active.id !== over.id && over.id.toString().startsWith('field-')) {
      const oldIndex = formConfig.fields.findIndex(field => field.id === active.id);
      const newIndex = formConfig.fields.findIndex(field => field.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderFields(oldIndex, newIndex);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        propertiesOpen={propertiesOpen}
        onPropertiesToggle={() => setPropertiesOpen(!propertiesOpen)}
      />
      
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 relative">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar - Always visible */}
          <div className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:relative fixed left-0 top-0 h-full z-50
            transition-transform duration-300 ease-in-out
          `}>
            <Sidebar />
          </div>
          
          {/* Main Content Area - Changes based on active tab */}
          {activeTab === 'builder' && <BuilderContent />}
          {activeTab === 'preview' && <PreviewContent />}
          {activeTab === 'code' && <CodeContent />}
          
          {/* Properties Panel - Always visible, but only functional in builder mode */}
          <div className={`
            ${propertiesOpen ? 'translate-x-0' : 'translate-x-full'}
            lg:translate-x-0 lg:relative fixed right-0 top-0 h-full z-50
            transition-transform duration-300 ease-in-out
          `}>
            <PropertiesPanel />
          </div>
          
          {/* Mobile Properties Overlay */}
          {propertiesOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setPropertiesOpen(false)}
            />
          )}
        </div>
        
        {/* Drag Overlay - Only show in builder mode */}
        {activeTab === 'builder' && (
          <DragOverlay>
            {activeId ? (
              <div className="bg-card border rounded-lg p-3 shadow-lg">
                <span className="text-sm font-medium">
                  {formConfig.fields.find(f => f.id === activeId)?.label || 'Field'}
                </span>
              </div>
            ) : null}
          </DragOverlay>
        )}
      </DndContext>
    </div>
  );
}