import authAction from '../action/index';
const { SIGN_IN, SIGN_OUT, SELECT_GROUP } = authAction.auth;

const initialState = {
  "jwt": localStorage.getItem("jwt"),
  "group_id": (localStorage.getItem("group_id") !== null) ? parseInt(localStorage.getItem("group_id"), 10) : null,
  "role": (localStorage.getItem("role") !== null) ? parseInt(localStorage.getItem("role"), 10) : null,
  "api_url": "https://api.oms.khhan1993.com"
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        "jwt": action.jwt,
        "group_id": null,
        "role": null,
        "api_url": state.api_url
      };

    case SIGN_OUT:
      return {
        "jwt": null,
        "group_id": null,
        "role": null,
        "api_url": state.api_url
      };

    case SELECT_GROUP:
      return {
        "jwt": state.jwt,
        "group_id": action.group_id,
        "role": action.role,
        "api_url": state.api_url
      };

    default:
      return state;
  }
};

export {
  auth
}