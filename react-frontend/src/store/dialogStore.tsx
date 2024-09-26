import { action, makeObservable, observable } from "mobx";
import { IRootStore } from "./rootStore";


export default class DialogStore{
    isDialogOpen = false;
    dialogText = 'Are you sure';
    private confirm: any = null;

    private rootStore: IRootStore;

    constructor(rootStore: IRootStore){

        console.log("DialogStore")
        makeObservable(this,{
           isDialogOpen: observable,
           openDialog: action,
           closeDialog: action,
           confirmAction: action
        })
        this.rootStore = rootStore;
    }
    openDialog = (data: any) =>{
        this.confirm = data.confirm;
        this.dialogText = data.dialogText;;
        this.isDialogOpen = true;
    }
    closeDialog = () =>{
        this.confirm = null;
        this.dialogText = "Are you sure";
        this.isDialogOpen = false;
    }
    confirmAction = () =>{

        if(this.confirm)  
            this.confirm();
            this.closeDialog();
    }

}