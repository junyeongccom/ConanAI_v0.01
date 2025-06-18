export type IndustryType = 'manufacturing' | 'construction' | 'semiconductor';

export interface FinancialImpactInput {
  industryType: IndustryType;
  region: string;
  // Manufacturing related input fields (can be subdivided if needed)
  manufacturing?: {
    employeeCount: number; // Number of workers
    hourlyProductionValuePerPerson: number; // Hourly production value per person
    workHourReductionPerDay: number; // Work hour reduction per day (hours)
    normalDailyPowerConsumptionKWh: number; // Normal daily power consumption (kWh)
    powerConsumptionIncreaseRate: number; // Power consumption increase rate during heatwaves (%)
    electricityUnitPrice: number; // Electricity unit price (KRW/kWh)
    dailySupplyCostPerPerson: number; // Daily supply cost per person (KRW)
    machineShutdownHoursPerDay?: number; // Equipment shutdown hours per day (hours)
    hourlyProductionQuantity?: number; // Hourly production quantity (units)
    productUnitPrice?: number; // Product unit price (KRW/unit)
    // Other factors: equipment maintenance costs, additional defect rates, etc. (to be considered)
  };
  // Construction related input fields
  construction?: {
    employeeCount: number; // Number of workers
    totalWorkHourReductionPerDay: number; // Total work hour reduction per day (hours)
    hourlyLaborCost: number; // Hourly labor cost per worker (KRW)
    fuelElectricityIncreaseAmount: number; // Fuel/electricity usage increase during heatwaves (units: kWh or L)
    fuelElectricityUnitPrice: number; // Fuel/electricity unit price (KRW/unit)
    dailySupplyCostPerPerson: number; // Daily heatwave response supply cost per person (KRW)
    dailyIndirectConstructionCost: number; // Daily construction cost (indirect costs) (KRW)
    projectDelayDays: number; // Project delay days (days)
    liquidatedDamagesPerDay: number; // Liquidated damages (KRW/day, 0 if none)
    // Other factors: increased safety accidents, insurance premium increases, etc. (to be considered)
  };
  // Semiconductor industry related input fields
  semiconductor?: {
    technicalEmployeeCount: number; // Number of technical staff
    hourlyValuePerTechnicalEmployee: number; // Hourly added value per technical employee (KRW)
    workEfficiencyReductionHours: number; // Work efficiency reduction hours
    normalDailyFabPowerConsumptionMWh: number; // Normal daily factory power consumption (MWh)
    powerConsumptionIncreaseRate: number; // Power consumption increase rate during heatwaves (%)
    electricityUnitPrice: number; // Electricity unit price (KRW/kWh)
    outdoorEmployeeCount: number; // Number of outdoor workers
    outdoorSupplyCostPerPerson: number; // Heatwave preparation supply cost per person (KRW)
    discardedWaferCount?: number; // Number of discarded wafers (units)
    waferAverageSellingPrice?: number; // Average selling price per wafer (KRW)
    hourlyWaferProcessingCapacity?: number; // Hourly wafer processing capacity (units)
    // Other factors: process yield reduction, equipment investment and insurance, etc. (to be considered)
  };
  heatwaveDaysIncrease: number; // Heatwave days increase (value to be linked from climate-service)
  scenario: 'SSP1-2.6' | 'SSP5-8.5'; // Scenario selection
}

export interface FinancialImpactResult {
  totalImpact: number; // Total potential financial impact (KRW)
  details: {
    category: string; // e.g., 'Revenue Loss', 'Additional Power Costs', etc.
    amount: number; // Financial impact amount for this category
    formula?: string; // Applied formula (for display)
    explanation?: string; // Explanation and rationale (refer to PDF content)
  }[];
  // Additional fields for scenario comparison can be added
} 