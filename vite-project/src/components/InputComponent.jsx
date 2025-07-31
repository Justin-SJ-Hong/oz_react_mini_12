import '../styles/InputComponent.css'

export default function InputComponent({
  label,
  name,
  type = 'text',
  register,
  errors,
  rules = {},
  placeholder,
  className = '',
  autoComplete = 'off',
}) {
  const errorMessage = errors?.[name]?.message;

  return (
    <div className={`input-group ${className}`}>
      <label htmlFor={name} className="input-label">
        {label}
      </label>
      <input
        type={type}
        id={name}
        autoComplete={autoComplete}
        placeholder={placeholder || label}
        aria-invalid={errorMessage ? 'true' : 'false'}
        className={`input-field ${errorMessage ? 'input-error' : ''}`}
        {...register(name, rules)}
      />
      {errorMessage && (
        <span className="error-message">{errorMessage}</span>
      )}
    </div>
  );
}
