import csv from 'csvtojson'

export const studentGrade = async (path: string) => {

    const data = csv().fromFile(path)
    
    return data
}