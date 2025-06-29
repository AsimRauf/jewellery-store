export const DiamondEnums = {
  TYPES: ['natural', 'lab'],
  
  SHAPES: [
    'round', 'princess', 'cushion', 'emerald', 'oval', 
    'radiant', 'pear', 'heart', 'marquise', 'asscher'
  ],
  
  COLORS: ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'],
  
  CLARITIES: [
    'FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 
    'SI1', 'SI2', 'I1', 'I2', 'I3'
  ],
  
  CUTS: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
  
  POLISH: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
  
  SYMMETRY: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
  
  FLUORESCENCE: ['None', 'Faint', 'Medium', 'Strong', 'Very Strong', 'STG'],
  
  CERTIFICATE_LABS: ['GIA', 'IGI', 'AGS', 'HRD', 'GCAL'],
  
  FANCY_COLORS: [
    'Yellow', 'Pink', 'Blue', 'Green', 'Orange', 
    'Purple', 'Brown', 'Black', 'Red', 'Gray', 'White'
  ]
};

// Type definitions for client-side use
export type DiamondType = 'natural' | 'lab';

export type DiamondShape = 
  | 'round' | 'princess' | 'cushion' | 'emerald' | 'oval' 
  | 'radiant' | 'pear' | 'heart' | 'marquise' | 'asscher';

export type DiamondColor = 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M';

export type DiamondClarity = 
  | 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' 
  | 'SI1' | 'SI2' | 'I1' | 'I2' | 'I3';

export type DiamondCut = 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';

export type DiamondPolish = 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';

export type DiamondSymmetry = 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';

export type DiamondFluorescence = 'None' | 'Faint' | 'Medium' | 'Strong' | 'Very Strong' | 'STG';

export type CertificateLab = 'GIA' | 'IGI' | 'AGS' | 'HRD' | 'GCAL';

export type DiamondFancyColor = 
  | 'Yellow' | 'Pink' | 'Blue' | 'Green' | 'Orange' 
  | 'Purple' | 'Brown' | 'Black' | 'Red' | 'Gray' | 'White';
