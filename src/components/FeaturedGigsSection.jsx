import { useState, useEffect } from 'react';

const FeaturedGigsSection = () => {
  const [postedGigs, setPostedGigs] = useState([]);

  useEffect(() => {
    const gigs = JSON.parse(localStorage.getItem('postedGigs') || '[]');
    setPostedGigs(gigs);
  }, []);

  const getCategoryIcon = (category) => {
    const icons = {
      'web-development': '💻',
      'mobile-development': '📱',
      'design': '🎨',
      'writing': '✍️',
      'marketing': '📢',
      'consulting': '🤝',
      'other': '💼'
    };
    return icons[category] || '💼';
  };

  return (
    <section id="gigs-section" className="py-16 px-4 sm:px-6 lg:px-8 background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 dark-brown inter-font">
          Latest Gigs Available
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Posted Gigs */}
          {postedGigs.slice(0, 6).map((gig) => (
            <div key={gig.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium light-orange primary-orange inter-font">
                  {gig.category.replace('-', ' ').toUpperCase()}
                </span>
                <span className="text-lg font-bold primary-orange inter-font">
                  KES {gig.budget}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 dark-brown inter-font">
                {gig.title}
              </h3>
              <p className="text-sm mb-4 light-gray inter-font">
                {gig.description.length > 100 ? gig.description.substring(0, 100) + '...' : gig.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm light-gray inter-font">
                  Deadline: {new Date(gig.deadline).toLocaleDateString()}
                </span>
                <span className="text-sm font-medium dark-brown inter-font">
                  Just posted
                </span>
              </div>
            </div>
          ))}

          {/* Gig Card 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium light-orange primary-orange inter-font">
                Delivery
              </span>
              <span className="text-lg font-bold primary-orange inter-font">
                KES 300
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2 dark-brown inter-font">
              Urgent Document Delivery
            </h3>
            <p className="text-sm mb-4 light-gray inter-font">
              Need someone to deliver important documents across town within 2 hours.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm light-gray inter-font">
                Westlands, Nairobi
              </span>
              <span className="text-sm font-medium dark-brown inter-font">
                2 hours ago
              </span>
            </div>
          </div>

          {/* Gig Card 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium light-orange primary-orange inter-font">
                Cleaning
              </span>
              <span className="text-lg font-bold primary-orange inter-font">
                KES 800
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2 dark-brown inter-font">
              House Cleaning Service
            </h3>
            <p className="text-sm mb-4 light-gray inter-font">
              Clean a 2-bedroom apartment this weekend. All supplies provided.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm light-gray inter-font">
                Karen, Nairobi
              </span>
              <span className="text-sm font-medium dark-brown inter-font">
                4 hours ago
              </span>
            </div>
          </div>

          {/* Gig Card 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium light-orange primary-orange inter-font">
                Errands
              </span>
              <span className="text-lg font-bold primary-orange inter-font">
                KES 500
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2 dark-brown inter-font">
              Grocery Shopping & Delivery
            </h3>
            <p className="text-sm mb-4 light-gray inter-font">
              Pick up groceries from Nakumatt and deliver to my apartment.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm light-gray inter-font">
                Kilimani, Nairobi
              </span>
              <span className="text-sm font-medium dark-brown inter-font">
                6 hours ago
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGigsSection;
