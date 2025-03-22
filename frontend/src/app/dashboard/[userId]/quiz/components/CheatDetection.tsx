import React, { useEffect } from 'react';
import { ViolationEvent } from '../types';

interface CheatDetectionProps {
  isActive: boolean;
  violations: ViolationEvent[];
  onViolation: (type: ViolationEvent['type']) => void;
  currentInputRef?: React.RefObject<HTMLInputElement>;
}

const CheatDetection: React.FC<CheatDetectionProps> = ({ 
  isActive, 
  violations, 
  onViolation,
  currentInputRef
}) => {
  useEffect(() => {
    if (!isActive) return;
    
    // Handle window blur (minimizing)
    const handleBlur = () => {
      onViolation('BLUR');
    };
    
    // Handle keyboard events
    const handleKey = (e: KeyboardEvent) => {
      // If we have an input ref and it has focus, allow typing
      if (
        currentInputRef?.current &&
        document.activeElement === currentInputRef.current
      ) {
        // Only allow alphanumeric keys, symbols, and control keys while typing
        const allowedKeys = [
          // Allow navigation within text field
          'ArrowLeft', 'ArrowRight', 'Home', 'End', 
          'Backspace', 'Delete', 'Tab', 'Enter', 'Escape',
          // Allow text selection
          'Shift', 'Control', 'Meta', 'Alt',
          // Allow copy/paste operations
          'c', 'v', 'x', 'a', 'z'
        ];
        
        // Check if key is alphanumeric or symbol or in allowed list
        const isAlphaNumeric = /^[a-zA-Z0-9]$/.test(e.key);
        const isSymbol = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\s]$/.test(e.key);
        const isAllowedKey = allowedKeys.includes(e.key);
        
        if (isAlphaNumeric || isSymbol || isAllowedKey || e.ctrlKey || e.metaKey) {
          return; // Allow the keypress
        }
      }
      
      // Only register a violation for truly disallowed keys
      if (e.key !== 'F12' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        onViolation('KEY');
      }
    };
    
    // Handle right click
    const handleContextMenu = (e: MouseEvent) => {
      // Check if right-click happened inside the input field
      if (
        currentInputRef?.current &&
        e.target instanceof Node &&
        currentInputRef.current.contains(e.target)
      ) {
        return; // Allow right-click in text input
      }
      
      e.preventDefault();
      onViolation('RIGHT_CLICK');
      return false;
    };
    
    // Prevent browser navigation
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    
    // Add event listeners
    window.addEventListener('blur', handleBlur);
    window.addEventListener('keydown', handleKey);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isActive, onViolation, currentInputRef]);

  if (!isActive || violations.length === 0) {
    return null;
  }

  return (
    <div className="p-4 flex flex-col items-center backdrop-blur-md bg-white bg-opacity-70 border border-white border-opacity-20 shadow-lg rounded-2xl">
      <div className="text-sm font-medium text-gray-500 mb-1">Violations Detected</div>
      
      <div className={`text-3xl font-bold ${
        violations.length >= 3 ? 'text-red-500 animate-pulse' : 'text-gray-900'
      }`}>
        {violations.length} / 5
      </div>
      
      <div className="w-full h-1.5 bg-gray-200 rounded-full mt-3 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${
            violations.length >= 3 ? 'bg-red-500' : 'bg-gray-400'
          }`}
          style={{ width: `${(violations.length / 5) * 100}%` }}
        ></div>
      </div>
      
      {violations.length >= 3 && (
        <p className="mt-3 text-xs text-red-500 font-medium text-center">
          Warning: {5 - violations.length} more violations will end the quiz
        </p>
      )}
    </div>
  );
};

export default CheatDetection;