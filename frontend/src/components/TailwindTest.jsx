import React from 'react';

const TailwindTest = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4 text-blue-400">
        🎉 Tailwind is working!
      </h1>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300">
        Click Me
      </button>
    </div>
  );
};

export default TailwindTest;
