import { Database } from "./database.types.js"

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type CourseSessions = Database['public']['Tables']['course_sessions']['Row']
export type Enrollments = Database['public']['Tables']['enrollments']['Row']
export type Purchases = Database['public']['Tables']['purchases']['Row']
export type CourseQuestions = Database['public']['Tables']['course_questions']['Row']
export type CourseReviews = Database['public']['Tables']['course_reviews']['Row']
export type Subscriptions = Database['public']['Tables']['subscriptions']['Row']

type ExtractRow<T extends TableName> = Database['public']['Tables'][T]['Row']
type InsertRow<T extends TableName> = Database['public']['Tables'][T]['Insert']

const API_BASE = 'http://localhost:3000'

type TableName =
    | 'profiles' | 'courses' | 'course_sessions' | 'enrollments'
    | 'purchases' | 'course_questions' | 'course_reviews' | 'subscriptions'

const baseUrl: string = API_BASE


async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${baseUrl}/${endpoint}`
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.json()
}

export class JsonServerClient {
    from<T extends TableName>(table: T) {
        return {
            select: () => ({
                async eq(field: string, value: string | number) {
                    return request<ExtractRow<T>[]>(
                            `${table}?${field}=${value}`
                        )
                    },

                async execute(): Promise<ExtractRow<T>[]> {
                    return request<ExtractRow<T>[]>(table)
                }
            }),

            insert: (data: InsertRow<T> | InsertRow<T>[]) => ({
                async select(): Promise<{ data: ExtractRow<T>[] }> {
                    const result = await request(table, {
                        method: 'POST',
                        body: JSON.stringify(data)
                    })
                    return { data: result }
                }
            }),

            update: (data: Partial<ExtractRow<T>>) => ({
                eq: async (field: string, value: string | number): Promise<{ data: ExtractRow<T>[] }> => {
                    const records = await request<ExtractRow<T>[]>(`${table}?${field}=${value}`)
                    if (records.length === 0) return { data: [] }

                    const response = await request(`${table}/${records[0].id}`, {
                        method: 'PATCH',
                        body: JSON.stringify(data)
                    })
                    return { data: [response] }
                }
            }),

            delete: () => ({
                eq: async (field: string, value: string | number): Promise<{ data: null }> => {
                    const records = await request<ExtractRow<T>[]>(`${table}?${field}=${value}`)
                    if (records.length > 0) {
                        await request(`${table}/${records[0].id}`, { method: 'DELETE' })
                    }
                    return { data: null }
                }
            })
        }
    }
}


export const client = new JsonServerClient()
