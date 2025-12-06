import { useState } from 'react';
import { z } from 'zod';
import toast from 'react-hot-toast';
import FormField from './FormField';
import FormSelect from './FormSelect';
import FileUpload from './FileUpload';
import SubmitButton from './SubmitButton';

// Validation schema
const gigSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  category: z.string().min(1, 'Category is required'),
  budget: z.string().refine(val => val === '' || (!isNaN(Number(val)) && Number(val) >= 1), 'Budget must be at least 1'),
  deadline: z.string().min(1, 'Deadline is required'),
});

const PostGigForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    deadline: '',
    attachments: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Categories for dropdown - matching popular categories from landing page
  const categories = [
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'errands', label: 'Errands' },
    { value: 'repairs', label: 'Repairs' },
    { value: 'moving', label: 'Moving' },
    { value: 'tutoring', label: 'Tutoring' },
    { value: 'pet-care', label: 'Pet Care' },
    { value: 'other', label: 'Other' }
  ];

  // Validate form in real-time
  const validateForm = (data) => {
    try {
      gigSchema.parse(data);
      setErrors({});
      setIsFormValid(true);
    } catch (error) {
      const validationErrors = {};
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err) => {
          validationErrors[err.path[0]] = err.message;
        });
      } else {
        console.error('Validation error:', error);
      }
      setErrors(validationErrors);
      setIsFormValid(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    validateForm(newData);
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, attachments: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API (exclude attachments for now, can be handled separately)
      const submitData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget: formData.budget,
        deadline: formData.deadline,
      };

      // For demo purposes, simulate successful API call since no backend is available
      // In production, this would be:
      // const response = await fetch('/gigs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(submitData) });
      // if (!response.ok) throw new Error('Failed to create gig');
      // const result = await response.json();

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Gig posted successfully!');

      // Store gig in localStorage for display
      const postedGigs = JSON.parse(localStorage.getItem('postedGigs') || '[]');
      postedGigs.push({
        id: Date.now(),
        ...submitData,
        postedAt: new Date().toISOString(),
      });
      localStorage.setItem('postedGigs', JSON.stringify(postedGigs));

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        budget: '',
        deadline: '',
        attachments: null,
      });
      setIsFormValid(false);
    } catch (error) {
      toast.error('Failed to post gig. Please try again.');
      console.error('Error posting gig:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Side - Form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Hero Illustration */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Create Your Gig</h3>
            <p className="text-sm text-gray-600">Fill in the details below and watch your gig preview update live!</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <span className="ml-3 text-sm font-medium text-gray-900">Gig Details</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">2</div>
                <span className="ml-3 text-sm font-medium text-gray-500">Attachments</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">3</div>
                <span className="ml-3 text-sm font-medium text-gray-500">Review & Submit</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '33%' }}></div>
            </div>
          </div>

          {/* Gig Overview Section */}
          <div className="bg-white rounded-lg border border-orange-200 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">💼</span>
              <h3 className="text-lg font-semibold text-gray-900">Gig Overview</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <div className="flex items-center mb-2">
                  <FormField
                    label="📝 Title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Urgent House Cleaning - 2 Bedroom Apartment"
                    error={errors.title}
                    required
                  />
                  <div className="ml-2 group relative">
                    <span className="text-gray-400 hover:text-gray-600 cursor-help"></span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      Choose a clear, attractive title that describes your gig
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center mb-2">
                  <FormField
                    label="✏️ Description"
                    name="description"
                    type="textarea"
                    rows={8}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="e.g., I need someone to clean my 2-bedroom apartment this weekend. Includes vacuuming, dusting, bathroom cleaning, and kitchen. All cleaning supplies provided. Must be reliable and trustworthy."
                    error={errors.description}
                    required
                  />
                  <div className="ml-2 group relative">
                    <span className="text-gray-400 hover:text-gray-600 cursor-help">ℹ️</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      Be specific about what you'll deliver and your unique value
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center">
                  <FormSelect
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    options={categories}
                    placeholder="Choose the most relevant category"
                    error={errors.category}
                    required
                  />
                  <div className="ml-2 group relative">
                    <span className="text-gray-400 hover:text-gray-600 cursor-help">ℹ️</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      Select the category that best fits your service
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compensation Section */}
          <div className="bg-white rounded-lg border border-orange-200 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">💰</span>
              <h3 className="text-lg font-semibold text-gray-900">Compensation</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <FormField
                  label="Budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="e.g., 2500"
                  error={errors.budget}
                  required
                />
                <div className="ml-2 group relative">
                  <span className="text-gray-400 hover:text-gray-600 cursor-help"></span>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    Enter the total amount you will pay for this gig
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <FormField
                  label="⏳ Deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  placeholder="Select deadline date"
                  error={errors.deadline}
                  required
                />
                <div className="ml-2 group relative">
                  <span className="text-gray-400 hover:text-gray-600 cursor-help"></span>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    Workers must complete the gig before this date
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="bg-white rounded-lg border border-orange-200 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📎</span>
              <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
              <div className="ml-2 group relative">
                <span className="text-gray-400 hover:text-gray-600 cursor-help"></span>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  Upload images, PDFs, or work samples to showcase your expertise
                </div>
              </div>
            </div>
            <FileUpload
              label="📎 Attachments (Optional)"
              name="attachments"
              onChange={handleFileChange}
              multiple
              helperText="Upload samples of your work, portfolio files, or any relevant documents"
            />
          </div>

          <div className="pt-6 border-t border-gray-200">
            <SubmitButton
              disabled={!isFormValid}
              loading={isSubmitting}
              loadingText="Creating Your Gig..."
            >
               Post Gig
            </SubmitButton>
          </div>
        </form>
      </div>

      {/* Right Side - Live Preview */}
      <div className="lg:col-span-1">
        <div className="sticky top-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              Live Preview
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              As you type, we show how your gig will look for workers.
            </p>

            {/* Preview Gig Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {formData.category ? categories.find(cat => cat.value === formData.category)?.label || 'General' : 'General'}
                </span>
                <span className="text-sm font-bold text-orange-600">
                  {formData.budget ? `KES ${formData.budget}` : 'KES 0'}
                </span>
              </div>

              <h4 className="text-sm font-bold text-gray-900 mb-2">
                {formData.title || 'Your Gig Title'}
              </h4>

              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {formData.description || 'Your gig description will appear here...'}
              </p>

              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>
                  {formData.deadline ? `Due: ${new Date(formData.deadline).toLocaleDateString()}` : 'No deadline set'}
                </span>
                <span>Just posted</span>
              </div>
            </div>

            {!formData.title && !formData.description && !formData.category && !formData.budget && (
              <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800">
                  💡 Start filling in your gig details to see the live preview!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostGigForm;
