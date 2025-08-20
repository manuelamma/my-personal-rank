import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit3, Save, X, Trash2, Plus } from 'lucide-react';
import { Criteria } from '@/types/ranking';
import { useToast } from '@/hooks/use-toast';

interface CriteriaEditorProps {
  criteria: Criteria[];
  onUpdate: (criteria: Criteria[]) => void;
}

interface EditingCriteria extends Criteria {
  isEditing?: boolean;
  originalName?: string;
  originalWeight?: number;
}

export const CriteriaEditor: React.FC<CriteriaEditorProps> = ({ criteria, onUpdate }) => {
  const [editingCriteria, setEditingCriteria] = useState<EditingCriteria[]>(criteria);
  const { toast } = useToast();

  const startEdit = (criteriaId: string) => {
    setEditingCriteria(prev => prev.map(c => 
      c.id === criteriaId 
        ? { ...c, isEditing: true, originalName: c.name, originalWeight: c.weight }
        : c
    ));
  };

  const cancelEdit = (criteriaId: string) => {
    setEditingCriteria(prev => prev.map(c => 
      c.id === criteriaId 
        ? { 
            ...c, 
            isEditing: false, 
            name: c.originalName || c.name,
            weight: c.originalWeight || c.weight
          }
        : c
    ));
  };

  const saveEdit = (criteriaId: string) => {
    const updatedCriteria = editingCriteria.map(c => 
      c.id === criteriaId 
        ? { ...c, isEditing: false, originalName: undefined, originalWeight: undefined }
        : c
    );
    setEditingCriteria(updatedCriteria);
    onUpdate(updatedCriteria);
    toast({
      title: "Criteria updated",
      description: "The criteria has been successfully updated.",
    });
  };

  const deleteCriteria = (criteriaId: string) => {
    const updatedCriteria = editingCriteria.filter(c => c.id !== criteriaId);
    setEditingCriteria(updatedCriteria);
    onUpdate(updatedCriteria);
    toast({
      title: "Criteria deleted",
      description: "The criteria has been removed from the ranking.",
      variant: "destructive",
    });
  };

  const addCriteria = () => {
    const newCriteria: EditingCriteria = {
      id: `criteria-${Date.now()}`,
      name: 'New Criteria',
      weight: 1,
      isEditing: true
    };
    const updatedCriteria = [...editingCriteria, newCriteria];
    setEditingCriteria(updatedCriteria);
  };

  const updateCriteriaField = (criteriaId: string, field: 'name' | 'weight', value: string | number) => {
    setEditingCriteria(prev => prev.map(c => 
      c.id === criteriaId ? { ...c, [field]: value } : c
    ));
  };

  const getWeightColor = (weight: number) => {
    if (weight >= 4) return 'bg-red-500';
    if (weight >= 3) return 'bg-orange-500';
    if (weight >= 2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getWeightLabel = (weight: number) => {
    if (weight >= 4) return 'Critical';
    if (weight >= 3) return 'Important';
    if (weight >= 2) return 'Moderate';
    return 'Low';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Criteria Management</h3>
          <p className="text-sm text-muted-foreground">
            Edit criteria names and adjust their importance weights
          </p>
        </div>
        <Button onClick={addCriteria} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Criteria
        </Button>
      </div>

      <div className="space-y-3">
        {editingCriteria.map((criterion) => (
          <Card key={criterion.id} className="relative">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                {criterion.isEditing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={criterion.name}
                      onChange={(e) => updateCriteriaField(criterion.id, 'name', e.target.value)}
                      className="flex-1"
                      placeholder="Criteria name"
                    />
                    <div className="flex gap-1">
                      <Button size="sm" onClick={() => saveEdit(criterion.id)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => cancelEdit(criterion.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span>{criterion.name}</span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => startEdit(criterion.id)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteCriteria(criterion.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">Importance Weight</Label>
                  <div className="flex items-center gap-3 mt-1">
                    {criterion.isEditing ? (
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={criterion.weight}
                        onChange={(e) => updateCriteriaField(criterion.id, 'weight', parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((weight) => (
                            <div
                              key={weight}
                              className={`w-3 h-3 rounded-full ${
                                weight <= criterion.weight ? getWeightColor(criterion.weight) : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {getWeightLabel(criterion.weight)}
                        </Badge>
                      </div>
                    )}
                    <span className="text-sm text-muted-foreground">
                      Weight: {criterion.weight}/5
                    </span>
                  </div>
                </div>
                
                {criterion.isEditing && (
                  <div className="text-xs text-muted-foreground bg-accent/30 p-2 rounded">
                    <strong>Weight Guide:</strong> 1 = Low importance, 2 = Moderate, 3 = Important, 4 = Very Important, 5 = Critical
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingCriteria.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-muted-foreground mb-4">No criteria defined yet</p>
            <Button onClick={addCriteria}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Criteria
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};