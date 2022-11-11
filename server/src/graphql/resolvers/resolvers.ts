import { IResolvers } from "@graphql-tools/utils";
import { allCourse, createCourse, deleteCourse, updateCourse, coursebyId } from "../../services/course.service";
import { allQuestion, createQuestion, question, questionbyId, updateQuestion } from "../../services/question.service";
import { allFilter, createFilter, filterbyId } from "../../services/filter.service";
import mongoose from "mongoose";
import Course from '../../model/Course.model'
import { ICourse } from "../../types/types";
import { allList, courses, createList, listbyId, filterList, reRef, newCredit, isSuccess, updateList, pushList, cloneList, addByCouse } from "../../services/list.service";
import { allCat, catbyId, createCat, filterCat, refCat,  refCourse,  refList, updateCat } from "../../services/cat.service";
import { ucatbyID, urefCat, urefList } from '../../services/cat2.service'
import { allUser, userbyId } from "../../services/user.service";
import { data, fe, gpa, grad, login, me, regiseterUser, root, setField, testMe } from "../../controller/user.controller";
import { alist, reRef2 } from "../../services/list2.service";
import { cFa, fa, fas, major, uFa } from "../../services/faculty.service";
import { cMa, curriculum, ma, mas, uMa } from "../../services/major.service";
import { aCur, acurCat, acurFe, aCurs, cAcu, uAcu } from "../../services/curriculum1.service";
import { cUcu, uCur, uCurs, uUcu, ucurCat } from "../../services/curriculum2.service";
import { fList } from '../../services/fCat.service'
import { fCourse, fNewcredit, fSuccess } from "../../services/fList.service";
import { ad, aLogin, aRegister, gradeStatus, stu } from "../../controller/advisor.controller";

export const resolvers: IResolvers = {

    User: {
        question: question,
        data: data,
        // fe: fe,
        rootCredit: root,
        gpa: gpa,
        isGrad: grad,
        setField: setField
    },
    
    Advisor: {
        stu: stu
    },

    SInfo: {
        grade_status: gradeStatus
    },

    uCat: {
        refCat: refCat,
        refList: refList,
        refCourse: refCourse,
        filter: filterCat
    },
    
    fCat: {
        refList: fList
    },

    uList: {
        courses: courses,
        filter: filterList,
        reRef: reRef,
        newCredit: newCredit,
        status: isSuccess
    },

    fList: {
        courses: fCourse,
        newCredit: fNewcredit,
        status: fSuccess
    },

    aCat: {
        refCat: urefCat,
        refList: urefList
    },

    aList: {
        courses: alist,
        reRef: reRef2
    },

    uCurriculum: {
        cat: ucurCat,
        fe: fe
        // setField: setField
    },

    aCurriculum: {
        cat: acurCat,
        fe: acurFe
    },

    Faculty: {
        major: major
    },

    Major: {
        curriculum: curriculum
    },

    Query: {
        
        course: coursebyId,
        courses: allCourse,

        question: questionbyId,
        questions: allQuestion,

        filter: filterbyId,
        filters: allFilter,

        list: listbyId,
        lists: allList,

        aCat: ucatbyID,
        // aCats: allCat,

        uCat: catbyId,

        fa: fa,
        fas: fas,

        ma: ma,
        mas: mas,

        aCur: aCur,
        aCurs: aCurs,

        uCur: uCur,
        uCurs: uCurs,

        user: userbyId,
        users: allUser,

        me: me,
        testMe: testMe,

        advisor: ad
    },

    Mutation: {
        cCourse: createCourse,
        uCourse: updateCourse,
        dCourse: deleteCourse,

        cQuestion: createQuestion,
        uQuestion: updateQuestion,

        cFilter: createFilter,

        cList: createList,
        uList: updateList,
        pList: pushList,
        coneList: cloneList,
        addByCourse: addByCouse,

        cCat: createCat,
        uCat: updateCat,

        cFa: cFa,
        uFa: uFa,

        cMa: cMa,
        uMa: uMa,

        cAcu: cAcu,
        uAcu: uAcu,

        cUcu: cUcu,
        uUcu: uUcu,

        rUser: regiseterUser,
        login: login,

        aRegister: aRegister,
        aLogin: aLogin
    }
        
}
