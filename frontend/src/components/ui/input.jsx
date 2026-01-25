import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

/**
 * Custom Input component that replaces the previous shadcn implementation
 * to avoid dependency issues with @/lib/utils
 */
const Input = ({ label, type = 'text', name, value, onChange, placeholder, icon, required, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative mb-4">
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full py-3 rounded-xl border-2 border-[var(--border-color)] bg-white text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)/50] focus:border-[var(--primary-500)] focus:ring-4 focus:ring-[var(--primary-500)]/10 outline-none transition-all ${icon ? 'pl-11' : 'pl-4'
            } ${isPassword ? 'pr-12' : 'pr-4'}`}
          required={required}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
