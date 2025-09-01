import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { Plus, Calendar } from 'lucide-react';
import { Ranking } from '@/types/ranking';
import { useToast } from '@/hooks/use-toast';

interface RankingListProps {
  rankings: Ranking[];
  onSelectRanking: (ranking: Ranking) => void;
  onCreateNew: () => void;
  onDeleteRanking: (rankingId: string) => void;
}

export const RankingList: React.FC<RankingListProps> = ({ rankings, onSelectRanking, onCreateNew, onDeleteRanking }) => {
  const sortedRankings = [...rankings].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  const { toast } = useToast();

  // Random ranking challenges for inspiration
  const surpriseChallenges = [
    "Best Pizza Toppings", "Most Overrated Movies", "Dream Vacation Destinations", 
    "Best Childhood Snacks", "Most Useful Superpowers", "Best Study Spots",
    "Most Annoying Sound Effects", "Best Ice Cream Flavors", "Most Comfortable Shoes",
    "Best Rainy Day Activities", "Most Inspiring Quotes", "Best Coffee Shop Vibes",
    "Most Relaxing Colors", "Best Weekend Plans", "Most Creative Hobbies",
    "Best Netflix Series", "Most Addictive Games", "Best Workout Songs",
    "Most Useful Apps", "Best Comfort Foods", "Most Beautiful Sunsets"
  ];

  const handleSurpriseMe = () => {
    const randomChallenge = surpriseChallenges[Math.floor(Math.random() * surpriseChallenges.length)];
    toast({
      title: "🎲 Random Ranking Challenge!",
      description: `How about ranking: "${randomChallenge}"? Click Create to get started!`,
      duration: 5000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-primary-foreground relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary-foreground animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-primary-foreground animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 rounded-full bg-primary-foreground animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-40 right-1/3 w-24 h-24 rounded-full bg-primary-foreground animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 text-center relative z-10">
          <div className="space-y-8 animate-fade-in">
            {/* Logo with emoji and tagline */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2 flex-wrap">
                <span className="text-4xl sm:text-5xl md:text-6xl animate-float">🏆</span>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-center">
                  RankIt
                </h1>
                <span className="text-4xl sm:text-5xl md:text-6xl animate-float" style={{ animationDelay: '1.5s' }}>⭐</span>
              </div>
              <p className="text-xl text-primary-foreground/90 font-medium">
                Turn your opinions into organized rankings
              </p>
              <p className="text-lg text-primary-foreground/70">
                Compare anything • Rate everything • Discover your preferences
              </p>
            </div>
            
            {/* Interactive Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 hover-scale cursor-pointer group">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                <div className="text-3xl font-bold">
                  {rankings.length}
                </div>
                <div className="text-sm opacity-90">
                  {rankings.length === 1 ? 'Ranking' : 'Rankings'} Created
                </div>
              </div>
              
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 hover-scale cursor-pointer group">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🎯</div>
                <div className="text-3xl font-bold">
                  {rankings.reduce((total, ranking) => total + ranking.items.length, 0)}
                </div>
                <div className="text-sm opacity-90">
                  Items Ranked
                </div>
              </div>
              
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 hover-scale cursor-pointer group">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">⚡</div>
                <div className="text-3xl font-bold">
                  {rankings.reduce((total, ranking) => 
                    total + ranking.items.reduce((itemTotal, item) => 
                      itemTotal + Object.keys(item.ratings).length, 0
                    ), 0
                  )}
                </div>
                <div className="text-sm opacity-90">
                  Total Ratings
                </div>
              </div>
            </div>

            {/* Call to Action */}
            {rankings.length === 0 ? (
              <div className="space-y-4">
                <p className="text-lg text-primary-foreground/80 font-medium">
                  Ready to organize your world? 🌟
                </p>
                <Button variant="floating" size="xl" onClick={onCreateNew} className="shadow-elegant animate-glow">
                  <Plus className="h-5 w-5 mr-2" />
                  Start Your First Ranking
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-lg text-primary-foreground/80 font-medium">
                  Keep the momentum going! 🚀
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="floating" size="lg" onClick={onCreateNew} className="shadow-elegant">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Another Ranking
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleSurpriseMe} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">
                    🎲 Surprise Me
                  </Button>
                </div>
              </div>
            )}
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
                                <div className="ml-auto">
                                  <StarRating 
                                    value={item.totalScore} 
                                    onChange={() => {}} 
                                    readonly 
                                    size="sm" 
                                    showValue={false}
                                  />
                                </div>
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