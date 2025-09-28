import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScoutProfile from '../ScoutProfile';
import { Header, Footer } from '@/layout/overallLayout';

const ScoutProfilePage = () => {
  const { scoutId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    // Go back to previous page
    navigate(-1); 
  };

  return (
    <>
      <Header />
      <div style={{ minHeight: '80vh' }}>
        <ScoutProfile 
          scoutId={scoutId} 
          onBack={handleBack}
        />
      </div>
      <Footer />
    </>
  );
};

export default ScoutProfilePage;