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

  // Get all assigned fields across all pages
  const getAllAssignedFields = () => {
    return [...selected[1], ...selected[2], ...selected[3]];
  };

  // Check if a field is assigned to a specific page
  const isFieldAssignedToPage = (fieldKey: string, page: number) => {
    return selected[page as keyof typeof selected].includes(fieldKey);
  };

  // Check if a field is assigned to any page
  const isFieldAssigned = (fieldKey: string) => {
    return getAllAssignedFields().includes(fieldKey);
  };

  // Get which page a field is assigned to
  const getFieldAssignedPage = (fieldKey: string): number | null => {
    if (selected[1].includes(fieldKey)) return 1;
    if (selected[2].includes(fieldKey)) return 2;
    if (selected[3].includes(fieldKey)) return 3;
    return null;
  };

  // Check if a field should be disabled on a specific page
  const isFieldDisabled = (fieldKey: string, currentPage: number) => {
    const assignedPage = getFieldAssignedPage(fieldKey);
    return assignedPage !== null && assignedPage !== currentPage;
  };

  const handleCheckbox = (page: 1 | 2 | 3, fieldKey: string, checked: boolean) => {
    setSelected(prev => {
      const newSelected = { ...prev };
      
      if (checked) {
        // Remove field from all other pages first
        newSelected[1] = newSelected[1].filter(f => f !== fieldKey);
        newSelected[2] = newSelected[2].filter(f => f !== fieldKey);
        newSelected[3] = newSelected[3].filter(f => f !== fieldKey);
        
        // Add field to current page
        newSelected[page] = [...newSelected[page], fieldKey];
      } else {
        // Remove field from current page
        newSelected[page] = newSelected[page].filter(f => f !== fieldKey);
      }
      
      return newSelected;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (selected[1].length === 0 || selected[2].length === 0 || selected[3].length === 0) {
      setError("Each page must have at least one component.");
      return;
    }
    setError(null);
    setLoading(true);
    await onSubmit(selected);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Admin: Configure Onboarding Pages</h1>
      <p className="text-gray-600">Assign fields to pages. Each field can only be assigned to one page at a time.</p>
      
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
          <div className="text-red-500 mt-4 p-3 border border-red-200 rounded">
            {error}
          </div>
        )}
        
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Total assigned: {getAllAssignedFields().length} / {ALL_COMPONENTS.length} fields
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </form>
    </div>
  );
} 