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
    LOADING_START,
    DONE_UPLOADING,
    START_UPLOADING
} from './flightTypes';

const initialState = {
    loading: false,
    error: {},
    expire_at: {},
    tripNumber: "",
    filesNames: [],
    pdfFiles: [],
    passengers: [],
    flight: {},
    tripDate: "",
    doneUpload: false
}

export default function flightReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case START_UPLOADING:
            return {
                ...state,
                startUpload: true
            }
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
                loading: false,
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
                loading: false,
                error: {},
                expire_at: {},
                tripNumber: "",
                filesNames: [],
                pdfFiles: [],
                passengers: [],
                flight: {},
                tripDate: "",
                doneUpload: false
            };
        case DONE_UPLOADING:
            return {
                ...state,
                loading: false,
                doneUpload: true
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