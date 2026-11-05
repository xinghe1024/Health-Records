export function mockResponse(data, delay = 300) {
    return new Promise(resolve => {
        setTimeout(() => resolve(structuredClone(data)), delay)
    })
}

export function mockError(status, detail, delay = 300){
    return new Promise((_, reject) => {
        setTimeout(() => reject({ response: { status, data: {detail} } }), delay)
    })
}