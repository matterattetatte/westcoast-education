var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_BASE = 'http://localhost:3000';
const baseUrl = API_BASE;
function request(endpoint_1) {
    return __awaiter(this, arguments, void 0, function* (endpoint, options = {}) {
        const url = `${baseUrl}/${endpoint}`;
        const response = yield fetch(url, Object.assign({ headers: Object.assign({ 'Content-Type': 'application/json' }, options.headers) }, options));
        if (!response.ok)
            throw new Error(`HTTP ${response.status}`);
        return response.json();
    });
}
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
                        const result = yield request(table, {
                            method: 'POST',
                            body: JSON.stringify(data)
                        });
                        return { data: result };
                    });
                }
            }),
            update: (data) => ({
                eq: (field, value) => __awaiter(this, void 0, void 0, function* () {
                    const records = yield request(`${table}?${field}=${value}`);
                    if (records.length === 0)
                        return { data: [] };
                    const response = yield request(`${table}/${records[0].id}`, {
                        method: 'PATCH',
                        body: JSON.stringify(data)
                    });
                    return { data: [response] };
                })
            }),
            delete: () => ({
                eq: (field, value) => __awaiter(this, void 0, void 0, function* () {
                    const records = yield request(`${table}?${field}=${value}`);
                    if (records.length > 0) {
                        yield request(`${table}/${records[0].id}`, { method: 'DELETE' });
                    }
                    return { data: null };
                })
            })
        };
    }
}
export const client = new JsonServerClient();
