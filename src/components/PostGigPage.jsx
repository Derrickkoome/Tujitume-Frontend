import { Toaster } from 'react-hot-toast';
import PostGigForm from './PostGigForm';

const PostGigPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Post Your Gig
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your services with our community. Create a compelling gig that showcases your expertise and attracts the right clients.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 px-8 py-10">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Gig Details</h2>
            <p className="text-gray-600">Fill in the information below to create your gig listing.</p>
          </div>

          <PostGigForm />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need help? Check our{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
              guidelines for creating effective gigs
            </a>
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
