import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  readonly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  value, 
  onChange, 
  maxStars = 5, 
  size = 'md',
  showValue = true,
  readonly = false
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleClick = (starIndex: number, isHalf: boolean) => {
    if (readonly) return;
    const newValue = starIndex + (isHalf ? 0.5 : 1);
    onChange(newValue);
  };

  const handleMouseEnter = (starIndex: number, isHalf: boolean) => {
    if (readonly) return;
    const newValue = starIndex + (isHalf ? 0.5 : 1);
    setHoverValue(newValue);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverValue(null);
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  const getStarFill = (starIndex: number) => {
    const starValue = starIndex + 1;
    if (displayValue >= starValue) return 'full';
    if (displayValue >= starValue - 0.5) return 'half';
    return 'empty';
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxStars }, (_, index) => {
          const fill = getStarFill(index);
          return (
            <div 
              key={index} 
              className="relative cursor-pointer"
              onMouseLeave={handleMouseLeave}
            >
              {/* Left half */}
              <div
                className="absolute left-0 top-0 w-1/2 h-full z-10"
                onMouseEnter={() => handleMouseEnter(index, true)}
                onClick={() => handleClick(index, true)}
              />
              {/* Right half */}
              <div
                className="absolute right-0 top-0 w-1/2 h-full z-10"
                onMouseEnter={() => handleMouseEnter(index, false)}
                onClick={() => handleClick(index, false)}
              />
              
              <Star 
                className={`
                  ${sizeClasses[size]} 
                  ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} 
                  transition-all duration-200
                  ${fill === 'full' 
                    ? 'text-primary fill-current' 
                    : fill === 'half' 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                  }
                `}
                style={{
                  background: fill === 'half' 
                    ? `linear-gradient(90deg, hsl(var(--primary)) 50%, transparent 50%)` 
                    : undefined,
                  WebkitBackgroundClip: fill === 'half' ? 'text' : undefined,
                  WebkitTextFillColor: fill === 'half' ? 'transparent' : undefined
                }}
              />
              
              {/* Half star overlay for better visual */}
              {fill === 'half' && (
                <div className="absolute inset-0 overflow-hidden">
                  <div className="w-1/2 h-full overflow-hidden">
                    <Star className={`${sizeClasses[size]} text-primary fill-current`} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {showValue && (
        <span className="ml-2 text-sm font-medium min-w-[3rem]">
          {displayValue.toFixed(1)}/5
        </span>
      )}
    </div>
  );
};