export interface Criteria {
  id: string;
  name: string;
  weight: number; // 1-5, how important this criteria is
}

export interface RankingItem {
  id: string;
  name: string;
  image?: string; // base64 or blob URL
  originalImage?: string; // before background removal
  ratings: Record<string, number>; // criteriaId -> rating (1-10)
  totalScore: number; // calculated weighted average
  createdAt: Date;
}

export interface Ranking {
  id: string;
  category: string;
  description?: string;
  criteria: Criteria[];
  items: RankingItem[];
  createdAt: Date;
  updatedAt: Date;
}

export type ViewMode = 'list' | 'tier';

export interface TierLevel {
  id: string;
  name: string;
  color: string;
  minScore: number;
  maxScore: number;
}