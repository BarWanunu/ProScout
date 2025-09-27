import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScoutProfile from '../ScoutProfile';
import { Header, Footer } from '@/layout/overallLayout';

const ScoutProfilePage = () => {
  const { scoutId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
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