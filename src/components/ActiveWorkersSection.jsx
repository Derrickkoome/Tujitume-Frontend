const ActiveWorkersSection = () => {
  return (
    <section className="py-16 primary-orange-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white inter-font">
          Active Workers Near You
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Neighborhood Card 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-100 hover:shadow-lg transition duration-300">
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-3">📍</div>
              <h3 className="text-xl font-bold dark-brown inter-font">Westlands</h3>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm light-gray inter-font">Active Workers</span>
              <span className="text-lg font-bold primary-orange inter-font">247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm light-gray inter-font">Avg Rating</span>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">⭐</span>
                <span className="text-lg font-bold dark-brown inter-font">4.8</span>
              </div>
            </div>
          </div>

          {/* Neighborhood Card 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-100 hover:shadow-lg transition duration-300">
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-3">📍</div>
              <h3 className="text-xl font-bold dark-brown inter-font">Karen</h3>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm light-gray inter-font">Active Workers</span>
              <span className="text-lg font-bold primary-orange inter-font">189</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm light-gray inter-font">Avg Rating</span>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">⭐</span>
                <span className="text-lg font-bold dark-brown inter-font">4.7</span>
              </div>
            </div>
          </div>

          {/* Neighborhood Card 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-100 hover:shadow-lg transition duration-300">
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-3">📍</div>
              <h3 className="text-xl font-bold dark-brown inter-font">Kilimani</h3>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm light-gray inter-font">Active Workers</span>
              <span className="text-lg font-bold primary-orange inter-font">156</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm light-gray inter-font">Avg Rating</span>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">⭐</span>
                <span className="text-lg font-bold dark-brown inter-font">4.9</span>
              </div>
            </div>
          </div>
        </div>

        {/* Find Gig Near Me Button */}
        <div className="text-center">
          <button className="px-8 py-3 rounded-full text-white text-lg font-semibold transition duration-300 shadow-lg primary-orange-bg inter-font hover:shadow-xl">
            🔍 Find Gig Near Me
          </button>
        </div>
      </div>
    </section>
  );
};

export default ActiveWorkersSection;
