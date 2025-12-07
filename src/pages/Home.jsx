import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Welcome to Tujitume</h1>
          <p className="mt-2 text-gray-600">Find gigs or hire skilled workers in your area.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-2">Post a Gig</h3>
            <p className="text-sm text-gray-600">Create a listing to share the work you need done.</p>
          </div>
          <div className="col-span-1 bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-2">Browse Gigs</h3>
            <p className="text-sm text-gray-600">Explore available gigs and apply for work.</p>
          </div>
          <div className="col-span-1 bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-2">Manage Applications</h3>
            <p className="text-sm text-gray-600">Review applicants and select the best fit.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
