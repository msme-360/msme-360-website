/**
 * MSME 360 Role-Based Feature Flag System
 * Defines which tools and modules are available to each of the 41+ roles.
 */

export type FeatureFlag = 
  | 'rbac_control' 
  | 'system_logs' 
  | 'security_audit'
  | 'firm_valuation'
  | 'equity_management'
  | 'strategic_projects'
  | 'board_resolutions'
  | 'fiduciary_oversight'
  | 'market_intelligence'
  | 'tech_roadmap'
  | 'architecture_review'
  | 'financial_forecasting'
  | 'tax_compliance'
  | 'ops_efficiency'
  | 'supply_chain_health'
  | 'brand_equity'
  | 'growth_engine'
  | 'talent_strategy'
  | 'culture_board'
  | 'data_sovereignty'
  | 'cyber_threats'
  | 'team_velocity'
  | 'hiring_pipeline'
  | 'learning_roadmap';

export const ROLE_FEATURES: Record<string, FeatureFlag[]> = {
  // --- LEVEL 0: GOVERNANCE ---
  super_admin: ['rbac_control', 'system_logs', 'security_audit', 'data_sovereignty'],
  managing_partner: ['firm_valuation', 'equity_management', 'strategic_projects', 'financial_forecasting'],
  board_member: ['board_resolutions', 'fiduciary_oversight', 'market_intelligence', 'tax_compliance'],

  // --- LEVEL 1: EXECUTIVE ---
  ceo: ['market_intelligence', 'growth_engine', 'strategic_projects'],
  cto: ['tech_roadmap', 'architecture_review', 'cyber_threats'],
  cfo: ['financial_forecasting', 'tax_compliance', 'equity_management'],
  coo: ['ops_efficiency', 'supply_chain_health', 'ops_efficiency'],
  cmo: ['brand_equity', 'growth_engine', 'market_intelligence'],
  chro: ['talent_strategy', 'culture_board', 'hiring_pipeline'],
  cio: ['data_sovereignty', 'cyber_threats', 'system_logs'],

  // --- LEVEL 1.5: SENIOR MANAGEMENT ---
  vp_engineering: ['tech_roadmap', 'team_velocity'],
  vp_product: ['growth_engine', 'market_intelligence'],
  vp_operations: ['ops_efficiency', 'supply_chain_health'],
  vp_marketing: ['brand_equity', 'growth_engine'],
  vp_finance: ['financial_forecasting', 'tax_compliance'],

  // --- LEVEL 3: MANAGEMENT ---
  hr_manager: ['hiring_pipeline', 'culture_board'],
  engineering_manager: ['team_velocity', 'tech_roadmap'],
  
  // --- LEVEL 5: ASSOCIATE ---
  intern: ['learning_roadmap'],
  associate: ['learning_roadmap', 'team_velocity'],
};

export const hasFeature = (role: string, feature: FeatureFlag): boolean => {
  return ROLE_FEATURES[role]?.includes(feature) || false;
};

export const getRoleFeatures = (role: string): FeatureFlag[] => {
  return ROLE_FEATURES[role] || [];
};
