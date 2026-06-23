// ─── MCP Tool System ───────────────────────────────────────────────────────

interface UserDetails {
  userId: string;
  name: string;
  phone: string;
  email: string;
  accountType: 'Prepaid' | 'Postpaid';
  address: string;
  joinedDate: string;
  loyaltyPoints: number;
}

interface PlanInfo {
  planName: string;
  validity: string;
  dataPerDay: string;
  totalData: string;
  calls: string;
  sms: string;
  price: number;
  ottBenefits: string[];
  activeSince: string;
  nextRenewal: string;
}

interface DataUsage {
  totalData: string;
  usedData: string;
  remainingData: string;
  usedPercent: number;
  validTill: string;
  roaming: boolean;
  todayUsed: string;
  avgDailyUsage: string;
  speedStatus: 'full' | 'throttled';
}

interface BillInfo {
  currentBill: number;
  dueDate: string;
  lastPaid: number;
  lastPaidDate: string;
  autoPay: boolean;
  billCycle: string;
  unbilledCharges: number;
}

interface NetworkStatus {
  area: string;
  signalStrength: '4G' | '5G' | '3G' | '2G';
  outageReported: boolean;
  estimatedResolution: string | null;
  nearestStore: string;
  storeDistance: string;
}

interface RechargeHistory {
  date: string;
  amount: number;
  plan: string;
  status: 'success' | 'failed';
}

// ─── Mock Data ─────────────────────────────────────────────────────────────

const MOCK_USERS: Record<string, UserDetails> = {
  user_001: {
    userId: 'user_001',
    name: 'Rahul Sharma',
    phone: '+91-98765-43210',
    email: 'rahul.sharma@gmail.com',
    accountType: 'Postpaid',
    address: 'B-204, Sector 62, Noida, UP 201309',
    joinedDate: '2019-03-15',
    loyaltyPoints: 2340,
  },
  user_002: {
    userId: 'user_002',
    name: 'Priya Patel',
    phone: '+91-91234-56789',
    email: 'priya.patel@gmail.com',
    accountType: 'Prepaid',
    address: '12, MG Road, Bengaluru, KA 560001',
    joinedDate: '2021-07-22',
    loyaltyPoints: 870,
  },
};

const MOCK_PLANS: Record<string, PlanInfo> = {
  user_001: {
    planName: 'Airtel Postpaid Infinity 599',
    validity: '30 days',
    dataPerDay: '2.5 GB',
    totalData: '75 GB/month',
    calls: 'Unlimited India + 100 min ISD',
    sms: '100/day',
    price: 599,
    ottBenefits: ['Amazon Prime', 'Airtel Xstream Premium', 'Wynk Music'],
    activeSince: '2024-01-10',
    nextRenewal: '2025-08-10',
  },
  user_002: {
    planName: 'Airtel Prepaid 299',
    validity: '28 days',
    dataPerDay: '1.5 GB',
    totalData: '42 GB',
    calls: 'Unlimited',
    sms: '100/day',
    price: 299,
    ottBenefits: ['Airtel Xstream Basic'],
    activeSince: '2025-07-05',
    nextRenewal: '2025-08-02',
  },
};

const MOCK_USAGE: Record<string, DataUsage> = {
  user_001: {
    totalData: '75 GB',
    usedData: '52.3 GB',
    remainingData: '22.7 GB',
    usedPercent: 70,
    validTill: '2025-08-10',
    roaming: false,
    todayUsed: '1.8 GB',
    avgDailyUsage: '2.1 GB',
    speedStatus: 'full',
  },
  user_002: {
    totalData: '42 GB',
    usedData: '39.5 GB',
    remainingData: '2.5 GB',
    usedPercent: 94,
    validTill: '2025-08-02',
    roaming: false,
    todayUsed: '0.4 GB',
    avgDailyUsage: '1.4 GB',
    speedStatus: 'throttled',
  },
};

const MOCK_BILLS: Record<string, BillInfo> = {
  user_001: {
    currentBill: 649,
    dueDate: '2025-08-15',
    lastPaid: 599,
    lastPaidDate: '2025-07-14',
    autoPay: true,
    billCycle: '10th of every month',
    unbilledCharges: 50,
  },
};

const MOCK_NETWORK: Record<string, NetworkStatus> = {
  user_001: {
    area: 'Sector 62, Noida',
    signalStrength: '4G',
    outageReported: false,
    estimatedResolution: null,
    nearestStore: 'Airtel Store, Sector 18 Noida',
    storeDistance: '3.2 km',
  },
  user_002: {
    area: 'MG Road, Bengaluru',
    signalStrength: '5G',
    outageReported: false,
    estimatedResolution: null,
    nearestStore: 'Airtel Store, Brigade Road',
    storeDistance: '1.1 km',
  },
};

const MOCK_RECHARGE_HISTORY: Record<string, RechargeHistory[]> = {
  user_001: [
    { date: '2025-07-10', amount: 599, plan: 'Infinity 599', status: 'success' },
    { date: '2025-06-10', amount: 599, plan: 'Infinity 599', status: 'success' },
    { date: '2025-05-10', amount: 599, plan: 'Infinity 599', status: 'success' },
  ],
  user_002: [
    { date: '2025-07-05', amount: 299, plan: 'Prepaid 299', status: 'success' },
    { date: '2025-06-07', amount: 299, plan: 'Prepaid 299', status: 'success' },
    { date: '2025-05-10', amount: 199, plan: 'Prepaid 199', status: 'failed' },
  ],
};

// ─── Tool Registry ─────────────────────────────────────────────────────────

const TOOLS: Record<string, (args: Record<string, unknown>) => Promise<string>> = {
  get_user_details: async ({ user_id }) => {
    const u = MOCK_USERS[user_id as string] ?? MOCK_USERS['user_001'];
    return `Account: ${u.name}, ${u.accountType}, joined ${u.joinedDate}. Loyalty points: ${u.loyaltyPoints}. Address: ${u.address}.`;
  },

  get_plan_info: async ({ user_id }) => {
    const p = MOCK_PLANS[user_id as string] ?? MOCK_PLANS['user_001'];
    return `Plan: ${p.planName} at ₹${p.price}/month. Data: ${p.dataPerDay}/day (${p.totalData}). Calls: ${p.calls}. OTT: ${p.ottBenefits.join(', ')}. Renews: ${p.nextRenewal}.`;
  },

  get_data_usage: async ({ user_id }) => {
    const d = MOCK_USAGE[user_id as string] ?? MOCK_USAGE['user_001'];
    const warn = d.usedPercent >= 90 ? ' WARNING: Data almost exhausted!' : '';
    const throttle = d.speedStatus === 'throttled' ? ' Speed is currently throttled to 64kbps.' : '';
    return `Data used: ${d.usedData} of ${d.totalData} (${d.usedPercent}%). Remaining: ${d.remainingData}. Today: ${d.todayUsed}. Valid till: ${d.validTill}.${warn}${throttle}`;
  },

  get_bill_info: async ({ user_id }) => {
    const b = MOCK_BILLS[user_id as string] ?? MOCK_BILLS['user_001'];
    const autopay = b.autoPay ? 'AutoPay is ON.' : 'AutoPay is OFF — manual payment needed.';
    return `Current bill: ₹${b.currentBill}, due ${b.dueDate}. Last paid: ₹${b.lastPaid} on ${b.lastPaidDate}. ${autopay} Unbilled charges: ₹${b.unbilledCharges}.`;
  },

  get_network_status: async ({ user_id }) => {
    const n = MOCK_NETWORK[user_id as string] ?? MOCK_NETWORK['user_001'];
    const outage = n.outageReported ? ` Outage reported, ETA: ${n.estimatedResolution}.` : ' No outages reported.';
    return `Network in ${n.area}: ${n.signalStrength}.${outage} Nearest store: ${n.nearestStore} (${n.storeDistance}).`;
  },

  get_recharge_history: async ({ user_id }) => {
    const history = MOCK_RECHARGE_HISTORY[user_id as string] ?? MOCK_RECHARGE_HISTORY['user_001'];
    const lines = history.map(h => `${h.date}: ₹${h.amount} (${h.plan}) - ${h.status}`).join('; ');
    return `Last 3 recharges: ${lines}.`;
  },
};

export const mcpTools = {
  execute: async (toolName: string, args: Record<string, unknown>): Promise<string> => {
    const tool = TOOLS[toolName];
    if (!tool) return `Tool "${toolName}" not found.`;
    try {
      const start = Date.now();
      const result = await tool(args);
      console.log(`[mcp] ${toolName}(${JSON.stringify(args)}) → ${Date.now() - start}ms`);
      return result;
    } catch (e) {
      return `Tool error: ${String(e)}`;
    }
  },
  list: () => Object.keys(TOOLS),
};
