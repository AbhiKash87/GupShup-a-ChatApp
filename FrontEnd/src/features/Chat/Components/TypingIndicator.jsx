/* eslint-disable no-unused-vars */
import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex space-x-1">
        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-300"></div>
      </div>
      <span className="text-gray-500">User is typing...</span>
    </div>
  );
};

export default TypingIndicator;
