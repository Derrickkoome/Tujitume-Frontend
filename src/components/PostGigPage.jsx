import { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import PostGigForm from './PostGigForm';

const PostGigPage = () => {
  return (
    <div className="min-h-screen bg-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Post a <span className="text-orange-500">Gig</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with clients looking for your skills. Create a compelling gig that showcases what you can deliver.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Gig Details</h2>
            <p className="text-gray-600">Fill in the information below to create your gig listing.</p>
          </div>

          <PostGigForm />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <Link to="/dashboard" className="text-orange-600 hover:text-orange-500 font-medium">
              View your dashboard
            </Link>
            {' '}or{' '}
            <Link to="/" className="text-orange-600 hover:text-orange-500 font-medium">
              browse existing gigs
            </Link>
          </p>
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
          },
        }}
      />
    </div>
  );
};

export default PostGigPage;
