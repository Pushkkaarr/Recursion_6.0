
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const formatDuration = (duration: number, unit: string): string => {
  if (unit === 'hours') {
    return `${duration} hour${duration !== 1 ? 's' : ''}`;
  }
  if (unit === 'weeks') {
    return `${duration} week${duration !== 1 ? 's' : ''}`;
  }
  if (unit === 'months') {
    return `${duration} month${duration !== 1 ? 's' : ''}`;
  }
  return `${duration} ${unit}${duration !== 1 ? 's' : ''}`;
};

export const formatPrice = (price: number): string => {
  if (price === 0) {
    return 'Free';
  }
  return `$${price}`;
};

export const formatLevel = (level: string): string => {
  return level.charAt(0).toUpperCase() + level.slice(1);
};

export const getDifficultyColor = (level: string): string => {
  switch (level.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800';
    case 'advanced':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
