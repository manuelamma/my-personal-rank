import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { Upload, X, Loader2, Camera } from 'lucide-react';
import { Criteria, RankingItem } from '@/types/ranking';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';
import { calculateScore } from '@/utils/scoring';
import { useToast } from '@/hooks/use-toast';

interface AddItemProps {
  criteria: Criteria[];
  onAdd: (item: RankingItem) => void;
  onCancel: () => void;
}

export const AddItem: React.FC<AddItemProps> = ({ criteria, onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState<string>('');
  const [originalImage, setOriginalImage] = useState<string>('');
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      setIsProcessing(true);
      
      // Store original image
      const originalUrl = URL.createObjectURL(file);
      setOriginalImage(originalUrl);
      
      toast({
        title: "Processing image...",
        description: "Removing background, this may take a moment."
      });

      // Load and process image
      const imageElement = await loadImage(file);
      const processedBlob = await removeBackground(imageElement);
      const processedUrl = URL.createObjectURL(processedBlob);
      
      setImage(processedUrl);
      
      toast({
        title: "Image processed!",
        description: "Background removed successfully."
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Processing failed",
        description: "Using original image instead.",
        variant: "destructive"
      });
      
      // Fall back to original image
      const fallbackUrl = URL.createObjectURL(file);
      setImage(fallbackUrl);
      setOriginalImage(fallbackUrl);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    const item: RankingItem = {
      id: `item-${Date.now()}`,
      name: name.trim(),
      image,
      originalImage,
      ratings,
      totalScore: calculateScore({ 
        id: '', 
        name: '', 
        ratings, 
        totalScore: 0, 
        createdAt: new Date() 
      }, criteria),
      createdAt: new Date()
    };

    onAdd(item);
  };

  const updateRating = (criteriaId: string, value: number) => {
    setRatings(prev => ({ ...prev, [criteriaId]: value }));
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gradient-card border shadow-elegant animate-slide-up max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Add New Item
          </CardTitle>
          <CardDescription>
            Upload a photo and rate this item
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-4">
              <Label>Photo</Label>
              <div className="flex flex-col items-center gap-4">
                {(image || originalImage) ? (
                  <div className="relative">
                    <img
                      src={image || originalImage}
                      alt="Item preview"
                      className="w-32 h-32 object-cover rounded-lg shadow-card"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => {
                        setImage('');
                        setOriginalImage('');
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    ) : (
                      <>
                        <Camera className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Add Photo</span>
                      </>
                    )}
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="hidden"
                />
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Upload Photo'}
                </Button>
              </div>
            </div>

            {/* Item Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                placeholder="Enter item name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-base"
                autoFocus={!image}
              />
            </div>

            {/* Ratings */}
            <div className="space-y-4">
              <Label>Rate this item</Label>
              {criteria.map((criterion) => (
                <div key={criterion.id} className="space-y-3 p-4 bg-accent/20 rounded-lg">
                  <div className="flex justify-center items-center">
                    <span className="font-medium">{criterion.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {(ratings[criterion.id] || 0) % 1 === 0 
                        ? `${Math.floor(ratings[criterion.id] || 0)}/5`
                        : `${(ratings[criterion.id] || 0).toFixed(1)}/5`
                      }
                    </span>
                  </div>
                  <StarRating
                    value={ratings[criterion.id] || 0}
                    onChange={(value) => updateRating(criterion.id, value)}
                    size="lg"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="gradient" 
                className="flex-1"
                disabled={!name.trim() || isProcessing}
              >
                Add Item
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};