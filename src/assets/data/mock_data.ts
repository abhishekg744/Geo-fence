
export let fenceNames = ['fence1', 'fence2'];

export let geoPlace = {
    geometry: { location: '' },
    address_components: [{ types: ['data'], long_name: '' }]
};

export let confirmCoordsData = [{lat:()=>'',lng:()=>''}];

export let latLng = "12.954612386058743,77.638535;12.954421568269561,77.63922432771683;12.953770695532927,77.63901511541367;12.953922304595407,77.63839552513123;"
export let mapBoxLatLng = "77.63858714934412,12.954675760848616;77.63921966283107,12.954550194885982;77.63900882500275,12.953768259968001;77.63839973794074,12.953899533885362;77.63858714934412,12.954675760848616;";
export let dataRow = {name:'name', coords:"12.954612386058743,77.638535;12.954421568269561,77.63922432771683;12.953770695532927,77.63901511541367;12.953922304595407,77.63839552513123;", placeName:'placeName'};
export let dataRowMapBox = {name:'name', coords:"77.63858714934412,12.954675760848616;77.63921966283107,12.954550194885982;77.63900882500275,12.953768259968001;77.63839973794074,12.953899533885362;77.63858714934412,12.954675760848616;", placeName:'placeName'};

class Autocomplete {
    /**
     *
     */
    constructor(data: any) {


    }
    bindTo(bounds, map) {

    }
    setFields(fields) {

    }

    addListener(data, func) {

    }

    getPlace() {

    }
}

export const setupGoogleMock = () => {
    /*** Mock Google Maps JavaScript API ***/
    const google: any = {
        maps: {
            places: {
                Autocomplete: Autocomplete,
                AutocompleteService: () => { },
                PlacesServiceStatus: {
                    INVALID_REQUEST: 'INVALID_REQUEST',
                    NOT_FOUND: 'NOT_FOUND',
                    OK: 'OK',
                    OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
                    REQUEST_DENIED: 'REQUEST_DENIED',
                    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
                    ZERO_RESULTS: 'ZERO_RESULTS',
                },
            },
            Geocoder: () => { },
            GeocoderStatus: {
                ERROR: 'ERROR',
                INVALID_REQUEST: 'INVALID_REQUEST',
                OK: 'OK',
                OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
                REQUEST_DENIED: 'REQUEST_DENIED',
                UNKNOWN_ERROR: 'UNKNOWN_ERROR',
                ZERO_RESULTS: 'ZERO_RESULTS',
            },
            ControlPosition: {
                'TOP_RIGHT': 0,
            },
        },
    };
    global.window.google = google;
};

export const getMapBoxMock = () => {
    return {
        setCenter : (data: any) => {

        },
        fitBounds: (data1: any, data2: any) => {

        },
        addSource: (id: any, data: any) => {

        },
        addLayer: (data: any) => {

        },
        getZoom: () => {

        },
        resize: () => {
            
        }
    };
}