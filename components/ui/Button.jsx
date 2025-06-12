import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles =
    'px-8 py-4 font-medium tracking-wide uppercase text-sm transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2 rounded-none';
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white',
    disabled: 'bg-primary-500 text-white cursor-not-allowed disabled opacity-60 pointer-events-none',
  };

  return (
    <motion.button
      whileHover={variant !== 'disabled' ? { scale: 1.02, y: -2 } : {}}
      whileTap={variant !== 'disabled' ? { scale: 0.98 } : {}}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={variant === 'disabled'}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
