import React, { useState, useEffect } from 'react';
import { Ranking, RankingItem, Criteria } from '@/types/ranking';
import { saveRanking, loadRankings } from '@/utils/storage';
import { calculateScore } from '@/utils/scoring';
import { RankingList } from '@/components/RankingList';
import { CreateRanking } from '@/components/CreateRanking';
import { RankingView } from '@/components/RankingView';

type AppState = 'list' | 'create' | 'view';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('list');
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [currentRanking, setCurrentRanking] = useState<Ranking | null>(null);

  useEffect(() => {
    const loadedRankings = loadRankings();
    setRankings(loadedRankings);
  }, []);

  const handleCreateRanking = (category: string, criteria: Criteria[]) => {
    const newRanking: Ranking = {
      id: `ranking-${Date.now()}`,
      category,
      criteria,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    saveRanking(newRanking);
    setRankings(prev => [...prev, newRanking]);
    setCurrentRanking(newRanking);
    setAppState('view');
  };

  const handleSelectRanking = (ranking: Ranking) => {
    setCurrentRanking(ranking);
    setAppState('view');
  };

  const handleUpdateRanking = (updatedRanking: Ranking) => {
    // Recalculate scores for all items
    const itemsWithUpdatedScores = updatedRanking.items.map(item => ({
      ...item,
      totalScore: calculateScore(item, updatedRanking.criteria)
    }));

    const finalRanking = {
      ...updatedRanking,
      items: itemsWithUpdatedScores
    };

    saveRanking(finalRanking);
    setRankings(prev => prev.map(r => r.id === finalRanking.id ? finalRanking : r));
    setCurrentRanking(finalRanking);
  };

  const handleDeleteRanking = (rankingId: string) => {
    setRankings(prev => prev.filter(r => r.id !== rankingId));
    // Reload rankings from storage to ensure consistency
    const updatedRankings = loadRankings().filter(r => r.id !== rankingId);
    setRankings(updatedRankings);
  };

  const handleBackToList = () => {
    setCurrentRanking(null);
    setAppState('list');
  };

  if (appState === 'create') {
    return (
      <CreateRanking
        onCreate={handleCreateRanking}
        onCancel={() => setAppState('list')}
      />
    );
  }

  if (appState === 'view' && currentRanking) {
    return (
      <RankingView
        ranking={currentRanking}
        onBack={handleBackToList}
        onUpdateRanking={handleUpdateRanking}
        onDeleteRanking={handleDeleteRanking}
      />
    );
  }

  return (
    <RankingList
      rankings={rankings}
      onSelectRanking={handleSelectRanking}
      onCreateNew={() => setAppState('create')}
      onDeleteRanking={handleDeleteRanking}
    />
  );
};

export default Index;
