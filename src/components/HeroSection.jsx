const HeroSection = () => {
  const scrollToGigs = () => {
    const gigsSection = document.getElementById('gigs-section');
    if (gigsSection) {
      gigsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 background">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-4">
          <span className="green-circle text-sm mb-6">
            Connecting Kenyan Youth with Skills to Income
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight inter-font">
          <span className="dark-brown">Turn Your Skills Into </span>
          <span className="primary-orange">Income</span>
        </h1>
        <p className="text-base md:text-lg lg:text-xl mb-8 max-w-2xl mx-auto light-gray inter-font">
          Post casual jobs like cleaning, delivery, errands, and small repairs. Connect with local workers who can get things done quickly and reliably.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/post-gig">
            <button className="px-6 sm:px-8 py-2 sm:py-3 rounded-full text-white text-base sm:text-lg font-semibold transition duration-300 shadow-lg primary-orange-bg inter-font">
              Post a Gig Now
            </button>
          </a>
          <button
            onClick={scrollToGigs}
            className="px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold transition duration-300 border-2 primary-orange inter-font hover:bg-orange-500 hover:text-white"
          >
            Find Work
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
