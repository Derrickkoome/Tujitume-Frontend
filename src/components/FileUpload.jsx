const FileUpload = ({
  label,
  name,
  onChange,
  multiple = false,
  accept,
  helperText
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-800 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="file"
          id={name}
          name={name}
          multiple={multiple}
          accept={accept}
          onChange={onChange}
          className="w-full px-4 py-3 border-2 border-gray-200 border-dashed rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>
      {helperText && (
        <p className="text-sm text-gray-600 flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
