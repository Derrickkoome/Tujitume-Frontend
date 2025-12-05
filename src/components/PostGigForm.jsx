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
  pricing: z.string().min(1, 'Pricing is required'),
  deliveryTime: z.string().min(1, 'Delivery time is required'),
});

const PostGigForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    pricing: '',
    deliveryTime: '',
    attachments: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Categories for dropdown
  const categories = [
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'design', label: 'Design' },
    { value: 'writing', label: 'Writing' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'consulting', label: 'Consulting' },
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
      error.errors.forEach((err) => {
        validationErrors[err.path[0]] = err.message;
      });
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
        pricing: formData.pricing,
        deliveryTime: formData.deliveryTime,
      };

      const response = await fetch('/api/gigs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error('Failed to create gig');
      }

      const result = await response.json();
      toast.success('Gig posted successfully!');

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        pricing: '',
        deliveryTime: '',
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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <FormField
            label="Title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter an attractive title for your gig"
            error={errors.title}
            required
          />
        </div>

        <div className="md:col-span-2">
          <FormField
            label="Description"
            name="description"
            type="textarea"
            rows={5}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your services in detail. What will you deliver? What makes you unique?"
            error={errors.description}
            required
          />
        </div>

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

        <FormField
          label="Pricing / Budget"
          name="pricing"
          type="text"
          value={formData.pricing}
          onChange={handleInputChange}
          placeholder="e.g., $50 - $100, Fixed price, Hourly rate"
          error={errors.pricing}
          required
        />

        <FormField
          label="Delivery Time"
          name="deliveryTime"
          type="text"
          value={formData.deliveryTime}
          onChange={handleInputChange}
          placeholder="e.g., 1-3 days, 1 week, 2 weeks"
          error={errors.deliveryTime}
          required
        />

        <div className="md:col-span-2">
          <FileUpload
            label="Attachments (Optional)"
            name="attachments"
            onChange={handleFileChange}
            multiple
            helperText="Upload samples of your work, portfolio files, or any relevant documents"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <SubmitButton
          disabled={!isFormValid}
          loading={isSubmitting}
          loadingText="Creating Your Gig..."
        >
          🚀 Post Gig
        </SubmitButton>
      </div>
    </form>
  );
};

export default PostGigForm;
