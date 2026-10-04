export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { carName, parts } = req.body;
  if (!parts) {
    return res.status(400).json({ error: 'Missing parts data' });
  }

  // قاعدة بيانات الأسعار الأساسية والندرة
  const carsDb = {
    "Aurus Senat": { p: 13000000, rt: "premium" },
    "BMW M5 F90": { p: 7000000, rt: "premium" },
    "Bugatti Chiron": { p: 35000000, rt: "premium" },
    "Chevrolet Camaro ZL1": { p: 4500000, rt: "medium" },
    "Dodge Charger SRT": { p: 4200000, rt: "medium" },
    "Ford Mustang GT": { p: 3800000, rt: "medium" },
    "Koenigsegg Jesko": { p: 45000000, rt: "premium" },
    "Lamborghini Aventador": { p: 22000000, rt: "premium" },
    "Mercedes-Benz G63": { p: 12000000, rt: "premium" },
    "Nissan GT-R R35": { p: 6500000, rt: "premium" },
    "Porsche 911 Turbo S": { p: 11000000, rt: "premium" },
    "Tesla Model S Plaid": { p: 5500000, rt: "medium" },
    "Toyota Supra MK4": { p: 5000000, rt: "medium" },
    "VAZ 2107": { p: 150000, rt: "economy" },
    "GAZ Volga": { p: 250000, rt: "economy" },
    "ZAZ 968": { p: 80000, rt: "economy" }
  };

  const car = carsDb[carName] || { p: 5000000, rt: "medium" };
  const basePrice = car.p;

  // أوزان قطع التعديل
  const weights = { red: 1.0, gold: 0.75, purple: 0.5, blue: 0.3, green: 0.15, gray: 0.05 };
  let totalWeightedParts = 0;
  for (const key in parts) {
    if (weights[key]) {
      totalWeightedParts += (parts[key] || 0) * weights[key];
    }
  }

  const hammerStock = Math.ceil(basePrice * 1.2);
  const minMod = Math.ceil(basePrice * (1 + totalWeightedParts * 0.1));
  const hammerMod = Math.ceil(hammerStock * (1 + totalWeightedParts * 0.1));
  const vmMin = Math.ceil(minMod * 0.9);
  const vmMax = Math.ceil(hammerMod * 1.15);

  return res.status(200).json({
    hammerStock,
    minMod,
    hammerMod,
    vmMin,
    vmMax
  });
}
