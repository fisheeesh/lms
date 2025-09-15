import express, { NextFunction, Request, Response } from "express";
import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";

import { getUserById } from "../../services/auth-services";
import { checkUserIfNotExist } from "../../utils/check";
import { getLogsSeverityOverview } from "../../services/log-services";
import { getSeverityOverview } from "../../controllers/user/user-controller";

jest.mock("../../services/auth-services", () => ({
    getUserById: jest.fn(),
}));
jest.mock("../../services/log-services", () => ({
    getLogsSeverityOverview: jest.fn(),
}));
jest.mock("../../utils/check", () => ({
    checkUserIfNotExist: jest.fn(),
}));

const mGetUserById = getUserById as jest.MockedFunction<typeof getUserById>;
const mGetSeverityOverview = getLogsSeverityOverview as jest.MockedFunction<
    typeof getLogsSeverityOverview
>;
const mCheckUser = checkUserIfNotExist as jest.MockedFunction<typeof checkUserIfNotExist>;

describe("GET /api/v1/user/severity-overview", () => {
    let app: express.Express;

    beforeAll(() => {
        jest.useFakeTimers().setSystemTime(new Date("2025-09-15T10:00:00.000Z"));
    });

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();

        // Fake auth
        app.use((req: Request & { userId?: string }, _res, next: NextFunction) => {
            req.userId = "user-1";
            next();
        });

        // Route under test
        app.get("/api/v1/user/severity-overview", ...getSeverityOverview);

        // Error handler
        app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
            res.status(err.status || 500).json({ message: err.message || "Error" });
        });
    });

    it("200 → returns severity overview using the user's tenant when no tenant query is provided", async () => {
        mGetUserById.mockResolvedValue({ id: "user-1", tenant: "tenantA", role: "VIEWER" } as any);
        mCheckUser.mockReturnValue(undefined as any);

        const fakeResults = [
            { type: "info", value: 10 },
            { type: "error", value: 5 },
        ];
        mGetSeverityOverview.mockResolvedValue(fakeResults as any);

        const res = await request(app).get("/api/v1/user/severity-overview");

        expect(res.status).toBe(200);
        expect(res.body?.data).toEqual(fakeResults);

        expect(mGetSeverityOverview).toHaveBeenCalledTimes(1);
        const call = mGetSeverityOverview.mock.calls[0];
        expect(call[0]).toBeUndefined(); // no override
        expect(call[1]).toBe("tenantA");
        expect(call[2]).toBe("VIEWER");
    });

    it("200 → allows admin to override tenant via query (?tenant=tenantB)", async () => {
        mGetUserById.mockResolvedValue({ id: "user-1", tenant: "tenantA", role: "ADMIN" } as any);
        mCheckUser.mockReturnValue(undefined as any);

        const fakeResults = [{ type: "critical", value: 3 }];
        mGetSeverityOverview.mockResolvedValue(fakeResults as any);

        const res = await request(app).get("/api/v1/user/severity-overview?tenant=tenantB");

        expect(res.status).toBe(200);
        expect(res.body?.data).toEqual(fakeResults);

        expect(mGetSeverityOverview).toHaveBeenCalledTimes(1);
        const call = mGetSeverityOverview.mock.calls[0];
        expect(call[0]).toBe("tenantB");
        expect(call[1]).toBe("tenantA");
        expect(call[2]).toBe("ADMIN");
    });

    it("404 → returns error if user does not exist (checkUserIfNotExist throws)", async () => {
        mGetUserById.mockResolvedValue(null as any);
        mCheckUser.mockImplementation(() => {
            const err: any = new Error("User not found");
            err.status = 404;
            throw err;
        });

        const res = await request(app).get("/api/v1/user/severity-overview");

        expect(res.status).toBe(404);
        expect(res.body?.message).toMatch(/user not found/i);

        expect(mGetSeverityOverview).not.toHaveBeenCalled();
    });
});