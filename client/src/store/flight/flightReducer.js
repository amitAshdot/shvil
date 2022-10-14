import {
    GET_FLIGHTS,
    GET_FLIGHT,
    ADD_FLIGHT,
    EDIT_FLIGHT,
    DELETE_FLIGHT,
    FLIGHT_ERROR,
    CLEAR_FLIGHT,
    ADD_FILES,
    GET_PDF_NAMES,
    LOADING_START
} from './flightTypes';

const initialState = {
    loading: false,
    error: {},
    expire_at: {},
    tripNumber: "",
    filesNames: [],
    pdfFiles: [],
    passengers: [
        {
            no: 0,
            pdfName: "",
            name: "",
            status: 0,
            haveRelated: false,
            related: -1
        },
        {
            no: 1,
            pdfName: "",
            name: "",
            status: 0,
            haveRelated: false,
            related: -1
        },
        {
            no: 2,
            pdfName: "",
            name: "moshe choen",
            status: 0,
            haveRelated: false,
            related: -1
        }
    ],
    flight: {},
    tripDate: ""
}

export default function flightReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_FLIGHTS:
            return {
                ...state,
                flights: payload,
                loading: false
            };
        case GET_FLIGHT:
            return {
                ...state,
                ...payload,
                loading: false
            };
        case ADD_FILES:
            let newPdfFiles = [...new Set([...state.pdfFiles, ...payload.pdfFiles])];
            let newFileNames = [...state.filesNames, ...payload.filesNames];
            return {
                ...state,
                pdfFiles: newPdfFiles,
                filesNames: newFileNames,
                loading: false
            };

        case ADD_FLIGHT:
            return {
                ...state,
                ...payload,
                loading: false
            };

        case EDIT_FLIGHT:
            return {
                ...state,
                ...payload,
                loading: false
            };

        case DELETE_FLIGHT:
            return {
                ...state,
                flights: state.flights.filter(flight => flight._id !== payload),
                loading: false
            };
        case FLIGHT_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        case CLEAR_FLIGHT:
            return {
                ...state,
                flight: null,
                loading: false
            };
        case GET_PDF_NAMES:
            return {
                ...state,
                userDetails: payload,
                loading: false
            };

        case LOADING_START:
            return {
                ...state,
                loading: true
            };

        default:
            return state;
    }
}