import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash2, CheckSquare, Square, Filter, SortAsc, SortDesc } from 'lucide-react';
import { RankingItem, Criteria } from '@/types/ranking';
import { getTierLevel } from '@/utils/scoring';
import { useToast } from '@/hooks/use-toast';

interface BulkItemActionsProps {
  items: RankingItem[];
  criteria: Criteria[];
  onUpdate: (items: RankingItem[]) => void;
}

type SortOption = 'name-asc' | 'name-desc' | 'score-asc' | 'score-desc' | 'date-asc' | 'date-desc';

export const BulkItemActions: React.FC<BulkItemActionsProps> = ({ items, criteria, onUpdate }) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('score-desc');
  const { toast } = useToast();

  const toggleItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const toggleAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  const handleBulkDelete = () => {
    const remainingItems = items.filter(item => !selectedItems.has(item.id));
    onUpdate(remainingItems);
    setSelectedItems(new Set());
    setShowDeleteDialog(false);
    toast({
      title: "Items deleted",
      description: `${selectedItems.size} items have been permanently deleted.`,
      variant: "destructive",
    });
  };

  const getSortedItems = () => {
    const sorted = [...items];
    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'score-asc':
        return sorted.sort((a, b) => a.totalScore - b.totalScore);
      case 'score-desc':
        return sorted.sort((a, b) => b.totalScore - a.totalScore);
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return sorted;
    }
  };

  const sortedItems = getSortedItems();

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-medium">Bulk Item Management</h3>
            <p className="text-sm text-muted-foreground">
              Select multiple items to delete them in bulk
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 border border-input rounded-md text-sm bg-background min-w-0 flex-1 sm:flex-initial sm:min-w-[200px]"
            >
              <option value="score-desc">Score (High to Low)</option>
              <option value="score-asc">Score (Low to High)</option>
              <option value="name-asc">Name (A to Z)</option>
              <option value="name-desc">Name (Z to A)</option>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
            </select>
          </div>
        </div>

        {items.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 bg-accent/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAll}
                className="flex items-center gap-2"
              >
                {selectedItems.size === items.length ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {selectedItems.size === items.length ? 'Deselect All' : 'Select All'}
                </span>
                <span className="sm:hidden">
                  {selectedItems.size === items.length ? 'Deselect' : 'Select'} All
                </span>
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedItems.size} of {items.length} selected
              </span>
            </div>
            
            {selectedItems.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Delete Selected ({selectedItems.size})</span>
                <span className="sm:hidden">Delete ({selectedItems.size})</span>
              </Button>
            )}
          </div>
        )}

        <div className="space-y-3">
          {sortedItems.map((item, index) => {
            const tier = getTierLevel(item.totalScore);
            const isSelected = selectedItems.has(item.id);
            
            return (
              <Card 
                key={item.id} 
                className={`cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => toggleItem(item.id)}
              >
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-start gap-3 md:gap-4">
                    <Checkbox 
                      checked={isSelected}
                      onChange={() => toggleItem(item.id)}
                      className="pointer-events-none mt-1 flex-shrink-0"
                    />
                    
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="font-medium text-sm md:text-base truncate">{item.name}</h4>
                            <Badge className={`${tier.cssClass} flex-shrink-0`}>{tier.name}</Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <StarRating 
                              value={item.totalScore} 
                              onChange={() => {}} 
                              readonly 
                              size="sm" 
                              showValue 
                            />
                            <span className="text-xs text-muted-foreground">
                              {Object.keys(item.ratings).length} of {criteria.length} criteria rated
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right text-xs md:text-sm text-muted-foreground flex-shrink-0">
                          <div>#{index + 1}</div>
                          <div className="whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {items.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-muted-foreground">No items to manage</p>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedItems.size} items?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected items
              and all their ratings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Items
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};