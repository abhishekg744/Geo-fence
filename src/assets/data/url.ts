import { environment } from 'src/environments/environment';

let base = environment.serverUrl;
let componentIdentifier = sessionStorage.component;

export let URL =  {
    getGeofenceByName : base + 'maptype/'+componentIdentifier+'/name/',
    getAllGeoFenceNames: base + 'names/maptype/'+ componentIdentifier,
    addGeofenceData: base,
    updateGeofenceData: base + 'id/',
    deleteGeofenceData: base + 'id/',
};

