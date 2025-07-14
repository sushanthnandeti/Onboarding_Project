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

  const handleCheckbox = (page: 1 | 2 | 3, key: string) => {
    setSelected(prev => {
      const pageArr = prev[page].includes(key)
        ? prev[page].filter(k => k !== key)
        : [...prev[page], key];
      return { ...prev, [page]: pageArr };
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
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-8">
          {[1, 2, 3].map(page => (
            <div key={page}>
              <h2 className="text-lg font-semibold mb-2">Page {page}</h2>
              {ALL_COMPONENTS.map(comp => (
                <div key={comp.key} className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    checked={selected[page as 1 | 2 | 3].includes(comp.key)}
                    value={comp.key}
                    name={`page${page}`}
                    onCheckedChange={() => handleCheckbox(page as 1 | 2 | 3, comp.key)}
                  />
                  <label>{comp.label}</label>
                </div>
              ))}
            </div>
          ))}
        </div>
        {error && <div className="text-red-500 mt-4">{error}</div>}
        <Button type="submit" className="mt-6" disabled={loading}>
          {loading ? "Saving..." : "Save Configuration"}
        </Button>
      </form>
    </div>
  );
} 