import { RankingItem, Criteria } from '@/types/ranking';

export const calculateScore = (item: RankingItem, criteria: Criteria[]): number => {
  if (criteria.length === 0) return 0;
  
  let weightedSum = 0;
  let totalWeight = 0;
  
  criteria.forEach(criterion => {
    const rating = item.ratings[criterion.id] || 0;
    weightedSum += rating * criterion.weight;
    totalWeight += criterion.weight;
  });
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
};

export const sortItemsByScore = (items: RankingItem[]): RankingItem[] => {
  return [...items].sort((a, b) => b.totalScore - a.totalScore);
};

export const getTierLevel = (score: number): { name: string; color: string; cssClass: string } => {
  if (score >= 8.5) return { name: 'S', color: 'tier-s', cssClass: 'bg-tier-s text-white' };
  if (score >= 7.0) return { name: 'A', color: 'tier-a', cssClass: 'bg-tier-a text-white' };
  if (score >= 5.5) return { name: 'B', color: 'tier-b', cssClass: 'bg-tier-b text-white' };
  if (score >= 4.0) return { name: 'C', color: 'tier-c', cssClass: 'bg-tier-c text-white' };
  return { name: 'D', color: 'tier-d', cssClass: 'bg-tier-d text-white' };
};