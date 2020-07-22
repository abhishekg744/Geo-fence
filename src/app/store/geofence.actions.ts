import { Action } from '@ngrx/store'
import { AddGeofenceComponent } from '../geofence-management/add-geofence/add-geofence.component';


export const Add_GeofenceName = 'AddGeofenceName';
export const Delete_GeofenceName = 'DeleteGeofenceName';

export class AddGeofenceName implements Action {
    readonly type = Add_GeofenceName;
    constructor(public payload) {}
}

export class DeleteGeofenceName implements Action {
    readonly type = Delete_GeofenceName;
    constructor(public payload) {}
}

export type Actions = AddGeofenceComponent | DeleteGeofenceName;