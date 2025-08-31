import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Trash2, Edit3, Save, X } from 'lucide-react';
import { Ranking } from '@/types/ranking';
import { CriteriaEditor } from './CriteriaEditor';
import { BulkItemActions } from './BulkItemActions';
import { useToast } from '@/hooks/use-toast';

interface RankingSettingsProps {
  ranking: Ranking;
  open: boolean;
  onClose: () => void;
  onUpdate: (ranking: Ranking) => void;
  onDelete: () => void;
}

export const RankingSettings: React.FC<RankingSettingsProps> = ({
  ranking,
  open,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [editedRanking, setEditedRanking] = useState<Ranking>(ranking);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    onUpdate(editedRanking);
    setIsEditing(false);
    toast({
      title: "Settings updated",
      description: "Your ranking settings have been saved successfully.",
    });
  };

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
    onClose();
    toast({
      title: "Ranking deleted",
      description: "Your ranking has been permanently deleted.",
      variant: "destructive",
    });
  };

  const handleCriteriaUpdate = (updatedCriteria: typeof ranking.criteria) => {
    setEditedRanking(prev => ({
      ...prev,
      criteria: updatedCriteria
    }));
  };

  const handleItemsUpdate = (updatedItems: typeof ranking.items) => {
    setEditedRanking(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              Ranking Settings
            </DialogTitle>
            <DialogDescription className="text-sm">
              Manage your ranking: edit details, modify criteria, bulk manage items, or delete entirely.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="general" className="text-xs md:text-sm">General</TabsTrigger>
              <TabsTrigger value="criteria" className="text-xs md:text-sm">Criteria</TabsTrigger>
              <TabsTrigger value="items" className="text-xs md:text-sm">Items</TabsTrigger>
              <TabsTrigger value="danger" className="text-xs md:text-sm">Danger</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        setEditedRanking(ranking);
                        setIsEditing(false);
                      }}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={editedRanking.category}
                      onChange={(e) => setEditedRanking(prev => ({ ...prev, category: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editedRanking.description || ''}
                      onChange={(e) => setEditedRanking(prev => ({ ...prev, description: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="bg-accent/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-semibold">{ranking.items.length}</div>
                      <div className="text-muted-foreground">Items</div>
                    </div>
                    <div>
                      <div className="font-semibold">{ranking.criteria.length}</div>
                      <div className="text-muted-foreground">Criteria</div>
                    </div>
                    <div>
                      <div className="font-semibold">
                        {ranking.items.reduce((total, item) => 
                          total + Object.keys(item.ratings).length, 0
                        )}
                      </div>
                      <div className="text-muted-foreground">Total Ratings</div>
                    </div>
                    <div>
                      <div className="font-semibold">
                        {new Date(ranking.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground">Created</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="criteria">
              <CriteriaEditor
                criteria={editedRanking.criteria}
                onUpdate={handleCriteriaUpdate}
              />
            </TabsContent>

            <TabsContent value="items">
              <BulkItemActions
                items={editedRanking.items}
                criteria={editedRanking.criteria}
                onUpdate={handleItemsUpdate}
              />
            </TabsContent>

            <TabsContent value="danger" className="space-y-4">
              <div className="border border-destructive/20 rounded-lg p-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">
                    These actions cannot be undone. Please proceed with caution.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    className="w-full justify-start"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Entire Ranking
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the ranking
              "{ranking.category}" and all its items and ratings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Ranking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};