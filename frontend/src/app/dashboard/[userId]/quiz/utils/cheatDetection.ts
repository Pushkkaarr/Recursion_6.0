export const handleWindowBlur = (callback: () => void): (() => void) => {
  const blurHandler = () => {
    callback();
  };
  
  window.addEventListener('blur', blurHandler);
  
  return () => {
    window.removeEventListener('blur', blurHandler);
  };
};

export const handleKeyboardEvents = (
  callback: () => void,
  allowInputForElement?: HTMLElement
): (() => void) => {
  const keyHandler = (event: KeyboardEvent) => {
    // Allow keyboard input if the target is a text input and allowInputForElement is provided
    const target = event.target as HTMLElement;
    if (
      allowInputForElement && 
      target === allowInputForElement && 
      (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')
    ) {
      return;
    }
    
    // Otherwise, consider it a violation and prevent default
    event.preventDefault();
    callback();
  };
  
  window.addEventListener('keydown', keyHandler);
  
  return () => {
    window.removeEventListener('keydown', keyHandler);
  };
};

export const handleContextMenu = (callback: () => void): (() => void) => {
  const contextMenuHandler = (event: MouseEvent) => {
    event.preventDefault();
    callback();
  };
  
  window.addEventListener('contextmenu', contextMenuHandler);
  
  return () => {
    window.removeEventListener('contextmenu', contextMenuHandler);
  };
};

export const preventBrowserNavigation = (): (() => void) => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = '';
    return '';
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
};
