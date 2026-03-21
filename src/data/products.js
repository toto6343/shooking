export const products = [
  {
    id: 1,
    name: '에어 맥스 270',
    brand: 'Nike',
    price: 159000,
    image: '/images/shoes/airmax270.jpg',
    category: '러닝화',
    description: '나이키의 혁신적인 에어 유닛이 탑재되어 하루 종일 편안함을 유지해주는 프리미엄 러닝화입니다.',
    sizes: [230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290],
    outOfStockSizes: [230, 290]
  },
  {
    id: 2,
    name: '조던 1 레트로 하이',
    brand: 'Nike',
    price: 189000,
    image: '/images/shoes/jordan1.jpg',
    category: '농구화',
    description: '클래식한 디자인과 상징적인 컬러웨이로 스니커즈 문화의 아이콘이 된 조던 1 레트로 하이입니다.',
    sizes: [230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290],
    outOfStockSizes: [230, 235, 240, 285, 290]
  },
  {
    id: 3,
    name: '척 테일러 올스타',
    brand: 'Converse',
    price: 69000,
    image: '/images/shoes/chukataylor.jpg',
    category: '캔버스화',
    description: '심플하고 유행을 타지 않는 디자인으로 전 세계적으로 사랑받는 컨버스의 시그니처 캔버스화입니다.',
    sizes: [220, 230, 240, 250, 260, 270, 280, 290, 300],
    outOfStockSizes: []
  },
  {
    id: 4,
    name: '울트라부스트 22',
    brand: 'Adidas',
    price: 229000,
    image: '/images/shoes/ultraboost22.jpg',
    category: '러닝화',
    description: '최적의 에너지 리턴과 편안한 착화감을 제공하는 아디다스의 최첨단 기술력이 집약된 러닝화입니다.',
    sizes: [230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290],
    outOfStockSizes: [260, 265]
  },
  {
    id: 5,
    name: '스탠 스미스',
    brand: 'Adidas',
    price: 119000,
    image: '/images/shoes/stansmith.jpg',
    category: '스니커즈',
    description: '깔끔한 실루엣과 미니멀한 디자인으로 어떤 스타일에도 잘 어울리는 클래식한 테니스화 스타일의 스니커즈입니다.',
    sizes: [220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280],
    outOfStockSizes: [220, 225]
  },
  {
    id: 6,
    name: '뉴발란스 574',
    brand: 'New Balance',
    price: 129000,
    image: '/images/shoes/newbalance574.jpg',
    category: '스니커즈',
    description: '뉴발란스의 아이코닉한 모델로, 뛰어난 쿠셔닝과 안정적인 지지력을 제공하는 일상용 스니커즈입니다.',
    sizes: [220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290],
    outOfStockSizes: [270, 275, 280]
  },
  {
    id: 7,
    name: '반스 올드스쿨',
    brand: 'Vans',
    price: 75000,
    image: '/images/shoes/vansoldschool.jpg',
    category: '스케이트화',
    description: '사이드 스트라이프 디자인이 특징인 반스의 클래식 스케이트화로, 내구성이 뛰어나고 스타일리시합니다.',
    sizes: [220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 300],
    outOfStockSizes: []
  },
  {
    id: 8,
    name: '푸마 스웨이드',
    brand: 'Puma',
    price: 89000,
    image: '/images/shoes/pumasuede.jpg',
    category: '스니커즈',
    description: '푸마의 역사와 함께해온 전설적인 스웨이드 소재의 스니커즈로, 빈티지한 매력이 돋보입니다.',
    sizes: [220, 230, 240, 250, 260, 270, 280, 290],
    outOfStockSizes: [280, 290]
  },
  {
    id: 9,
    name: '나이키 덩크 로우',
    brand: 'Nike',
    price: 139000,
    image: '/images/shoes/nikedunklow.jpg',
    category: '스니커즈',
    description: '스트릿 패션의 완성이라 불리는 나이키 덩크 로우는 세련된 컬러 조합과 편안한 착화감을 자랑합니다.',
    sizes: [230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290],
    outOfStockSizes: [230, 235, 240, 245, 250]
  },
  {
    id: 10,
    name: '리복 클래식 레더',
    brand: 'Reebok',
    price: 99000,
    image: '/images/shoes/reebokclassicleather.jpg',
    category: '스니커즈',
    description: '부드러운 프리미엄 가죽 소재를 사용하여 고급스러운 느낌과 편안함을 동시에 제공하는 클래식 스니커즈입니다.',
    sizes: [220, 230, 240, 250, 260, 270, 280],
    outOfStockSizes: []
  },
  {
    id: 11,
    name: '온 클라우드 5',
    brand: 'On',
    price: 179000,
    image: '/images/shoes/oncloud5.jpg',
    category: '러닝화',
    description: '구름 위를 걷는 듯한 가벼운 쿠셔닝을 제공하는 스위스 브랜드 On의 베스트셀러 러닝화입니다.',
    sizes: [230, 240, 250, 260, 270, 280, 290],
    outOfStockSizes: [230, 240]
  },
  {
    id: 12,
    name: '호카 본디 8',
    brand: 'Hoka',
    price: 199000,
    image: '/images/shoes/hokabondi8.jpg',
    category: '러닝화',
    description: '극강의 쿠셔닝을 자랑하는 호카의 대표적인 로드 러닝화로, 부드러운 주행감을 선사합니다.',
    sizes: [230, 240, 250, 260, 270, 280, 290],
    outOfStockSizes: [250, 260]
  }
];
