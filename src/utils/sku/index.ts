function generateRandomSKU(): string {
  let sku = '';
  for (let i = 0; i < 10; i++) {
    // Generate a random digit between 0 and 9
    const randomDigit = Math.floor(Math.random() * 10);
    sku += randomDigit.toString();
  }
  return sku;
}

export default generateRandomSKU;
