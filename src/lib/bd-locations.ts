/**
 * Complete Bangladeshi Districts & Thanas/Upazilas Dataset
 * Organized by Division & District for precise address selection
 */

export interface BDLocation {
  district: string;
  division: string;
  thanas: string[];
}

export const BD_LOCATIONS: BDLocation[] = [
  {
    district: 'Kishoreganj',
    division: 'Dhaka',
    thanas: [
      'Pakundia',
      'Kishoreganj Sadar',
      'Katiadi',
      'Bhairab',
      'Karimganj',
      'Tarail',
      'Hussainpur',
      'Kuliarchar',
      'Itna',
      'Mithamain',
      'Nikli',
      'Ashtagram',
      'Bajitpur',
    ],
  },
  {
    district: 'Dhaka',
    division: 'Dhaka',
    thanas: [
      'Mirpur',
      'Uttara',
      'Dhanmondi',
      'Gulshan',
      'Banani',
      'Jatrabari',
      'Tejgaon',
      'Mohammadpur',
      'Badda',
      'Savar',
      'Dhamrai',
      'Keraniganj',
      'Dohar',
      'Nawabganj',
    ],
  },
  {
    district: 'Gazipur',
    division: 'Dhaka',
    thanas: ['Gazipur Sadar', 'Tongi', 'Kaliakair', 'Sreepur', 'Kapasia', 'Kaliganj'],
  },
  {
    district: 'Narayanganj',
    division: 'Dhaka',
    thanas: ['Narayanganj Sadar', 'Siddhirganj', 'Fatullah', 'Rupganj', 'Araihazar', 'Sonargaon'],
  },
  {
    district: 'Narsingdi',
    division: 'Dhaka',
    thanas: ['Narsingdi Sadar', 'Palash', 'Shibpur', 'Raipura', 'Monohardi', 'Belabo'],
  },
  {
    district: 'Mymensingh',
    division: 'Mymensingh',
    thanas: [
      'Mymensingh Sadar',
      'Gafargaon',
      'Trishal',
      'Bhaluka',
      'Muktagacha',
      'Phulpur',
      'Haluaghat',
      'Dhobaura',
      'Nandail',
      'Ishwarganj',
    ],
  },
  {
    district: 'Chittagong',
    division: 'Chittagong',
    thanas: [
      'Kotwali',
      'Panchlaish',
      'Agrabad',
      'Halishahar',
      'Patenga',
      'Hathazari',
      'Sitakunda',
      'Mirsarai',
      'Patiya',
      'Boalkhali',
      'Anwara',
      'Raozan',
    ],
  },
  {
    district: 'Comilla',
    division: 'Chittagong',
    thanas: [
      'Comilla Sadar',
      'Comilla Sadar Dakshin',
      'Daudkandi',
      'Chandina',
      'Muradnagar',
      'Laksam',
      'Burichang',
      'Debidwar',
    ],
  },
  {
    district: 'Sylhet',
    division: 'Sylhet',
    thanas: ['Sylhet Sadar', 'Beanibazar', 'Golapganj', 'Sreemangal', 'Zakiganj', 'Kanaighat', 'Fenchuganj'],
  },
  {
    district: 'Rajshahi',
    division: 'Rajshahi',
    thanas: ['Boalia', 'Rajpara', 'Motihar', 'Paba', 'Godagari', 'Tanore', 'Bagha', 'Charghat'],
  },
  {
    district: 'Khulna',
    division: 'Khulna',
    thanas: ['Khulna Sadar', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Phultala', 'Rupsha', 'Dacope'],
  },
  {
    district: 'Barisal',
    division: 'Barisal',
    thanas: ['Barisal Sadar', 'Babuganj', 'Bakerganj', 'Banaripara', 'Gournadi', 'Hizla', 'Mehendiganj'],
  },
  {
    district: 'Rangpur',
    division: 'Rangpur',
    thanas: ['Rangpur Sadar', 'Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj'],
  },
];
