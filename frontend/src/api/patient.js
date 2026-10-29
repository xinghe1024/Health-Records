import http from './http'

export async function listPatients() {
    const response = await http.get('/patient')
    return response.data
}