import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, Plus, List, Grid3X3, Trophy, Medal, Award, Settings, FileText } from 'lucide-react';
import { Ranking, RankingItem, ViewMode } from '@/types/ranking';
import { sortItemsByScore, getTierLevel } from '@/utils/scoring';
import { deleteRanking } from '@/utils/storage';
import { AddItem } from './AddItem';
import { RankingSettings } from './RankingSettings';

interface RankingViewProps {
  ranking: Ranking;
  onBack: () => void;
  onUpdateRanking: (ranking: Ranking) => void;
  onDeleteRanking?: (rankingId: string) => void;
}

const getTrophyIcon = (position: number) => {
  switch (position) {
    case 1: return <Trophy className="h-5 w-5 text-tier-s" />;
    case 2: return <Medal className="h-5 w-5 text-tier-a" />;
    case 3: return <Award className="h-5 w-5 text-tier-b" />;
    default: return <span className="text-lg font-bold text-muted-foreground">#{position}</span>;
  }
};

export const RankingView: React.FC<RankingViewProps> = ({ ranking, onBack, onUpdateRanking, onDeleteRanking }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showAddItem, setShowAddItem] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const sortedItems = sortItemsByScore(ranking.items);

  const handleAddItem = (item: RankingItem) => {
    const updatedRanking = {
      ...ranking,
      items: [...ranking.items, item],
      updatedAt: new Date()
    };
    onUpdateRanking(updatedRanking);
    setShowAddItem(false);
  };

  const handleDeleteRanking = () => {
    // Delete from storage
    deleteRanking(ranking.id);
    // Update parent component state if callback provided
    if (onDeleteRanking) {
      onDeleteRanking(ranking.id);
    }
    // Navigate back
    onBack();
  };

  const groupItemsByTier = () => {
    const tiers = {
      S: sortedItems.filter(item => item.totalScore >= 4.5),
      A: sortedItems.filter(item => item.totalScore >= 4.0 && item.totalScore < 4.5),
      B: sortedItems.filter(item => item.totalScore >= 3.5 && item.totalScore < 4.0),
      C: sortedItems.filter(item => item.totalScore >= 2.75 && item.totalScore < 3.5),
      D: sortedItems.filter(item => item.totalScore >= 2.0 && item.totalScore < 2.75),
      F: sortedItems.filter(item => item.totalScore < 2.0)
    };
    return Object.entries(tiers).filter(([_, items]) => items.length > 0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-card border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-lg md:text-2xl font-bold">{ranking.category}</h1>
                <p className="text-sm text-muted-foreground">{ranking.items.length} items ranked</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'tier' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('tier')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button 
                variant="gradient" 
                size="sm"
                onClick={() => setShowAddItem(true)}
                className="flex-shrink-0"
              >
                <Plus className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Add Item</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {ranking.items.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <div className="text-6xl">📋</div>
                <h3 className="text-xl font-semibold">No items yet</h3>
                <p className="text-muted-foreground">Start building your ranking by adding your first item</p>
                <Button variant="gradient" onClick={() => setShowAddItem(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === 'list' ? (
              <div className="space-y-4">
                {sortedItems.map((item, index) => {
                  const tier = getTierLevel(item.totalScore);
                  return (
                <Card key={item.id} className="overflow-hidden transition-all duration-200 animate-fade-in">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent flex-shrink-0">
                        {getTrophyIcon(index + 1)}
                      </div>
                      
                      {item.image && (
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden shadow-card flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-base md:text-lg truncate">{item.name}</h3>
                          <Badge className={`${tier.cssClass} flex-shrink-0`}>{tier.name}</Badge>
                          {item.notes && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FileText className="h-4 w-4 text-muted-foreground cursor-help flex-shrink-0" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="text-sm">{item.notes}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground flex-wrap">
                          <StarRating 
                            value={item.totalScore} 
                            onChange={() => {}} 
                            readonly 
                            size="sm" 
                            showValue 
                          />
                          <span className="truncate">Added {item.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                {groupItemsByTier().map(([tierName, items]) => {
                  const tier = getTierLevel(items[0].totalScore);
                  return (
                    <Card key={tierName} className="overflow-hidden">
                      <CardHeader className={`${tier.cssClass} py-3`}>
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-2xl font-bold">{tierName}</span>
                          <Badge variant="secondary" className="bg-white/20 text-current">
                            {items.length} {items.length === 1 ? 'item' : 'items'}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                          {items.map((item) => (
                            <div key={item.id} className="text-center space-y-2 p-2 md:p-3 rounded-lg bg-accent/20 transition-colors">
                              {item.image && (
                                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-lg overflow-hidden shadow-card">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-1 justify-center mb-1">
                                  <h4 className="font-medium text-sm md:text-base truncate" title={item.name}>{item.name}</h4>
                                  {item.notes && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <FileText className="h-3 w-3 text-muted-foreground cursor-help flex-shrink-0" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                          <p className="text-sm">{item.notes}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                                <StarRating 
                                  value={item.totalScore} 
                                  onChange={() => {}} 
                                  readonly 
                                  size="sm" 
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddItem && (
        <AddItem
          criteria={ranking.criteria}
          onAdd={handleAddItem}
          onCancel={() => setShowAddItem(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <RankingSettings
          ranking={ranking}
          open={showSettings}
          onClose={() => setShowSettings(false)}
          onUpdate={onUpdateRanking}
          onDelete={handleDeleteRanking}
        />
      )}
    </div>
  );
};