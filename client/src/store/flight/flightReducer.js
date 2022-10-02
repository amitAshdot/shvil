import {
    GET_FLIGHTS,
    GET_FLIGHT,
    ADD_FLIGHT,
    DELETE_FLIGHT,
    FLIGHT_ERROR,
    CLEAR_FLIGHT
} from './flightTypes';

const initialState = {
    loading: false,
    error: {},
    expire_at: {},
    tripNumber: "MAKXOEQQZ",
    filesNames: ["efrxvb_1", "efrxvb_2", "efrxvb_4", "efrxvb_3"],
    passengers: [
        {
            no: 0,
            pdfName: "efaaaaaaaaarxvb_1",
            name: "teesta test",
            status: 0,
            haveRelated: false,
            related: -1
        },
        {
            no: 1,
            pdfName: "efaaaaaaaaarxvb_2",
            name: "izik moshe",
            status: 0,
            haveRelated: false,
            related: -1
        },
        {
            no: 2,
            pdfName: "efaaaaaaaaarxvb_3",
            name: "moshe choen",
            status: 0,
            haveRelated: false,
            related: -1
        }
    ],
    tripDate: "2022-12-12"
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
        case ADD_FLIGHT:
            return {
                ...state,
                flights: [payload, ...state.flights],
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
        default:
            return state;
    }
}