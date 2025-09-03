import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Star, Sparkles, Check } from 'lucide-react';
import { Criteria } from '@/types/ranking';
import { useToast } from '@/components/ui/use-toast';

interface CreateRankingProps {
  onCreate: (category: string, criteria: Criteria[]) => void;
  onCancel: () => void;
}

const suggestedCriteria: Record<string, string[]> = {
  'smartphones': ['Performance', 'Camera Quality', 'Battery Life', 'Design', 'Value for Money'],
  'shampoos': ['Foam Quality', 'Scent', 'Natural Ingredients', 'Hair Softness', 'Price'],
  'restaurants': ['Food Quality', 'Service', 'Atmosphere', 'Value', 'Cleanliness'],
  'movies': ['Story', 'Acting', 'Cinematography', 'Entertainment', 'Rewatch Value'],
  'laptops': ['Performance', 'Build Quality', 'Display', 'Battery', 'Portability'],
  'headphones': ['Sound Quality', 'Comfort', 'Build Quality', 'Battery Life', 'Value'],
  'cars': ['Performance', 'Fuel Economy', 'Safety', 'Comfort', 'Reliability'],
  'books': ['Plot Quality', 'Character Development', 'Writing Style', 'Originality', 'Engagement'],
  'games': ['Gameplay', 'Graphics', 'Story', 'Replayability', 'Innovation'],
  'coffee': ['Taste', 'Aroma', 'Strength', 'Smoothness', 'Value'],
  'pizza': ['Taste', 'Crust Quality', 'Toppings', 'Cheese Quality', 'Value'],
  'hotels': ['Service Quality', 'Cleanliness', 'Location', 'Amenities', 'Value'],
  'wines': ['Taste', 'Aroma', 'Complexity', 'Balance', 'Value'],
  'makeup': ['Coverage', 'Longevity', 'Color Quality', 'Application', 'Skin Compatibility'],
  'maquilhagem': ['Cobertura', 'Durabilidade', 'Qualidade da Cor', 'Aplicação', 'Compatibilidade'],
  'streaming': ['Content Quality', 'User Interface', 'Video Quality', 'Pricing', 'Device Support'],
  'apps': ['User Experience', 'Functionality', 'Performance', 'Design', 'Value'],
  'podcasts': ['Content Quality', 'Audio Quality', 'Host Chemistry', 'Frequency', 'Originality'],
  'shoes': ['Comfort', 'Durability', 'Style', 'Quality', 'Value'],
  'travel': ['Destinations', 'Value', 'Experience', 'Service', 'Accessibility']
};

const generateLocalSuggestions = (category: string): string[] => {
  const lowercaseCategory = category.toLowerCase();
  
  // Check for exact matches first
  for (const [key, suggestions] of Object.entries(suggestedCriteria)) {
    if (lowercaseCategory.includes(key)) {
      return suggestions;
    }
  }
  
  // Generate contextual suggestions based on category type
  if (lowercaseCategory.includes('food') || lowercaseCategory.includes('restaurant') || lowercaseCategory.includes('culinary')) {
    return ['Taste', 'Quality', 'Presentation', 'Value', 'Service'];
  }
  if (lowercaseCategory.includes('tech') || lowercaseCategory.includes('device') || lowercaseCategory.includes('gadget')) {
    return ['Performance', 'Build Quality', 'User Experience', 'Battery Life', 'Value'];
  }
  if (lowercaseCategory.includes('beauty') || lowercaseCategory.includes('cosmetic') || lowercaseCategory.includes('skincare')) {
    return ['Effectiveness', 'Quality', 'Skin Compatibility', 'Packaging', 'Value'];
  }
  if (lowercaseCategory.includes('entertainment') || lowercaseCategory.includes('media')) {
    return ['Quality', 'Entertainment Value', 'Production', 'Originality', 'Engagement'];
  }
  if (lowercaseCategory.includes('service')) {
    return ['Service Quality', 'Response Time', 'Professionalism', 'Value', 'Reliability'];
  }
  
  // Default suggestions for any category
  return ['Quality', 'Value', 'Performance', 'Design', 'Overall Experience'];
};

export const CreateRanking: React.FC<CreateRankingProps> = ({ onCreate, onCancel }) => {
  const [category, setCategory] = useState('');
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [newCriterion, setNewCriterion] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    
    // Auto-suggest criteria based on category
    const lowercaseCategory = value.toLowerCase();
    for (const [key, suggestions] of Object.entries(suggestedCriteria)) {
      if (lowercaseCategory.includes(key)) {
        const suggestedCriteria = suggestions.map((name, index) => ({
          id: `criteria-${Date.now()}-${index}`,
          name,
          weight: 3 // Default weight
        }));
        setCriteria(suggestedCriteria);
        break;
      }
    }
  };

  const generateAiSuggestions = () => {
    if (!category.trim()) {
      toast({
        title: "Enter a category first",
        description: "Please enter a category to get smart suggestions",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate a brief loading for better UX
    setTimeout(() => {
      const suggestions = generateLocalSuggestions(category.trim());
      // Filter out suggestions that are already added as criteria
      const existingCriteriaNames = criteria.map(c => c.name.toLowerCase());
      const filteredSuggestions = suggestions.filter(
        suggestion => !existingCriteriaNames.includes(suggestion.toLowerCase())
      );
      
      setAiSuggestions(filteredSuggestions);
      setIsGenerating(false);
      
      if (filteredSuggestions.length > 0) {
        toast({
          title: "Smart suggestions generated!",
          description: "Review the suggestions and add the ones you like"
        });
      } else {
        toast({
          title: "No new suggestions",
          description: "You've already added similar criteria, try adding custom ones",
        });
      }
    }, 800);
  };

  const addAiSuggestion = (suggestion: string) => {
    const criterion: Criteria = {
      id: `criteria-${Date.now()}`,
      name: suggestion,
      weight: 3
    };
    setCriteria([...criteria, criterion]);
    setAiSuggestions(aiSuggestions.filter(s => s !== suggestion));
  };

  const addCriterion = () => {
    if (newCriterion.trim()) {
      const criterion: Criteria = {
        id: `criteria-${Date.now()}`,
        name: newCriterion.trim(),
        weight: 3
      };
      setCriteria([...criteria, criterion]);
      setNewCriterion('');
    }
  };

  const removeCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const updateWeight = (id: string, weight: number) => {
    setCriteria(criteria.map(c => c.id === id ? { ...c, weight } : c));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category.trim() && criteria.length > 0) {
      onCreate(category.trim(), criteria);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gradient-card border shadow-elegant animate-slide-up">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Create New Ranking
          </CardTitle>
          <CardDescription>
            Define your category and evaluation criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., Smartphones, Shampoos, Restaurants..."
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="text-base"
                autoFocus
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Evaluation Criteria</Label>
                <Button 
                  type="button" 
                  onClick={generateAiSuggestions} 
                  variant="outline" 
                  size="sm"
                  disabled={isGenerating || !category.trim()}
                  className="text-xs"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {isGenerating ? 'Generating...' : 'Smart Suggestions'}
                </Button>
              </div>

              {aiSuggestions.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Smart Suggestions (click to add):</Label>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <Badge 
                        key={index}
                        variant="secondary" 
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => addAiSuggestion(suggestion)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add a custom criterion..."
                  value={newCriterion}
                  onChange={(e) => setNewCriterion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCriterion())}
                />
                <Button type="button" onClick={addCriterion} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {criteria.map((criterion) => (
                  <div key={criterion.id} className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium">{criterion.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((weight) => (
                        <button
                          key={weight}
                          type="button"
                          onClick={() => updateWeight(criterion.id, weight)}
                          className={`p-1 rounded transition-colors ${
                            weight <= criterion.weight 
                              ? 'text-primary hover:text-primary-glow' 
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <Star className={`h-4 w-4 ${weight <= criterion.weight ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCriterion(criterion.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {criteria.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  Add some criteria to evaluate your items
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="gradient" 
                className="flex-1"
                disabled={!category.trim() || criteria.length === 0}
              >
                Create Ranking
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};