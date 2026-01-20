const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`
        w-full px-4 py-2.5 rounded-lg
        bg-white/50 dark:bg-gray-800/50
        border border-gray-200 dark:border-gray-700
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
        text-gray-900 dark:text-gray-100
        placeholder-gray-400 dark:placeholder-gray-500
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    />
  );
};

export default Input;




