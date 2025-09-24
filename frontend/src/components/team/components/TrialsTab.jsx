import React from 'react';
import TrialsManager from '@/components/shared/TrialsManager';

const TrialsTab = ({ trials = [], onTrialUpdate }) => {
  // Removed the useEffect that was causing issues with tab switching
  
  return (
    <TrialsManager 
      trials={trials}
      userRole="team"
      onTrialUpdate={onTrialUpdate}
      showActions={true}
    />
  );
};

export default TrialsTab;