export function mockResponse(data, delay = 300) {
    return new Promise(resolve => {
        setTimeout(() => resolve(structuredClone(data)), delay)
    })
}