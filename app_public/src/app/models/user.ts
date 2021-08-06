import { Role } from "./role";

export class User {
    role:Role;
    _id:string;
    firstName:string;
    lastName:string;
    email:string;
    phone:string;
    age:number;
    unit:string;
    address:string;
    city:string;
    provinceOrState:string;
    country:string;
    createdAt:string;
    updatedAt:string;
    postalcodeOrZippCode:string;
    blogContent?:any[];
    token?: string;
}