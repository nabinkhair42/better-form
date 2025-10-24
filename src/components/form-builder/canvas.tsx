'use client';

import { useState, useRef, useCallback } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useFormStore } from '@/store/form-store';
import { SortableField } from './sortable-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit2, ZoomIn, ZoomOut, RotateCcw, Plus } from 'lucide-react';

export function Canvas() {
  const { formConfig, updateFormMeta } = useFormStore();
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTitleSubmit = (value: string) => {
    updateFormMeta({ name: value || 'Untitled Form' });
    setEditingTitle(false);
  };

  const handleDescriptionSubmit = (value: string) => {
    updateFormMeta({ description: value || 'Form description' });
    setEditingDescription(false);
  };

  // Zoom functionality
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
    setCanvasOffset({ x: 0, y: 0 });
  };

  // Canvas panning functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start panning if clicking on the canvas background, not on form elements
    const target = e.target as HTMLElement;
    const isCanvasBackground = target === canvasRef.current ||
      target.classList.contains('canvas-background');

    if (isCanvasBackground && e.button === 0) { // Only left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
      e.preventDefault();
    }
  }, [canvasOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setCanvasOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Wheel zoom functionality
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -10 : 10;
      setZoom(prev => Math.max(50, Math.min(200, prev + delta)));
    }
    // Prevent default scrolling behavior on canvas
    e.preventDefault();
  }, []);

  const dotSize = 2;
  const dotSpacing = 20;
  const scaledSpacing = dotSpacing * (zoom / 100);

  return (
    <div className="w-full h-full flex flex-col relative bg-[#1a1a1a]">
      {/* Zoom Controls - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="flex items-center gap-2 bg-card border rounded-lg p-2 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[3rem] text-center">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetZoom}
            className="h-8 w-8 p-0"
            title="Reset zoom and position"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas Area with Dotted Background */}
      <div
        ref={canvasRef}
        className="flex-1 overflow-hidden relative bg-muted/90"
        style={{
          cursor: isDragging ? 'grabbing' : 'default',
          backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.15) ${dotSize}px, transparent ${dotSize}px)`,
          backgroundSize: `${scaledSpacing}px ${scaledSpacing}px`,
          backgroundPosition: `${canvasOffset.x % scaledSpacing}px ${canvasOffset.y % scaledSpacing}px`,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      >
        {/* Canvas Content Container */}
        <div
          ref={contentRef}
          className="absolute inset-0"
          style={{
            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom / 100})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Centered Form Container */}
          <div className="flex items-start justify-center w-full h-full pt-16">
            <div className="w-full max-w-2xl mx-8">
              {/* Form Header */}
              <div className="mb-8 bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                {editingTitle ? (
                  <Input
                    defaultValue={formConfig.name}
                    className="text-2xl font-semibold border-none p-0 h-auto bg-transparent focus-visible:ring-0"
                    onBlur={(e) => handleTitleSubmit(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleTitleSubmit(e.currentTarget.value);
                      }
                      if (e.key === 'Escape') {
                        setEditingTitle(false);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <div
                    className="group flex items-center gap-2 cursor-pointer"
                    onClick={() => setEditingTitle(true)}
                  >
                    <h2 className="text-2xl font-semibold text-foreground">
                      {formConfig.name}
                    </h2>
                    <Edit2 className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}

                {editingDescription ? (
                  <Textarea
                    defaultValue={formConfig.description}
                    className="text-sm text-muted-foreground mt-2 border-none p-0 bg-transparent focus-visible:ring-0 resize-none"
                    onBlur={(e) => handleDescriptionSubmit(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleDescriptionSubmit(e.currentTarget.value);
                      }
                      if (e.key === 'Escape') {
                        setEditingDescription(false);
                      }
                    }}
                    autoFocus
                    rows={2}
                  />
                ) : (
                  <div
                    className="group flex items-center gap-2 cursor-pointer mt-2"
                    onClick={() => setEditingDescription(true)}
                  >
                    <p className="text-sm text-muted-foreground">
                      {formConfig.description}
                    </p>
                    <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </div>

              {/* Form Fields Area */}
              <div
                className="min-h-[500px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 bg-white dark:bg-gray-900 shadow-lg"
                style={{ cursor: 'default' }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {formConfig.fields.length === 0 ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Plus className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-lg mb-2 font-medium text-gray-700 dark:text-gray-300">No fields yet</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Click the + button in the sidebar to add fields</p>
                    </div>
                  </div>
                ) : (
                  <SortableContext
                    items={formConfig.fields.map(field => field.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {formConfig.fields.map((field) => (
                        <SortableField key={field.id} field={field} />
                      ))}
                    </div>
                  </SortableContext>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Instructions */}
      <div className="absolute bottom-4 left-4 bg-card border rounded-lg p-3 shadow-sm text-xs text-muted-foreground max-w-48">
        <div className="space-y-1">
          <div>• Click + in sidebar to add fields</div>
          <div>• Drag canvas background to pan</div>
          <div>• Ctrl/Cmd + Scroll to zoom</div>
          <div>• Drag fields to reorder</div>
        </div>
      </div>
    </div>
  );
}