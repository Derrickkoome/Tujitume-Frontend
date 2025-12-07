import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '../lib/api';
import useAuth from '../hooks/useAuth';
import FormField from './FormField';
import FormSelect from './FormSelect';
import SubmitButton from './SubmitButton';

// Validation schema matching backend requirements
const gigSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000, 'Description must be less than 5000 characters'),
  category: z.string().min(1, 'Category is required'),
  budget: z.number().positive('Budget must be greater than 0'),
  budget_type: z.enum(['fixed', 'hourly'], { errorMap: () => ({ message: 'Budget type must be fixed or hourly' }) }),
  location: z.string().optional(),
  skills_required: z.string().optional(),
  deadline: z.string().optional(),
});

const PostGigForm = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    budget_type: 'fixed',
    location: '',
    skills_required: '',
    deadline: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Categories for dropdown
  const categories = [
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Mobile Development', label: 'Mobile Development' },
    { value: 'Graphic Design', label: 'Graphic Design' },
    { value: 'Content Writing', label: 'Content Writing' },
    { value: 'Digital Marketing', label: 'Digital Marketing' },
    { value: 'Video Editing', label: 'Video Editing' },
    { value: 'Data Entry', label: 'Data Entry' },
    { value: 'Virtual Assistant', label: 'Virtual Assistant' },
    { value: 'Translation', label: 'Translation' },
    { value: 'Other', label: 'Other' }
  ];

  // Budget type options
  const budgetTypes = [
    { value: 'fixed', label: 'Fixed Price' },
    { value: 'hourly', label: 'Hourly Rate' }
  ];

  // Validate form in real-time
  const validateForm = (data) => {
    try {
      // Convert budget to number for validation
      const validationData = {
        ...data,
        budget: data.budget ? parseFloat(data.budget) : 0,
      };
      gigSchema.parse(validationData);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check authentication
    if (!isAuthenticated) {
      toast.error('Please log in to post a gig');
      navigate('/login', { state: { from: { pathname: '/post-gig' } } });
      return;
    }

    if (!isFormValid) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API matching backend schema
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        budget: parseFloat(formData.budget),
        budget_type: formData.budget_type,
        location: formData.location.trim() || null,
        skills_required: formData.skills_required.trim() || null,
        deadline: formData.deadline || null,
      };

      const response = await api.post('/api/gigs', submitData);

      toast.success('🎉 Gig posted successfully!', {
        duration: 5000,
        icon: '✅',
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        budget: '',
        budget_type: 'fixed',
        location: '',
        skills_required: '',
        deadline: '',
      });
      setIsFormValid(false);

      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error posting gig:', error);
      
      // Handle specific error messages
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        navigate('/login', { state: { from: { pathname: '/post-gig' } } });
      } else if (error.response?.status === 400) {
        toast.error('Invalid gig data. Please check your inputs.');
      } else if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error('Failed to post gig. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <FormField
          label="Gig Title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="e.g., Build a Modern React Website"
          error={errors.title}
          required
          helperText="Minimum 5 characters, maximum 200 characters"
        />
      </div>

      {/* Description */}
      <div>
        <FormField
          label="Description"
          name="description"
          type="textarea"
          rows={6}
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe your services in detail. What will you deliver? What makes you unique?"
          error={errors.description}
          required
          helperText="Minimum 20 characters. Be specific about deliverables and expertise."
        />
      </div>

      {/* Category and Budget Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          options={categories}
          placeholder="Select category"
          error={errors.category}
          required
        />

        <FormSelect
          label="Budget Type"
          name="budget_type"
          value={formData.budget_type}
          onChange={handleInputChange}
          options={budgetTypes}
          error={errors.budget_type}
          required
        />
      </div>

      {/* Budget and Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label={`Budget (KES) - ${formData.budget_type === 'hourly' ? 'Per Hour' : 'Total'}`}
          name="budget"
          type="number"
          min="1"
          step="0.01"
          value={formData.budget}
          onChange={handleInputChange}
          placeholder="e.g., 5000"
          error={errors.budget}
          required
          helperText="Enter amount in Kenyan Shillings"
        />

        <FormField
          label="Location"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="e.g., Nairobi, Kenya or Remote"
          error={errors.location}
          helperText="Optional - specify if location matters"
        />
      </div>

      {/* Skills and Deadline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Skills Required"
          name="skills_required"
          type="text"
          value={formData.skills_required}
          onChange={handleInputChange}
          placeholder="e.g., React, Node.js, MongoDB"
          error={errors.skills_required}
          helperText="Optional - comma separated"
        />

        <FormField
          label="Deadline"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleInputChange}
          error={errors.deadline}
          helperText="Optional - when do you need this completed?"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-xl">💡</span>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Tips for a great gig:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Write a clear, descriptive title</li>
              <li>Provide detailed requirements in the description</li>
              <li>Set a realistic budget and deadline</li>
              <li>List specific skills you're looking for</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t border-gray-200">
        <SubmitButton
          disabled={!isFormValid || isSubmitting}
          loading={isSubmitting}
          loadingText="Creating Your Gig..."
        >
          🚀 Post Gig
        </SubmitButton>

        {!isFormValid && Object.keys(errors).length > 0 && (
          <p className="mt-3 text-sm text-red-600">
            Please fix the errors above before submitting
          </p>
        )}
      </div>
    </form>
  );
};

export default PostGigForm;
