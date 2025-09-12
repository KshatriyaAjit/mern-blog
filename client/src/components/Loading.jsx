import React from 'react';
import loadingIcon from '@/assets/images/loading.svg';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center 
                    bg-white/70 dark:bg-black/70 backdrop-blur-sm">
      <img
        src={loadingIcon}
        alt="Loading..."
        className="w-16 h-16 animate-spin"
      />
    </div>
  );
};

export default Loading;
