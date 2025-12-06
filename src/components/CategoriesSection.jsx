const CategoriesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 dark-brown inter-font">
          Popular Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Cleaning', icon: '🧹' },
            { name: 'Delivery', icon: '🚚' },
            { name: 'Errands', icon: '🏃‍♂️' },
            { name: 'Repairs', icon: '🔧' },
            { name: 'Moving', icon: '📦' },
            { name: 'Tutoring', icon: '📚' },
            { name: 'Pet Care', icon: '🐕' },
            { name: 'Other', icon: '💼' }
          ].map((category, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center cursor-pointer border-2 category-card"
            >
              <div className="text-3xl mb-3">{category.icon}</div>
              <h3 className="font-semibold dark-brown inter-font">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
