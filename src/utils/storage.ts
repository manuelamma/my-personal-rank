import { Ranking } from '@/types/ranking';

const STORAGE_KEY = 'rankit_rankings';

export const saveRankings = (rankings: Ranking[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rankings));
};

export const loadRankings = (): Ranking[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const parsed = JSON.parse(stored);
    return parsed.map((ranking: any) => ({
      ...ranking,
      createdAt: new Date(ranking.createdAt),
      updatedAt: new Date(ranking.updatedAt),
      items: ranking.items.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt)
      }))
    }));
  } catch (error) {
    console.error('Error loading rankings:', error);
    return [];
  }
};

export const saveRanking = (ranking: Ranking): void => {
  const rankings = loadRankings();
  const existingIndex = rankings.findIndex(r => r.id === ranking.id);
  
  if (existingIndex >= 0) {
    rankings[existingIndex] = ranking;
  } else {
    rankings.push(ranking);
  }
  
  saveRankings(rankings);
};

export const deleteRanking = (rankingId: string): void => {
  const rankings = loadRankings();
  const filtered = rankings.filter(r => r.id !== rankingId);
  saveRankings(filtered);
};