import { action, makeObservable, observable } from "mobx";
import { IRootStore } from "./rootStore";
import { Alert, AlertColor } from '@mui/material';


interface AlertData{
    status: AlertColor,
    message: string,
    data?: any,
}

export default class AlertStore{
    isAlertOpen = false;
    alertData: AlertData | null = {status: 'success', message: 'This is a error', data: []};
    private confirm: any = null;
    private rootStore: IRootStore;

    constructor(rootStore: IRootStore){

        console.log("AlertStore");

        makeObservable(this,{
           isAlertOpen: observable,
           alertData: observable,
           open: action,
           close: action,
        })
        this.rootStore = rootStore;
    }
    open = (data: AlertData) =>{
        this.alertData = data,
        this.isAlertOpen = true
    }
    close = () =>{
        this.alertData = null,
        this.isAlertOpen = false
    }
   
}