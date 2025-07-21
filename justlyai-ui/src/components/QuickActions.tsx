import React from 'react';
import './QuickActions.css';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  return (
    <div className="quick-actions">
      <button onClick={() => onAction('emergency')}>Emergency Help</button>
      <button onClick={() => onAction('settlement')}>Settlement Tips</button>
      <button onClick={() => onAction('court')}>Court Prep</button>
    </div>
  );
};

export default QuickActions; 