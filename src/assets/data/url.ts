import { environment } from 'src/environments/environment';

let base = environment.serverUrl;
let componentIdentifier = sessionStorage.component;

export let URL =  {
    getGeofenceByName : base + componentIdentifier + 'geoCords/',
    getAllGeoFenceNames: base + componentIdentifier + 'geoCords/name',
    addGeofenceData: base + componentIdentifier + 'addGeoCord',
    updateGeofenceData: base + componentIdentifier + 'geoCords/',
    deleteGeofenceData: base + componentIdentifier + 'geoCords/'
};