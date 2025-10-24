'use client';

import { Button } from '@/components/ui/button';
import { useFormStore } from '@/store/form-store';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  activeTab: 'builder' | 'preview' | 'code';
  onTabChange: (tab: 'builder' | 'preview' | 'code') => void;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  propertiesOpen: boolean;
  onPropertiesToggle: () => void;
}

export function Header({ 
  activeTab, 
  onTabChange, 
  sidebarOpen, 
  onSidebarToggle,
  propertiesOpen,
  onPropertiesToggle 
}: HeaderProps) {
  const { formConfig, clearForm, selectedFieldId } = useFormStore();

  return (
    <header className="border-b border-border bg-card px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and mobile sidebar toggle */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="lg:hidden h-8 w-8 p-0"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          <h1 className="text-xl font-semibold text-foreground">
            formcn
          </h1>
        </div>

        {/* Center - Navigation tabs */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
          <Button
            variant={activeTab === 'builder' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('builder')}
            className="h-8"
          >
            Builder
          </Button>
          <Button
            variant={activeTab === 'preview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('preview')}
            className="h-8"
          >
            Preview
          </Button>
          <Button
            variant={activeTab === 'code' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('code')}
            className="h-8"
          >
            Code
          </Button>
        </div>
        
        {/* Right side - Field count and actions */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {formConfig.fields.length} field{formConfig.fields.length !== 1 ? 's' : ''}
          </span>
          
          {/* Mobile properties toggle - only show when field is selected */}
          {selectedFieldId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onPropertiesToggle}
              className="lg:hidden h-8 w-8 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={clearForm}
            disabled={formConfig.fields.length === 0}
            className="hidden sm:flex"
          >
            Clear Form
          </Button>
        </div>
      </div>
    </header>
  );
}