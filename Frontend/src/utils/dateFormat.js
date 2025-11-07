/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (e.g., "Nov 7, 2025 at 10:30 AM")
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get relative time (e.g., "2 hours ago", "Yesterday")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = diffInMs / (1000 * 60);
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)} minutes ago`;
  if (diffInHours < 1) return 'Less than an hour ago';
  if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
  if (diffInDays < 2) return 'Yesterday';
  if (diffInDays < 7) return `${Math.floor(diffInDays)} days ago`;
  
  return formatDate(dateString);
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency (e.g., "$2,500.00")
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
