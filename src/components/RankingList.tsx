import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Star, Calendar } from 'lucide-react';
import { Ranking } from '@/types/ranking';

interface RankingListProps {
  rankings: Ranking[];
  onSelectRanking: (ranking: Ranking) => void;
  onCreateNew: () => void;
}

export const RankingList: React.FC<RankingListProps> = ({ rankings, onSelectRanking, onCreateNew }) => {
  const sortedRankings = [...rankings].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl font-bold tracking-tight">
              RankIt
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Create personal rankings for anything. Rate what matters to you with custom criteria.
            </p>
            <Button variant="floating" size="xl" onClick={onCreateNew} className="shadow-elegant animate-glow">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Ranking
            </Button>
          </div>
        </div>
      </div>

      {/* Rankings List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {rankings.length === 0 ? (
          <Card className="text-center py-16 bg-gradient-card border shadow-card">
            <CardContent>
              <div className="space-y-6">
                <div className="text-8xl animate-fade-in">🏆</div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Ready to start ranking?</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Create your first personal ranking to organize and rate your favorite products, experiences, or anything else.
                  </p>
                </div>
                <Button variant="gradient" size="lg" onClick={onCreateNew}>
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Ranking
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Your Rankings</h2>
                <p className="text-muted-foreground">
                  {rankings.length} {rankings.length === 1 ? 'ranking' : 'rankings'} created
                </p>
              </div>
              <Button variant="gradient" onClick={onCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                New Ranking
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedRankings.map((ranking, index) => (
                <Card 
                  key={ranking.id} 
                  className="cursor-pointer hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-gradient-card border shadow-card animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => onSelectRanking(ranking)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span className="line-clamp-2">{ranking.category}</span>
                      <Badge variant="secondary" className="ml-2 shrink-0">
                        {ranking.items.length}
                      </Badge>
                    </CardTitle>
                    {ranking.description && (
                      <CardDescription className="line-clamp-2">
                        {ranking.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Criteria Preview */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Criteria:</p>
                      <div className="flex flex-wrap gap-1">
                        {ranking.criteria.slice(0, 3).map((criterion) => (
                          <Badge key={criterion.id} variant="outline" className="text-xs">
                            {criterion.name}
                          </Badge>
                        ))}
                        {ranking.criteria.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{ranking.criteria.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Top Items Preview */}
                    {ranking.items.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Top items:</p>
                        <div className="space-y-1">
                          {ranking.items
                            .sort((a, b) => b.totalScore - a.totalScore)
                            .slice(0, 2)
                            .map((item, itemIndex) => (
                              <div key={item.id} className="flex items-center gap-2 text-sm">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-xs font-medium">
                                  {itemIndex + 1}
                                </span>
                                <span className="truncate">{item.name}</span>
                                <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                                  <Star className="h-3 w-3 fill-current text-primary" />
                                  {item.totalScore.toFixed(1)}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {ranking.updatedAt.toLocaleDateString()}
                      </span>
                      <span>{ranking.items.length} items</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};