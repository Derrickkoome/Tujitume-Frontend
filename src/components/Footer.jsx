import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 inter-font">Tujitume</h3>
            <p className="text-gray-300 inter-font">
              Connecting Kenyan youth with skills to income opportunities since 2024.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 inter-font">For Workers</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white inter-font">Find Gigs</a></li>
              <li><a href="#" className="hover:text-white inter-font">Build Profile</a></li>
              <li><a href="#" className="hover:text-white inter-font">Get Paid</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 inter-font">For Clients</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/post-gig" className="hover:text-white inter-font">Post Gigs</Link></li>
              <li><a href="#" className="hover:text-white inter-font">Find Workers</a></li>
              <li><a href="#" className="hover:text-white inter-font">Manage Tasks</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 inter-font">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white inter-font">Help Center</a></li>
              <li><a href="#" className="hover:text-white inter-font">Contact Us</a></li>
              <li><a href="#" className="hover:text-white inter-font">Safety Tips</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p className="inter-font">&copy; 2024 Tujitume. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
