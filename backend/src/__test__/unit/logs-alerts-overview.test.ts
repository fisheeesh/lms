import express, { NextFunction, Request, Response } from "express";
import request from "supertest";
import { startOfDay, endOfDay, subDays } from "date-fns";
import { beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";

import { getUserById } from "../../services/auth-services";
import { checkUserIfNotExist } from "../../utils/check";
import { getLogsAlertsOverviewFor60days } from "../../services/log-services";
import { getLogsAndAlertsOverview } from "../../controllers/user/user-controller";

jest.mock("../../services/auth-services", () => ({
    getUserById: jest.fn(),
}));
jest.mock("../../services/log-services", () => ({
    getLogsAlertsOverviewFor60days: jest.fn(),
}));
jest.mock("../../utils/check", () => ({
    checkUserIfNotExist: jest.fn(),
}));

const mGetUserById = getUserById as jest.MockedFunction<typeof getUserById>;
const mGetOverview = getLogsAlertsOverviewFor60days as jest.MockedFunction<
    typeof getLogsAlertsOverviewFor60days
>;
const mCheckUser = checkUserIfNotExist as jest.MockedFunction<
    typeof checkUserIfNotExist
>;

describe("GET /api/v1/user/logs-alerts-overview", () => {
    const FIXED_NOW = new Date("2025-09-15T10:00:00.000Z");

    let app: express.Express;

    beforeAll(() => {
        jest.useFakeTimers().setSystemTime(FIXED_NOW);
    });

    beforeEach(() => {
        jest.clearAllMocks();

        app = express();

        app.use(
            (req: Request & { userId?: string }, _res, next: NextFunction) => {
                req.userId = "user-1";
                next();
            }
        );

        app.get("/api/v1/user/logs-alerts-overview", ...getLogsAndAlertsOverview);

        app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
            res.status(err.status || 500).json({ message: err.message || "Error" });
        });
    });

    it("200 → returns overview using the user's tenant when no tenant query is provided", async () => {
        mGetUserById.mockResolvedValue({
            id: "user-1",
            tenant: "tenantA",
            role: "VIEWER",
        } as any);
        mCheckUser.mockReturnValue(undefined as any);

        const fakeResults = [
            { date: "2025-08-18", logs: 10, alerts: 1 },
            { date: "2025-08-19", logs: 12, alerts: 0 },
        ];
        mGetOverview.mockResolvedValue(fakeResults as any);

        const expectedStart = startOfDay(subDays(FIXED_NOW, 59));
        const expectedEnd = endOfDay(FIXED_NOW);

        const res = await request(app).get("/api/v1/user/logs-alerts-overview");

        expect(res.status).toBe(200);
        expect(res.body?.data).toEqual(fakeResults);

        expect(mGetOverview).toHaveBeenCalledTimes(1);
        const call = mGetOverview.mock.calls[0];
        expect(call[0]).toBeUndefined();
        expect(call[1]).toBe("tenantA");
        expect(call[2]).toBe("VIEWER");
        expect(call[3]).toEqual(expectedStart);
        expect(call[4]).toEqual(expectedEnd);
    });

    it("200 → allows admin to override tenant via query (?tenant=tenantB)", async () => {
        mGetUserById.mockResolvedValue({
            id: "user-1",
            tenant: "tenantA",
            role: "ADMIN",
        } as any);
        mCheckUser.mockReturnValue(undefined as any);

        const fakeResults = [{ date: "2025-08-25", logs: 7, alerts: 2 }];
        mGetOverview.mockResolvedValue(fakeResults as any);

        const expectedStart = startOfDay(subDays(FIXED_NOW, 59));
        const expectedEnd = endOfDay(FIXED_NOW);

        const res = await request(app).get(
            "/api/v1/user/logs-alerts-overview?tenant=tenantB"
        );

        expect(res.status).toBe(200);
        expect(res.body?.data).toEqual(fakeResults);

        expect(mGetOverview).toHaveBeenCalledTimes(1);
        const call = mGetOverview.mock.calls[0];
        expect(call[0]).toBe("tenantB");
        expect(call[1]).toBe("tenantA");
        expect(call[2]).toBe("ADMIN");
        expect(call[3]).toEqual(expectedStart);
        expect(call[4]).toEqual(expectedEnd);
    });

    it("404 → returns error if user does not exist (checkUserIfNotExist throws)", async () => {
        mGetUserById.mockResolvedValue(null as any);

        mCheckUser.mockImplementation(() => {
            const err: any = new Error("User not found");
            err.status = 404;
            throw err;
        });

        const res = await request(app).get("/api/v1/user/logs-alerts-overview");

        expect(res.status).toBe(404);
        expect(res.body?.message).toMatch(/user not found/i);

        expect(mGetOverview).not.toHaveBeenCalled();
    });
});