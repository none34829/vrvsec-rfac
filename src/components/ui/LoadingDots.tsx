import { motion } from 'framer-motion';

const loadingContainer = {
  width: '4rem',
  height: '2rem',
  display: 'flex',
  justifyContent: 'space-around',
};

const loadingCircle = {
  display: 'block',
  width: '0.5rem',
  height: '0.5rem',
  backgroundColor: 'black',
  borderRadius: '0.25rem',
};

const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const loadingCircleVariants = {
  start: {
    y: '50%',
  },
  end: {
    y: '150%',
  },
};

const loadingCircleTransition = {
  duration: 0.5,
  repeat: Infinity,
  repeatType: 'reverse' as const,
  ease: 'easeInOut',
};

export function LoadingDots() {
  return (
    <motion.div
      style={loadingContainer}
      variants={loadingContainerVariants}
      initial="start"
      animate="end"
    >
      <motion.span
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      />
      <motion.span
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      />
      <motion.span
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      />
    </motion.div>
  );
}
