import axios from "axios";

export const fetchProducts = () => async (dispatch) => {
    try {
        dispatch({ type: "PRODUCTS_REQUEST" });

        const { data } = await axios.get("http://localhost:5000/api/products");

        dispatch({ type: "PRODUCTS_SUCCESS", payload: data });
    } catch (error) {
        dispatch({
            type: "PRODUCTS_FAIL",
            payload: error.response?.data?.message || error.message,
        });
    }
};
