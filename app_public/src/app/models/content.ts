
export class Content {
    _id:string;
    primaryTitle:string;
    description?:string;
    parentId?:string;
    parentTitle?:string;
    priority:number;
    isNav:boolean;
    subList:Content[];
    imgURL?:string;
}