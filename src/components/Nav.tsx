import React, { useState } from 'react';
import Dialog from './Dialog';
import UserForm from './UserForm';

const Nav: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <>
      <nav className="flex justify-end border-b-2 pb-4 border-gray-300">
        <button
          className="text-xl mr-4 mt-4 bg-blue-600 hover:bg-blue-800 text-white rounded px-4 py-1 ease-in transition-all"
          onClick={openDialog}
        >
          Add
        </button>
      </nav>
      <Dialog isOpen={isDialogOpen} onClose={closeDialog}>
        <UserForm />
      </Dialog>
    </>
  )
}

export default Nav