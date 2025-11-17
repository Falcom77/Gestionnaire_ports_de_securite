/**
 * Convertit une adresse IP en nombre pour le tri
 * @param {string} ip - Adresse IP (peut contenir un masque /24)
 * @returns {number} - Représentation numérique de l'IP
 */
export const ipToNumber = (ip) => {
  const parts = ip.split('/')[0].split('.');
  return parts.reduce((acc, octet, idx) => 
    acc + (parseInt(octet) || 0) * Math.pow(256, 3 - idx), 0
  );
};

/**
 * Trie un tableau d'objets selon une clé et une direction
 * @param {Array} array - Tableau à trier
 * @param {string} key - Clé de tri
 * @param {string} direction - Direction ('asc' ou 'desc')
 * @returns {Array} - Tableau trié
 */
export const sortArray = (array, key, direction) => {
  if (!key) return array;
  
  return [...array].sort((a, b) => {
    let aValue = a[key];
    let bValue = b[key];
    
    // Tri spécial pour les adresses IP
    if (key === 'ip_address') {
      aValue = ipToNumber(aValue || '0.0.0.0');
      bValue = ipToNumber(bValue || '0.0.0.0');
    } else {
      aValue = String(aValue || '').toLowerCase();
      bValue = String(bValue || '').toLowerCase();
    }
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};
