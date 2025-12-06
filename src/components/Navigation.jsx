import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold dark-brown inter-font">
              Tujitume
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button className="light-gray inter-font hover:text-gray-900 text-sm sm:text-base">
              Login
            </button>
            <Link to="/post-gig">
              <button
                className="px-4 sm:px-6 py-2 rounded-full text-white font-semibold transition duration-300 text-sm sm:text-base primary-orange-bg inter-font"
              >
                Post a Gig
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
