"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface AdminFormProps {
  assignments: { 1: string[]; 2: string[]; 3: string[] };
  ALL_COMPONENTS: { key: string; label: string }[];
  onSubmit: (data: { 1: string[]; 2: string[]; 3: string[] }) => Promise<void>;
}

export default function AdminForm({ assignments, ALL_COMPONENTS, onSubmit }: AdminFormProps) {
  const [selected, setSelected] = useState(assignments);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  
  const isFieldAssignedToPage = (fieldKey: string, page: number) => {
    return selected[page as keyof typeof selected].includes(fieldKey);
  };


  const getFieldAssignedPage = (fieldKey: string): number | null => {
    if (selected[1].includes(fieldKey)) return 1;
    if (selected[2].includes(fieldKey)) return 2;
    if (selected[3].includes(fieldKey)) return 3;
    return null;
  };

 
  const isFieldDisabled = (fieldKey: string, currentPage: number) => {
    const assignedPage = getFieldAssignedPage(fieldKey);
    return assignedPage !== null && assignedPage !== currentPage;
  };

  const handleCheckbox = (page: 1 | 2 | 3, fieldKey: string, checked: boolean) => {
    setSelected(prev => {
      const newSelected = { ...prev };
      
      if (checked) {
      
        newSelected[1] = newSelected[1].filter(f => f !== fieldKey);
        newSelected[2] = newSelected[2].filter(f => f !== fieldKey);
        newSelected[3] = newSelected[3].filter(f => f !== fieldKey);
      
        newSelected[page] = [...newSelected[page], fieldKey];
      } else {
        
        newSelected[page] = newSelected[page].filter(f => f !== fieldKey);
      }
      
      return newSelected;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
   
    setError(null);
    
    // Simple check - ensure each page has at least one field
    const page1Fields = selected[1].length;
    const page2Fields = selected[2].length;
    const page3Fields = selected[3].length;
    
    console.log('Page 1 fields:', page1Fields);
    console.log('Page 2 fields:', page2Fields);
    console.log('Page 3 fields:', page3Fields);
    
    if (page1Fields === 0 || page2Fields === 0 || page3Fields === 0) {
      const errorMsg = "Please select at least one field per page before saving.";
      console.log('Setting error:', errorMsg);
      setError(errorMsg);
      return; 
    }
    
    console.log('Validation passed, proceeding with save');
    setLoading(true);
    try {
      await onSubmit(selected);
    } catch (error) {
      console.error('Save error:', error);
      setError("Failed to save configuration. You need to select atleast one field per page Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Admin: Configure Onboarding Pages</h1>
      <p className="text-gray-600 mb-6">Assign fields to pages. Each field can only be assigned to one page at a time.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-8">
          {[1, 2, 3].map(page => (
            <div key={page} className="border rounded-lg p-6 bg-gray-50">
              <h2 className="text-lg font-semibold mb-4">Page {page}</h2>
              <div className="space-y-3">
                {ALL_COMPONENTS.map(comp => {
                  const isChecked = isFieldAssignedToPage(comp.key, page);
                  const isDisabled = isFieldDisabled(comp.key, page);
                  const assignedPage = getFieldAssignedPage(comp.key);
                  
                  return (
                    <div key={comp.key} className="flex items-center space-x-2">
                      <Checkbox
                        checked={isChecked}
                        disabled={isDisabled}
                        onCheckedChange={(checked) => 
                          handleCheckbox(page as 1 | 2 | 3, comp.key, checked as boolean)
                        }
                        id={`${comp.key}-page-${page}`}
                      />
                      <label 
                        htmlFor={`${comp.key}-page-${page}`}
                        className={`text-sm font-medium ${
                          isDisabled ? 'text-gray-400' : 'text-gray-700'
                        }`}
                      >
                        {comp.label}
                        {isDisabled && assignedPage && (
                          <span className="text-xs text-gray-500 ml-1">
                            (Page {assignedPage})
                          </span>
                        )}
                      </label>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                {selected[page as keyof typeof selected].length} field(s) assigned
              </div>
            </div>
          ))}
        </div>
        
        {error && (
          <div className="text-red-600 mt-6 p-4 border-2 border-red-400 rounded-lg bg-red-50 flex items-center shadow-sm animate-pulse">
            <svg className="w-6 h-6 mr-3 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <span className="font-semibold text-red-800 text-lg">{error}</span>
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-center">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </form>
    </div>
  );
} 