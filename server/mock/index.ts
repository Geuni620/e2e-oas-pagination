interface ProductData {
  id: string;
  boxCount: number;
  shippingMethod: string;
  productTemperature: string;
  configurationCount: number;
  productCode: string;
  productName: string;
}

const shippingMethods = ["택배", "직배송", "퀵배송", "새벽배송"];
const temperatures = ["상온", "냉장", "냉동"];
const productNames = [
  "유기농 사과",
  "제주 감귤",
  "국내산 바나나",
  "무농약 딸기",
  "친환경 포도",
  "신선 오렌지",
  "프리미엄 배",
  "GAP인증 토마토",
  "유기농 블루베리",
  "무농약 키위",
];

export const generateMockData = (count: number): ProductData[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `PROD-${(index + 1).toString().padStart(5, "0")}`,
    boxCount: Math.floor(Math.random() * 10) + 1,
    shippingMethod:
      shippingMethods[Math.floor(Math.random() * shippingMethods.length)],
    productTemperature:
      temperatures[Math.floor(Math.random() * temperatures.length)],
    configurationCount: Math.floor(Math.random() * 5) + 1,
    productCode: `SKU-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`,
    productName: productNames[Math.floor(Math.random() * productNames.length)],
  }));
};
