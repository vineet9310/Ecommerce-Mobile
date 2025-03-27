const initialState = {
    loading: false,
    products: [],
    error: null,
};

export const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case "PRODUCTS_REQUEST":
            return { ...state, loading: true };
        case "PRODUCTS_SUCCESS":
            return { loading: false, products: action.payload, error: null };
        case "PRODUCTS_FAIL":
            return { loading: false, error: action.payload, products: [] };
        default:
            return state;
    }
};
