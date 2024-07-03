import React from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-black">&#x2715;</button>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
