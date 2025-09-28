import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeamProfile from '../TeamProfile';
import { Header, Footer } from '@/layout/overallLayout';

const TeamProfilePage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    // Go back to previous page
    navigate(-1); 
  };

  return (
    <>
      <Header />
      <div style={{ minHeight: '80vh' }}>
        <TeamProfile 
          teamId={teamId} 
          onBack={handleBack}
        />
      </div>
      <Footer />
    </>
  );
};

export default TeamProfilePage;