const SubmitButton = ({
  children,
  disabled = false,
  loading = false,
  loadingText = 'Submitting...',
  className = ''
}) => {
  const baseClasses = 'w-full py-4 px-6 rounded-xl font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]';

  const enabledClasses = 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl';
  const disabledClasses = 'bg-gray-400 cursor-not-allowed opacity-50';

  const finalClassName = `${baseClasses} ${disabled || loading ? disabledClasses : enabledClasses} ${className}`;

  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={finalClassName}
    >
      {loading ? (
        <div className="flex items-center justify-center" aria-busy="true" aria-live="polite">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" role="img" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </div>
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
};

export default SubmitButton;
