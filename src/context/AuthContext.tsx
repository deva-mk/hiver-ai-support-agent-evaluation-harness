import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole, UserProfile, PermissionAction, RoleRuleDefinition } from "../types.ts";

export const ROLE_RULES: RoleRuleDefinition[] = [
  {
    rule_id: "RULE-AMZN-FIN-01",
    title: "Monetary Concession & Courtesy Credit Governance",
    category: "FINANCIAL_COMPLIANCE",
    description: "Issuing automated promotional credits ($5.00) or concessions directly to customer balances requires Tier-2 Escalation Supervisor or ML Lead authorization. Tier-1 Agents and Guest Auditors are blocked by financial ledger controls.",
    allowed_roles: [UserRole.SUPERVISOR, UserRole.ML_ENGINEER],
    enforcement_action: "EXECUTE_CONCESSION"
  },
  {
    rule_id: "RULE-AMZN-EVAL-02",
    title: "Golden Benchmark Batch Execution & Model Invalidation",
    category: "EVALUATION_INTEGRITY",
    description: "Executing large-scale batch evaluations across the 200 Golden Evaluation samples consumes LLM-as-Judge quota and updates benchmark drift records. Reserved exclusively for ML & Evaluation Engineers.",
    allowed_roles: [UserRole.ML_ENGINEER],
    enforcement_action: "RUN_BATCH_BENCHMARK"
  },
  {
    rule_id: "RULE-AMZN-DATA-03",
    title: "Ground-Truth Dataset Exfiltration & Export Authorization",
    category: "SECURITY_PII",
    description: "Downloading raw ground-truth customer support data in JSON/CSV format is permitted for Supervisors, ML Engineers, and accredited Auditors. Tier-1 Agents must use the in-app viewer.",
    allowed_roles: [UserRole.SUPERVISOR, UserRole.ML_ENGINEER, UserRole.AUDITOR],
    enforcement_action: "EXPORT_DATASET"
  },
  {
    rule_id: "RULE-AMZN-POL-04",
    title: "Knowledge Base & RAG Policy Reconfiguration",
    category: "OPERATIONAL_SLA",
    description: "Modifying dynamic RAG thresholds, editing brand escalation rules, or triggering LoRA distillation builds requires ML Lead clearance.",
    allowed_roles: [UserRole.ML_ENGINEER],
    enforcement_action: "EDIT_BRAND_POLICY"
  },
  {
    rule_id: "RULE-AMZN-SANDBOX-05",
    title: "Live Interactive Inference & Pipeline Testing",
    category: "OPERATIONAL_SLA",
    description: "Submitting live customer tweets to the 3-stage pipeline is enabled for operational Tier-1 Agents, Supervisors, and ML Engineers. Unauthenticated Guests and Auditors have read-only view.",
    allowed_roles: [UserRole.TIER_1_AGENT, UserRole.SUPERVISOR, UserRole.ML_ENGINEER],
    enforcement_action: "TEST_SANDBOX"
  },
  {
    rule_id: "RULE-AMZN-GOV-06",
    title: "Escalation Override & Human Ticket Dispatch",
    category: "OPERATIONAL_SLA",
    description: "Overriding an AI routing decision from Auto-Handle to Human Escalation or dispatching CRM tickets to Hiver/Zendesk queues requires Supervisor or ML Engineer authorization.",
    allowed_roles: [UserRole.SUPERVISOR, UserRole.ML_ENGINEER],
    enforcement_action: "OVERRIDE_ESCALATION"
  },
  {
    rule_id: "RULE-AMZN-AUDIT-07",
    title: "Evaluation Report & Engineering Decision Log Audit",
    category: "EVALUATION_INTEGRITY",
    description: "Full read and audit access to the 6-Page Technical Report and 12 Decision Logs is available to all authenticated internal roles.",
    allowed_roles: [UserRole.TIER_1_AGENT, UserRole.SUPERVISOR, UserRole.ML_ENGINEER, UserRole.AUDITOR],
    enforcement_action: "VIEW_INTERNAL_DECISIONS"
  }
];

export const PRESET_USERS: Record<UserRole, UserProfile> = {
  [UserRole.ML_ENGINEER]: {
    id: "usr_mle_904",
    name: "Deva (Candidate)",
    email: "deva84862@gmail.com",
    role: UserRole.ML_ENGINEER,
    role_display: "ML & Evaluation Engineer (Lead)",
    department: "AI Safety & Machine Learning Ops",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    badge: "FULL ACCESS",
    session_started_at: new Date().toISOString()
  },
  [UserRole.SUPERVISOR]: {
    id: "usr_sup_412",
    name: "Marcus Vance",
    email: "m.vance@amazon-support.internal",
    role: UserRole.SUPERVISOR,
    role_display: "Tier-2 Escalation Supervisor",
    department: "Executive Escalations & Customer Care",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    badge: "SUPERVISOR",
    session_started_at: new Date().toISOString()
  },
  [UserRole.TIER_1_AGENT]: {
    id: "usr_agt_108",
    name: "Priya Sharma",
    email: "priya.s@amazon-support.internal",
    role: UserRole.TIER_1_AGENT,
    role_display: "Tier-1 Social Support Specialist",
    department: "@AmazonHelp Social Media Operations",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80",
    badge: "TIER-1 AGENT",
    session_started_at: new Date().toISOString()
  },
  [UserRole.AUDITOR]: {
    id: "usr_aud_550",
    name: "Dr. Catherine Hayes",
    email: "c.hayes@external-audit.org",
    role: UserRole.AUDITOR,
    role_display: "Independent Compliance Auditor",
    department: "Algorithmic Fairness & Governance Group",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80",
    badge: "AUDITOR (READ-ONLY)",
    session_started_at: new Date().toISOString()
  },
  [UserRole.GUEST]: {
    id: "usr_guest_000",
    name: "Guest Explorer",
    email: "guest@public.preview",
    role: UserRole.GUEST,
    role_display: "Unauthenticated Guest",
    department: "Public Review",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
    badge: "GUEST (RESTRICTED)",
    session_started_at: new Date().toISOString()
  }
};

interface AuthContextType {
  currentUser: UserProfile;
  isLoggedIn: boolean;
  loginAsRole: (role: UserRole) => void;
  loginWithCustomDetails: (name: string, email: string, role: UserRole) => void;
  logout: () => void;
  hasPermission: (action: PermissionAction) => { allowed: boolean; rule?: RoleRuleDefinition };
  checkAndEnforce: (action: PermissionAction, onAllowed: () => void) => void;
  ruleBlockedModal: { isOpen: boolean; rule: RoleRuleDefinition | null; attemptedAction: string | null };
  closeRuleBlockedModal: () => void;
  isRulesMatrixOpen: boolean;
  openRulesMatrix: () => void;
  closeRulesMatrix: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "amazonhelp_ai_active_user_role";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const savedRole = localStorage.getItem(AUTH_STORAGE_KEY) as UserRole;
      if (savedRole && PRESET_USERS[savedRole]) {
        return PRESET_USERS[savedRole];
      }
    } catch {
      // Fallback if localStorage is disabled
    }
    // Default to ML_ENGINEER so reviewers have full access right away
    return PRESET_USERS[UserRole.ML_ENGINEER];
  });

  const [ruleBlockedModal, setRuleBlockedModal] = useState<{
    isOpen: boolean;
    rule: RoleRuleDefinition | null;
    attemptedAction: string | null;
  }>({
    isOpen: false,
    rule: null,
    attemptedAction: null
  });

  const [isRulesMatrixOpen, setIsRulesMatrixOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, currentUser.role);
    } catch {
      // Ignored in sandboxed storage
    }
  }, [currentUser]);

  const isLoggedIn = currentUser.role !== UserRole.GUEST;

  const loginAsRole = (role: UserRole) => {
    const user = PRESET_USERS[role];
    setCurrentUser({
      ...user,
      session_started_at: new Date().toISOString()
    });
    setIsLoginModalOpen(false);
  };

  const loginWithCustomDetails = (name: string, email: string, role: UserRole) => {
    const base = PRESET_USERS[role];
    setCurrentUser({
      id: `usr_custom_${Date.now().toString(36)}`,
      name: name || base.name,
      email: email || base.email,
      role: role,
      role_display: base.role_display,
      department: base.department,
      avatar: base.avatar,
      badge: base.badge,
      session_started_at: new Date().toISOString()
    });
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(PRESET_USERS[UserRole.GUEST]);
  };

  const hasPermission = (action: PermissionAction): { allowed: boolean; rule?: RoleRuleDefinition } => {
    const matchingRule = ROLE_RULES.find((r) => r.enforcement_action === action);
    if (!matchingRule) {
      return { allowed: true };
    }
    const allowed = matchingRule.allowed_roles.includes(currentUser.role);
    return { allowed, rule: matchingRule };
  };

  const checkAndEnforce = (action: PermissionAction, onAllowed: () => void) => {
    const { allowed, rule } = hasPermission(action);
    if (allowed) {
      onAllowed();
    } else if (rule) {
      setRuleBlockedModal({
        isOpen: true,
        rule,
        attemptedAction: action
      });
    }
  };

  const closeRuleBlockedModal = () => {
    setRuleBlockedModal({ isOpen: false, rule: null, attemptedAction: null });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        loginAsRole,
        loginWithCustomDetails,
        logout,
        hasPermission,
        checkAndEnforce,
        ruleBlockedModal,
        closeRuleBlockedModal,
        isRulesMatrixOpen,
        openRulesMatrix: () => setIsRulesMatrixOpen(true),
        closeRulesMatrix: () => setIsRulesMatrixOpen(false),
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
