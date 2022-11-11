import * as crypto from 'crypto'

export const hashId = async(id: string) => {
    const result = crypto.createHash('sha1').update(id).digest().toString('hex')

    return await result
}

// export const refList = async (parent: any, _: any, {req, res}: any) => {
//     const list = []
    
//     for(let i = 0; i<parent.refList.length; i++) {
//         const listNode = await List.findById(parent.refList[i])
//         if(listNode?.cut === 'true'){
//             let newCredit = parent.credit
//             const cat = await Cat.findById(parent.id) as any
//             if(cat?.refList?.length>1){
//                 const newList = new List({
//                     name: listNode.name,
//                     credit: listNode.credit,
//                     keep_over_credit: listNode.keep_over_credit,
//                     courses: listNode.courses,
//                     reRef: listNode.reRef,
//                     type: listNode.type
//                 })
//                 list.push(newList)
//             }else{
//                 const newList = new List({
//                     name: listNode.name,
//                     credit: newCredit,
//                     keep_over_credit: listNode.keep_over_credit,
//                     courses: listNode.courses,
//                     reRef: listNode.reRef,
//                     type: listNode.type
//                 })
//                 list.push(newList)
//             }
            
//             // for(let j=0; j<cat?.refList?.length; j++){
//             //     const sib = await List.findById(cat.refList[j])
//             //     if(!(sib?.id === listNode.id)){
//             //         newCredit = newCredit-(sib as any)?.credit
//             //     }
//             // }
//         } else {
//             list.push(listNode)
//         }
//     }
//     // console.log(list)
//     return list
// }

// export const courses = async (parent: any, _: any, {req, res}: any) => {
    
//     const courses = []
//     let realCourse = [] 
//     // const id: string = '610610578'
//     // const path: string = `src/grade/${id}.csv`
//     // const grade = await studentGrade(path)

//     const user = await User.findById(req.userId)
//     const uQuestion = await Question.findById(user?.question)

//     const encode_id = await hashId((user as any)?.sid)
//     const grade = await sGrade.find({ STUDENT_ID: encode_id })

//     const info = await Info.findOne({ student_id: user?.sid })
//     const cur = await Cur.findOne({ mid: info?.major_id, curId: info?.curriculum_id })
    
//     let newCredit: number = 0

//     if(parent.reRef.length < 2) {
        
//         const parent_node = await Cat.findById(parent.reRef[0])
//         console.log("1", parent_node)
        
//         if(parent_node?.root === 'GE') {

//             const listCourse = []
//             // push listCourse in array
//             // check sGrade and listCourse
//             // check different and add status

//             for(let c = 0; c<parent.courses.length; c++){
//                 const course = await Course.findById(parent.courses[c])
//                 const curCourse = await Course2.findOne({ COURSENO: course?.COURSENO, cur: cur?.name })
//                 if(!curCourse){
//                     const newCurCourse = new Course2({
//                         COURSENO: course?.COURSENO,
//                         name: course?.name,
//                         credit: course?.credit,
//                         cur: cur?.name
//                     })
//                     await newCurCourse.save()
//                 }
//                 await listCourse.push(course)
//             }

//             const dCourse = differenceBy(listCourse, grade, 'COURSENO')

//             for(let i = 0; i<listCourse.length; i++) {
//                 let upGrade: number
//                 // Check grade + course
//                 for(let j = 0; j<grade.length; j++) {
//                     if(grade[j].COURSENO === listCourse[i]?.COURSENO){
//                             if(grade[j].GRADE === 'W') {
//                                 const cc = await Course.findOne({ COURSENO: grade[j].COURSENO })
//                                 await dCourse.push(cc)
//                             }else if(grade[j].GRADE === 'F' ){
//                                 const cc = await Course.findOne({ COURSENO: grade[j].COURSENO })
//                                 await dCourse.push(cc)
//                                 await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                             }else if(grade[j].GRADE === '') { 
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'inprocess'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                             }else if(grade[j].GRADE === 'P') { 
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'inprocess'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                             } else if(grade[j].GRADE === 'S') {
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'completed'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                                 await user?.updateOne({ $inc: {ge_credit: listCourse[i]?.credit }})
//                                 newCredit = newCredit + Number(listCourse[i]?.credit)
//                             }else {
                                
//                                 if(newCredit < parent.credit){

//                                     if(grade[j].GRADE === 'A'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 4)
//                                         // console.log('A')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'B+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                         // console.log('B+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'B'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 3)
//                                         // console.log('B')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'C+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                         // console.log('C+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'C'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 2)
//                                         // console.log('C')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'D+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                         // console.log('D+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'D'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 1)
//                                         // console.log('D')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     }
//                                     const cc = new Grade({
//                                         COURSENO: grade[j].COURSENO,
//                                         name: listCourse[i]?.name,
//                                         grade: grade[j].GRADE,
//                                         credit: listCourse[i]?.credit,
//                                         status: 'completed'
//                                     })
//                                     await user?.updateOne({ $inc: {ge_credit: listCourse[i]?.credit}})
//                                     await cc.save()
//                                     await user?.userCourse.push(cc.id)
//                                     await user?.save()
//                                     await courses.push(cc)
//                                     await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit}})
//                                     newCredit = newCredit + Number(listCourse[i]?.credit)
//                                 } else {

//                                     if(parent.keep_over_credit === false){
                                        
//                                         if(grade[j].GRADE === 'A'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 4)
//                                             // console.log('A')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                             // console.log('B+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3)
//                                             // console.log('B')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                             // console.log('C+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2)
//                                             // console.log('C')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                             // console.log('D+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1)
//                                             // console.log('D')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         }
//                                         const cc = new Kick({
//                                             COURSENO: grade[j].COURSENO,
//                                             name: listCourse[i]?.name,
//                                             grade: grade[j].GRADE,
//                                             credit: listCourse[i]?.credit,
//                                             status: 'completed'
//                                         })
//                                         await cc.save()
//                                         await user?.kickCourse.push(cc.id)
//                                         await user?.updateOne({ $inc: {fe_credit: listCourse[i]?.credit }})
//                                         await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                                         await user?.save()
//                                     } else {
//                                         if(grade[j].GRADE === 'A'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 4)
//                                             // console.log('A')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                             // console.log('B+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3)
//                                             // console.log('B')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                             // console.log('C+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2)
//                                             // console.log('C')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                             // console.log('D+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1)
//                                             // console.log('D')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         }
//                                         const cc = new Grade({
//                                             COURSENO: grade[j].COURSENO,
//                                             name: listCourse[i]?.name,
//                                             grade: grade[j].GRADE,
//                                             credit: listCourse[i]?.credit,
//                                             status: 'completed'
//                                         })
//                                         await user?.updateOne({ $inc: {ge_credit: listCourse[i]?.credit }})
//                                         await cc.save()
//                                         await user?.userCourse.push(cc.id)
//                                         await user?.save()
//                                         await courses.push(cc)
//                                         await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                                         newCredit = newCredit + Number(listCourse[i]?.credit)
//                                     }
//                                 }
                                
//                             }
//                         }
//                     }
//                 }
            
//             for(let i=0; i<dCourse.length; i++){
//                 const sC = await sCourse.findOne({ courseno: dCourse[i]?.COURSENO })
//                 const sG = await sGrade.findOne({ STUDENT_ID: encode_id, COURSENO: dCourse[i]?.COURSENO})
//                 const cc = new Grade({
//                     COURSENO: dCourse[i]?.COURSENO,
//                     name: sC?.title_long_en,
//                     grade: sG?.GRADE,
//                     credit: Number((sC as any)?.crelec) + Number((sC as any)?.crelab),
//                     status: 'pending'
//                 })
//                 await courses.push(cc)
//             }

//             realCourse = uniqBy(courses, 'COURSENO')

//         } else {         
            
//             const listCourse = []

//             for(let c = 0; c<parent.courses.length; c++){
//                 const course = await Course.findById(parent.courses[c])
//                 const curCourse = await Course2.findOne({ COURSENO: course?.COURSENO, cur: cur?.name })
//                 if(!curCourse){
//                     const newCurCourse = new Course2({
//                         COURSENO: course?.COURSENO,
//                         name: course?.name,
//                         credit: course?.credit,
//                         cur: cur?.name
//                     })
//                     await newCurCourse.save()
//                 }
//                 await listCourse.push(course)
//             }

//             const dCourse = differenceBy(listCourse, grade, 'COURSENO')

//             for(let i = 0; i<listCourse.length; i++) {
//                 let upGrade: number
//                 // Check grade + course
//                 for(let j = 0; j<grade.length; j++) {
//                     if(grade[j].COURSENO === listCourse[i]?.COURSENO) {
//                             if(grade[j].GRADE === 'W'){
//                                 const cc = await Course.findOne({ COURSENO: grade[j].COURSENO })
//                                 await dCourse.push(cc)
//                             } else if(grade[j].GRADE === 'F' ) {
//                                 const cc = await Course.findOne({ COURSENO: grade[j].COURSENO })
//                                 await dCourse.push(cc)
//                                 await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                             }else if(grade[j].GRADE === '') { 
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'inprocess'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                             }else if(grade[j].GRADE === 'P') { 
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'inprocess'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                             }else if(grade[j].GRADE === 'S') {
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'completed'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                                 await user?.updateOne({ $inc: {fs_credit: listCourse[i]?.credit }})
//                                 newCredit = newCredit + Number(listCourse[i]?.credit)
//                             }else {
                                
//                                 if(newCredit < parent.credit){

//                                     if(grade[j].GRADE === 'A'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 4)
//                                         // console.log('A')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'B+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                         // console.log('B+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'B'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 3)
//                                         // console.log('B')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'C+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                         // console.log('C+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'C'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 2)
//                                         // console.log('C')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'D+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                         // console.log('D+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'D'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 1)
//                                         // console.log('D')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     }
//                                     const cc = new Grade({
//                                         COURSENO: grade[j].COURSENO,
//                                         name: listCourse[i]?.name,
//                                         grade: grade[j].GRADE,
//                                         credit: listCourse[i]?.credit,
//                                         status: 'completed'
//                                     })
//                                     await user?.updateOne({ $inc: {fs_credit: listCourse[i]?.credit}})
//                                     await cc.save()
//                                     await user?.userCourse.push(cc.id)
//                                     await user?.save()
//                                     await courses.push(cc)
//                                     await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit}})
//                                     newCredit = newCredit + Number(listCourse[i]?.credit)
//                                 } else {

//                                     if(parent.keep_over_credit === false){
                                        
//                                         if(grade[j].GRADE === 'A'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 4)
//                                             // console.log('A')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                             // console.log('B+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3)
//                                             // console.log('B')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                             // console.log('C+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2)
//                                             // console.log('C')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                             // console.log('D+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1)
//                                             // console.log('D')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         }
//                                         const cc = new Kick({
//                                             COURSENO: grade[j].COURSENO,
//                                             name: listCourse[i]?.name,
//                                             grade: grade[j].GRADE,
//                                             credit: listCourse[i]?.credit,
//                                             status: 'completed'
//                                         })
//                                         await cc.save()
//                                         await user?.kickCourse.push(cc.id)
//                                         await user?.updateOne({ $inc: {fe_credit: listCourse[i]?.credit }})
//                                         await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                                         await user?.save()
//                                     } else {
//                                         if(grade[j].GRADE === 'A'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 4)
//                                             // console.log('A')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                             // console.log('B+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3)
//                                             // console.log('B')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                             // console.log('C+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2)
//                                             // console.log('C')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                             // console.log('D+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1)
//                                             // console.log('D')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         }
//                                         const cc = new Grade({
//                                             COURSENO: grade[j].COURSENO,
//                                             name: listCourse[i]?.name,
//                                             grade: grade[j].GRADE,
//                                             credit: listCourse[i]?.credit,
//                                             status: 'completed'
//                                         })
//                                         await user?.updateOne({ $inc: {fs_credit: listCourse[i]?.credit }})
//                                         await cc.save()
//                                         await user?.userCourse.push(cc.id)
//                                         await user?.save()
//                                         await courses.push(cc)
//                                         await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                                         newCredit = newCredit + Number(listCourse[i]?.credit)
//                                     }
//                                 }
                                
//                             }
//                     }
//                 }
//             }
        
//             for(let i=0; i<dCourse.length; i++){
//                 const sC = await sCourse.findOne({ courseno:dCourse[i]?.COURSENO })
//                 const sG = await sGrade.findOne({ STUDENT_ID: encode_id, COURSENO: dCourse[i]?.COURSENO})
//                 const cc = new Grade({
//                     COURSENO: dCourse[i]?.COURSENO,
//                     name: sC?.title_long_en,
//                     grade: sG?.GRADE,
//                     credit: Number((sC as any)?.crelec) + Number((sC as any)?.crelab),
//                     status: 'pending'
//                 })
//                 await courses.push(cc)
//             }

//             realCourse = uniqBy(courses, 'COURSENO')
            
//         }
//     } else {
//         let parent_id: any

//         for(let i=0; i<parent.reRef.length; i++) {
//             const node = await Cat.findById(parent.reRef[i])
//             const nFilter = await Filter.findById(node?.filter)
            
//             if(nFilter?.activation === uQuestion?.answer){
//                 parent_id = node?.id
//             }
//         }

//         const parent_node = await Cat.findById(parent_id)
//         console.log("2", parent_node)

//         if(parent_node?.root === 'GE') {

//             const listCourse = []

//             for(let c = 0; c<parent.courses.length; c++){
//                 const course = await Course.findById(parent.courses[c])
//                 const curCourse = await Course2.findOne({ COURSENO: course?.COURSENO, cur: cur?.name })
//                 if(!curCourse){
//                     const newCurCourse = new Course2({
//                         COURSENO: course?.COURSENO,
//                         name: course?.name,
//                         credit: course?.credit,
//                         cur: cur?.name
//                     })
//                     await newCurCourse.save()
//                 }
//                 await listCourse.push(course)
//             }
    
//             const dCourse = differenceBy(listCourse, grade, 'COURSENO')

//             for(let i = 0; i<listCourse.length; i++) {
//                 let upGrade: number
//                 // Check grade + course
//                 for(let j = 0; j<grade.length; j++) {
//                     if(grade[j].COURSENO === listCourse[i]?.COURSENO){
//                             if(grade[j].GRADE === 'W') {
//                                 const cc = await Course.findOne({ COURSENO: grade[j].COURSENO })
//                                 await dCourse.push(cc)
//                             }
//                             if(grade[j].GRADE === 'F' ) {
//                                 const cc = await Course.findOne({ COURSENO: grade[j].COURSENO })
//                                 await dCourse.push(cc)
//                                 await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                             }else if(grade[j].GRADE === '') { 
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'inprocess'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                             }else if(grade[j].GRADE === 'P') { 
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'inprocess'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                             }else if(grade[j].GRADE === 'S') {
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'completed'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                                 await user?.updateOne({ $inc: {ge_credit: listCourse[i]?.credit }})
//                                 newCredit = newCredit + Number(listCourse[i]?.credit)
//                             }else {
                                
//                                 if(newCredit < parent.credit){

//                                     if(grade[j].GRADE === 'A'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 4)
//                                         // console.log('A')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'B+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                         // console.log('B+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'B'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 3)
//                                         // console.log('B')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'C+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                         // console.log('C+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'C'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 2)
//                                         // console.log('C')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'D+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                         // console.log('D+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'D'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 1)
//                                         // console.log('D')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     }
//                                     const cc = new Grade({
//                                         COURSENO: grade[j].COURSENO,
//                                         name: listCourse[i]?.name,
//                                         grade: grade[j].GRADE,
//                                         credit: listCourse[i]?.credit,
//                                         status: 'completed'
//                                     })
//                                     await user?.updateOne({ $inc: {ge_credit: listCourse[i]?.credit}})
//                                     await cc.save()
//                                     await user?.userCourse.push(cc.id)
//                                     await user?.save()
//                                     await courses.push(cc)
//                                     await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit}})
//                                     newCredit = newCredit + Number(listCourse[i]?.credit)
//                                 } else {

//                                     if(parent.keep_over_credit === false){
                                        
//                                         if(grade[j].GRADE === 'A'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 4)
//                                             // console.log('A')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                             // console.log('B+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3)
//                                             // console.log('B')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                             // console.log('C+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2)
//                                             // console.log('C')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                             // console.log('D+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1)
//                                             // console.log('D')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         }
//                                         const cc = new Kick({
//                                             COURSENO: grade[j].COURSENO,
//                                             name: listCourse[i]?.name,
//                                             grade: grade[j].GRADE,
//                                             credit: listCourse[i]?.credit,
//                                             status: 'completed'
//                                         })
//                                         await cc.save()
//                                         await user?.kickCourse.push(cc.id)
//                                         await user?.updateOne({ $inc: {fe_credit: listCourse[i]?.credit }})
//                                         await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                                         await user?.save()
//                                     } else {
//                                         if(grade[j].GRADE === 'A'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 4)
//                                             // console.log('A')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                             // console.log('B+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3)
//                                             // console.log('B')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                             // console.log('C+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2)
//                                             // console.log('C')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                             // console.log('D+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1)
//                                             // console.log('D')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         }
//                                         const cc = new Grade({
//                                             COURSENO: grade[j].COURSENO,
//                                             name: listCourse[i]?.name,
//                                             grade: grade[j].GRADE,
//                                             credit: listCourse[i]?.credit,
//                                             status: 'completed'
//                                         })
//                                         await user?.updateOne({ $inc: {ge_credit: listCourse[i]?.credit }})
//                                         await cc.save()
//                                         await user?.userCourse.push(cc.id)
//                                         await user?.save()
//                                         await courses.push(cc)
//                                         await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                                         newCredit = newCredit + Number(listCourse[i]?.credit)
//                                     }
//                                 }
                                
//                             }
//                     }
//                 }
//             }
            
//             for(let i=0; i<dCourse.length; i++){
//                 const sC = await sCourse.findOne({ courseno: dCourse[i]?.COURSENO })
//                 const sG = await sGrade.findOne({ STUDENT_ID: encode_id, COURSENO: dCourse[i]?.COURSENO})
//                 const cc = new Grade({
//                     COURSENO: dCourse[i]?.COURSENO,
//                     name: sC?.title_long_en,
//                     grade: sG?.GRADE,
//                     credit: Number((sC as any)?.crelec) + Number((sC as any)?.crelab),
//                     status: 'pending'
//                 })
//                 await courses.push(cc)
//             }

//             realCourse = uniqBy(courses, 'COURSENO')

//         } else {
            
//             const listCourse = []

//             for(let c = 0; c<parent.courses.length; c++){
//                 const course = await Course.findById(parent.courses[c])
//                 const curCourse = await Course2.findOne({ COURSENO: course?.COURSENO, cur: cur?.name })
//                 if(!curCourse){
//                     const newCurCourse = new Course2({
//                         COURSENO: course?.COURSENO,
//                         name: course?.name,
//                         credit: course?.credit,
//                         cur: cur?.name
//                     })
//                     await newCurCourse.save()
//                 }
//                 await listCourse.push(course)
//             }

//             const dCourse = differenceBy(listCourse, grade, 'COURSENO')

//             for(let i = 0; i<listCourse.length; i++) {
//                 let upGrade: number
//                 // Check grade + course
//                 for(let j = 0; j<grade.length; j++) {
//                     if(grade[j].COURSENO === listCourse[i]?.COURSENO) {
//                             if(grade[j].GRADE === 'W') {
//                                 const cc = await Course.findOne({ COURSENO: grade[j].COURSENO })
//                                 await dCourse.push(cc)
//                             }else if(grade[j].GRADE === 'F' ) {
//                                 const cc = await Course.findOne({ COURSENO: grade[j].COURSENO })
//                                 await dCourse.push(cc)
//                                 await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                             }else if(grade[j].GRADE === '') { 
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'inprocess'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                             }else if(grade[j].GRADE === 'P') { 
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'inprocess'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                             }else if(grade[j].GRADE === 'S') {
//                                 const cc = new Grade({
//                                     COURSENO: grade[j].COURSENO,
//                                     name: listCourse[i]?.name,
//                                     grade: grade[j].GRADE,
//                                     credit: listCourse[i]?.credit,
//                                     status: 'completed'
//                                 })
//                                 await cc.save()
//                                 await user?.userCourse.push(cc.id)
//                                 await user?.save()
//                                 await courses.push(cc)
//                                 await user?.updateOne({ $inc: {fs_credit: listCourse[i]?.credit }})
//                                 newCredit = newCredit + Number(listCourse[i]?.credit)
//                             }else {
                                
//                                 if(newCredit < parent.credit){

//                                     if(grade[j].GRADE === 'A'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 4)
//                                         // console.log('A')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'B+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                         // console.log('B+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'B'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 3)
//                                         // console.log('B')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'C+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                         // console.log('C+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'C'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 2)
//                                         // console.log('C')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'D+'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                         // console.log('D+')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     } else if(grade[j].GRADE === 'D'){
//                                         upGrade = (Number(listCourse[i]?.credit) * 1)
//                                         // console.log('D')
//                                         // console.log(course?.name)
//                                         // console.log(upGrade)
//                                         await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                     }
//                                     const cc = new Grade({
//                                         COURSENO: grade[j].COURSENO,
//                                         name: listCourse[i]?.name,
//                                         grade: grade[j].GRADE,
//                                         credit: listCourse[i]?.credit,
//                                         status: 'completed'
//                                     })
//                                     await user?.updateOne({ $inc: {fs_credit: listCourse[i]?.credit}})
//                                     await cc.save()
//                                     await user?.userCourse.push(cc.id)
//                                     await user?.save()
//                                     await courses.push(cc)
//                                     await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit}})
//                                     newCredit = newCredit + Number(listCourse[i]?.credit)
//                                 } else {

//                                     if(parent.keep_over_credit === false){
                                        
//                                         if(grade[j].GRADE === 'A'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 4)
//                                             // console.log('A')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                             // console.log('B+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3)
//                                             // console.log('B')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                             // console.log('C+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2)
//                                             // console.log('C')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                             // console.log('D+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1)
//                                             // console.log('D')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         }
//                                         const cc = new Kick({
//                                             COURSENO: grade[j].COURSENO,
//                                             name: listCourse[i]?.name,
//                                             grade: grade[j].GRADE,
//                                             credit: listCourse[i]?.credit,
//                                             status: 'completed'
//                                         })
//                                         await cc.save()
//                                         await user?.kickCourse.push(cc.id)
//                                         await user?.updateOne({ $inc: {fe_credit: listCourse[i]?.credit }})
//                                         await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                                         await user?.save()
//                                     } else {
//                                         if(grade[j].GRADE === 'A'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 4)
//                                             // console.log('A')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3.5)
//                                             // console.log('B+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'B'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 3)
//                                             // console.log('B')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2.5)
//                                             // console.log('C+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'C'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 2)
//                                             // console.log('C')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D+'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1.5)
//                                             // console.log('D+')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         } else if(grade[j].GRADE === 'D'){
//                                             upGrade = (Number(listCourse[i]?.credit) * 1)
//                                             // console.log('D')
//                                             // console.log(course?.name)
//                                             // console.log(upGrade)
//                                             await user?.updateOne({ $inc: {upgrade: upGrade }})
//                                         }
//                                         const cc = new Grade({
//                                             COURSENO: grade[j].COURSENO,
//                                             name: listCourse[i]?.name,
//                                             grade: grade[j].GRADE,
//                                             credit: listCourse[i]?.credit,
//                                             status: 'completed'
//                                         })
//                                         await user?.updateOne({ $inc: {fs_credit: listCourse[i]?.credit }})
//                                         await cc.save()
//                                         await user?.userCourse.push(cc.id)
//                                         await user?.save()
//                                         await courses.push(cc)
//                                         await user?.updateOne({ $inc: {downgrade: listCourse[i]?.credit }})
//                                         newCredit = newCredit + Number(listCourse[i]?.credit)
//                                     }
//                                 }
                                
//                             }
//                     }
//                 }
//             }

//             for(let i=0; i<dCourse.length; i++){
//                 const sC = await sCourse.findOne({ courseno: dCourse[i]?.COURSENO })
//                 const sG = await sGrade.findOne({ STUDENT_ID: encode_id, COURSENO: dCourse[i]?.COURSENO})
//                 const cc = new Grade({
//                     COURSENO: dCourse[i]?.COURSENO,
//                     name: sC?.title_long_en,
//                     grade: sG?.GRADE,
//                     credit: Number((sC as any)?.crelec) + Number((sC as any)?.crelab),
//                     status: 'pending'
//                 })
//                 await courses.push(cc)
//             }

//             realCourse = uniqBy(courses, 'COURSENO')
         
//         }
//     }

//     return realCourse
// }