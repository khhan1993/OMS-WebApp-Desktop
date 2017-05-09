import authAction from '../action/index';
const { SIGN_IN, SIGN_OUT, SELECT_GROUP } = authAction.auth;

const initialState = {
  "jwt": localStorage.getItem("jwt"),
  "group_id": (localStorage.getItem("group_id") !== null) ? parseInt(localStorage.getItem("group_id"), 10) : null,
  "role": (localStorage.getItem("role") !== null) ? parseInt(localStorage.getItem("role"), 10) : null,
  "signup_code": (localStorage.getItem("signup_code") !== null) ? localStorage.getItem("signup_code") : "",
  "api_url": "https://oms.lionlab.io"
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN:
      return Object.assign({}, state, {
        "jwt": action.jwt,
      });

    case SIGN_OUT:
      return Object.assign({}, state, {
        "jwt": null,
        "group_id": null,
        "signup_code": null,
        "role": null
      });

    case SELECT_GROUP:
      return Object.assign({}, state, {
        "group_id": action.group_id,
        "role": action.role,
        "signup_code": action.signup_code
      });

    default:
      return state;
  }
};

export {
  auth
}