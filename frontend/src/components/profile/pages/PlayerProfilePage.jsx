import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlayerProfile from '../PlayerProfile';
import { Header, Footer } from '@/layout/overallLayout';

const PlayerProfilePage = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    // Go back to the previous page
    navigate(-1);
  };

  return (
    <>
      <Header />
      <div style={{ minHeight: '80vh' }}>
        <PlayerProfile 
          userId={playerId} 
          onBack={handleBack}
        />
      </div>
      <Footer />
    </>
  );
};

export default PlayerProfilePage;