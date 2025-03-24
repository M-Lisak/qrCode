export const getIdFromUrl = (url: string): string => {
    const splitUrl = url.split('/')
    return splitUrl[4]
}