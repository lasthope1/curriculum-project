import {Inf_CatNode, Inf_CourseList, Inf_Course} from '../components/interfaces/Interfaces';

function instanceOfCat(unktNode: Inf_CatNode | Inf_CourseList | Inf_Course): unktNode is Inf_CatNode {
    return 'refList' in unktNode
}

function instanceOfCL(unktNode: Inf_CatNode | Inf_CourseList | Inf_Course): unktNode is Inf_CourseList {
    return 'courses' in unktNode
} 

export {instanceOfCat, instanceOfCL}