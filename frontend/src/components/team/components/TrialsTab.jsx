import TrialsManager from '@/components/shared/TrialsManager';

const TrialsTab = ({ trials = [], onTrialUpdate }) => {
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