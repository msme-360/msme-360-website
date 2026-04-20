import { describe, it, expect } from "vitest";
import { 
  getRoleById, 
  hasPermission, 
  getCareerLevelMetadata, 
  getLevelTitle,
  JOB_LEVELS
} from "./constants/roles";

describe("Roles Utility", () => {
  describe("getRoleById", () => {
    it("should return the correct role for a valid ID", () => {
      const role = getRoleById("ceo");
      expect(role.label).toBe("CEO");
      expect(role.level).toBe(1);
    });

    it("should return the default 'user' role for an invalid ID", () => {
      const role = getRoleById("non-existent");
      expect(role.id).toBe("user");
      expect(role.level).toBe(6);
    });
  });

  describe("hasPermission", () => {
    it("should return true if user level is lower (more privileged) than required", () => {
      // CEO (1) has permission for Manager level (3)
      expect(hasPermission("ceo", 3)).toBe(true);
    });

    it("should return true if user level is equal to required", () => {
      // Staff (4) has permission for level 4
      expect(hasPermission("staff", 4)).toBe(true);
    });

    it("should return false if user level is higher (less privileged) than required", () => {
      // User (6) does NOT have permission for Admin level (0)
      expect(hasPermission("user", 0)).toBe(false);
    });
  });

  describe("Job Architecture", () => {
    it("should return correct career level metadata", () => {
      const metadata = getCareerLevelMetadata("cto");
      expect(metadata?.level).toBe("L6");
      expect(metadata?.minYears).toBe(12);
    });

    it("should return null for roles without career levels", () => {
      const metadata = getCareerLevelMetadata("user");
      expect(metadata).toBeNull();
    });

    it("should return the correct level title", () => {
      expect(getLevelTitle("L5")).toBe(JOB_LEVELS.L5.title);
      expect(getLevelTitle("INVALID")).toBe("Member");
    });
  });
});
