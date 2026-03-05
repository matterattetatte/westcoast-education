var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const API_BASE = 'http://localhost:3000';
function request(endpoint_1) {
    return __awaiter(this, arguments, void 0, function* (endpoint, options = {}) {
        const url = `${API_BASE}/${endpoint}`;
        const response = yield fetch(url, Object.assign({ headers: Object.assign({ 'Content-Type': 'application/json' }, options.headers) }, options));
        if (!response.ok)
            throw new Error(`HTTP ${response.status}`);
        return response.json();
    });
}
// supabase inspired client
export class JsonServerClient {
    from(table) {
        return {
            select: () => ({
                eq(field, value) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return request(`${table}?${field}=${value}`);
                    });
                },
                execute() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return request(table);
                    });
                }
            }),
            insert: (data) => ({
                select() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return request(table, {
                            method: 'POST',
                            body: JSON.stringify(data)
                        });
                    });
                }
            }),
            update: (data) => ({
                eq: (field, value) => __awaiter(this, void 0, void 0, function* () {
                    const records = yield request(`${table}?${field}=${value}`);
                    if (records.length === 0)
                        return [];
                    const response = yield request(`${table}/${records[0].id}`, {
                        method: 'PATCH',
                        body: JSON.stringify(data)
                    });
                    return [response];
                })
            }),
            delete: () => ({
                eq: (field, value) => __awaiter(this, void 0, void 0, function* () {
                    const records = yield request(`${table}?${field}=${value}`);
                    if (records.length > 0) {
                        yield request(`${table}/${records[0].id}`, { method: 'DELETE' });
                    }
                    return null;
                })
            })
        };
    }
}
export const client = new JsonServerClient();
