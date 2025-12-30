import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { organizations as orgsAPI, auth as authAPI } from "@/lib/api";
import { type Organization } from "@shared/schema";

interface OrganizationContextType {
  currentOrg: Organization | null;
  organizations: Organization[];
  loading: boolean;
  setCurrentOrg: (org: Organization) => void;
  refreshOrganizations: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | null>(null);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [currentOrg, setCurrentOrgState] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshOrganizations = async () => {
    try {
      const orgs = await orgsAPI.list();
      setOrganizations(orgs);
      
      const savedOrgId = localStorage.getItem("selectedOrgId");
      if (savedOrgId) {
        const savedOrg = orgs.find((o: Organization) => o.id === savedOrgId);
        if (savedOrg) {
          setCurrentOrgState(savedOrg);
        } else if (orgs.length > 0) {
          setCurrentOrgState(orgs[0]);
          localStorage.setItem("selectedOrgId", orgs[0].id);
        }
      } else if (orgs.length > 0) {
        setCurrentOrgState(orgs[0]);
        localStorage.setItem("selectedOrgId", orgs[0].id);
      }
    } catch (error) {
      console.error("Failed to load organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  const setCurrentOrg = (org: Organization) => {
    setCurrentOrgState(org);
    localStorage.setItem("selectedOrgId", org.id);
  };

  useEffect(() => {
    refreshOrganizations();
  }, []);

  return (
    <OrganizationContext.Provider value={{
      currentOrg,
      organizations,
      loading,
      setCurrentOrg,
      refreshOrganizations,
    }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useOrganization must be used within an OrganizationProvider");
  }
  return context;
}
