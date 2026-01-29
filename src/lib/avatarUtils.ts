// ============================================
// AVATAR UTILITIES - Gender-aware avatar generation
// ============================================

// Common female first names for gender detection
const femaleNames = new Set([
  'emily', 'sarah', 'jennifer', 'lisa', 'amanda', 'jessica', 'megan', 'rachel',
  'nicole', 'stephanie', 'patricia', 'mary', 'linda', 'elizabeth', 'barbara',
  'susan', 'karen', 'nancy', 'betty', 'margaret', 'sandra', 'ashley', 'kimberly',
  'donna', 'michelle', 'dorothy', 'carol', 'melissa', 'deborah', 'rebecca',
  'helen', 'anna', 'catherine', 'christine', 'samantha', 'kathleen', 'debra',
  'carolyn', 'janet', 'frances', 'diane', 'alice', 'judy', 'julie', 'heather',
  'teresa', 'doris', 'gloria', 'evelyn', 'cheryl', 'joan', 'mildred', 'katherine',
  'judith', 'rose', 'janice', 'angela', 'marie', 'amy', 'brenda', 'ann',
  'laura', 'kelly', 'nicole', 'tammy', 'tracy', 'andrea', 'tiffany', 'victoria',
  'theresa', 'denise', 'lori', 'paula', 'diana', 'cynthia', 'robin', 'anne',
]);

// Common male first names for gender detection  
const maleNames = new Set([
  'james', 'michael', 'david', 'robert', 'christopher', 'daniel', 'andrew',
  'william', 'thomas', 'matthew', 'john', 'richard', 'joseph', 'charles',
  'anthony', 'mark', 'donald', 'steven', 'paul', 'joshua', 'kenneth', 'kevin',
  'brian', 'george', 'timothy', 'ronald', 'marcus', 'jason', 'jeffrey', 'ryan',
  'jacob', 'gary', 'nicholas', 'eric', 'jonathan', 'stephen', 'larry', 'justin',
  'scott', 'brandon', 'benjamin', 'samuel', 'raymond', 'gregory', 'frank', 'alexander',
  'patrick', 'jack', 'dennis', 'jerry', 'tyler', 'aaron', 'jose', 'adam',
  'nathan', 'henry', 'douglas', 'zachary', 'peter', 'kyle', 'walter', 'ethan',
  'jeremy', 'harold', 'keith', 'christian', 'roger', 'noah', 'gerald', 'carl',
]);

/**
 * Detect gender based on first name
 */
export const detectGender = (firstName: string): 'male' | 'female' | 'neutral' => {
  const nameLower = firstName.toLowerCase().trim();
  
  if (femaleNames.has(nameLower)) return 'female';
  if (maleNames.has(nameLower)) return 'male';
  
  return 'neutral';
};

/**
 * Generate a deterministic number from a string (for consistent avatar selection)
 */
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Pre-selected high-quality avatar URLs from randomuser.me
// These are curated to look professional and realistic
const femaleAvatars = [
  'https://randomuser.me/api/portraits/women/1.jpg',
  'https://randomuser.me/api/portraits/women/2.jpg',
  'https://randomuser.me/api/portraits/women/3.jpg',
  'https://randomuser.me/api/portraits/women/4.jpg',
  'https://randomuser.me/api/portraits/women/5.jpg',
  'https://randomuser.me/api/portraits/women/6.jpg',
  'https://randomuser.me/api/portraits/women/7.jpg',
  'https://randomuser.me/api/portraits/women/8.jpg',
  'https://randomuser.me/api/portraits/women/9.jpg',
  'https://randomuser.me/api/portraits/women/10.jpg',
  'https://randomuser.me/api/portraits/women/11.jpg',
  'https://randomuser.me/api/portraits/women/12.jpg',
  'https://randomuser.me/api/portraits/women/14.jpg',
  'https://randomuser.me/api/portraits/women/15.jpg',
  'https://randomuser.me/api/portraits/women/16.jpg',
  'https://randomuser.me/api/portraits/women/17.jpg',
  'https://randomuser.me/api/portraits/women/18.jpg',
  'https://randomuser.me/api/portraits/women/19.jpg',
  'https://randomuser.me/api/portraits/women/20.jpg',
  'https://randomuser.me/api/portraits/women/21.jpg',
  'https://randomuser.me/api/portraits/women/22.jpg',
  'https://randomuser.me/api/portraits/women/23.jpg',
  'https://randomuser.me/api/portraits/women/24.jpg',
  'https://randomuser.me/api/portraits/women/25.jpg',
  'https://randomuser.me/api/portraits/women/26.jpg',
  'https://randomuser.me/api/portraits/women/27.jpg',
  'https://randomuser.me/api/portraits/women/28.jpg',
  'https://randomuser.me/api/portraits/women/29.jpg',
  'https://randomuser.me/api/portraits/women/30.jpg',
  'https://randomuser.me/api/portraits/women/31.jpg',
];

const maleAvatars = [
  'https://randomuser.me/api/portraits/men/1.jpg',
  'https://randomuser.me/api/portraits/men/2.jpg',
  'https://randomuser.me/api/portraits/men/3.jpg',
  'https://randomuser.me/api/portraits/men/4.jpg',
  'https://randomuser.me/api/portraits/men/5.jpg',
  'https://randomuser.me/api/portraits/men/6.jpg',
  'https://randomuser.me/api/portraits/men/7.jpg',
  'https://randomuser.me/api/portraits/men/8.jpg',
  'https://randomuser.me/api/portraits/men/9.jpg',
  'https://randomuser.me/api/portraits/men/10.jpg',
  'https://randomuser.me/api/portraits/men/11.jpg',
  'https://randomuser.me/api/portraits/men/12.jpg',
  'https://randomuser.me/api/portraits/men/14.jpg',
  'https://randomuser.me/api/portraits/men/15.jpg',
  'https://randomuser.me/api/portraits/men/16.jpg',
  'https://randomuser.me/api/portraits/men/17.jpg',
  'https://randomuser.me/api/portraits/men/18.jpg',
  'https://randomuser.me/api/portraits/men/19.jpg',
  'https://randomuser.me/api/portraits/men/20.jpg',
  'https://randomuser.me/api/portraits/men/21.jpg',
  'https://randomuser.me/api/portraits/men/22.jpg',
  'https://randomuser.me/api/portraits/men/23.jpg',
  'https://randomuser.me/api/portraits/men/24.jpg',
  'https://randomuser.me/api/portraits/men/25.jpg',
  'https://randomuser.me/api/portraits/men/26.jpg',
  'https://randomuser.me/api/portraits/men/27.jpg',
  'https://randomuser.me/api/portraits/men/28.jpg',
  'https://randomuser.me/api/portraits/men/29.jpg',
  'https://randomuser.me/api/portraits/men/30.jpg',
  'https://randomuser.me/api/portraits/men/31.jpg',
];

/**
 * Generate a gender-appropriate avatar URL based on user details
 * Uses deterministic selection to ensure consistency across sessions
 */
export const generateGenderedAvatarUrl = (
  userId: string, 
  firstName: string, 
  lastName: string
): string => {
  const gender = detectGender(firstName);
  const hash = hashString(`${userId}-${firstName}-${lastName}`);
  
  if (gender === 'female') {
    const index = hash % femaleAvatars.length;
    return femaleAvatars[index];
  } else {
    // Default to male for neutral/unknown genders
    const index = hash % maleAvatars.length;
    return maleAvatars[index];
  }
};

/**
 * Check if a user ID belongs to a doctor
 */
export const isDoctorId = (userId: string): boolean => {
  return userId.startsWith('doc_') || userId.startsWith('usr_doc_');
};

/**
 * Get linked entity ID from user ID
 */
export const getLinkedEntityId = (userId: string, linkedEntityId: string | null): string => {
  // If we have a linked entity ID, use it
  if (linkedEntityId) return linkedEntityId;
  
  // Extract doc_XXX from usr_doc_XXX
  if (userId.startsWith('usr_doc_')) {
    const num = userId.replace('usr_doc_', '');
    return `doc_${num}`;
  }
  
  return userId;
};
