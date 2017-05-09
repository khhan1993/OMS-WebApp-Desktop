const SIGN_IN = "SIGN_IN";
const SIGN_OUT = "SIGN_OUT";
const SELECT_GROUP = "SELECT_GROUP";

function signIn(jwt) {
  localStorage.setItem("jwt", jwt);

  return {"type": SIGN_IN, "jwt": jwt}
}

function signOut() {
  localStorage.removeItem("jwt");
  localStorage.removeItem("group_id");
  localStorage.removeItem("role");
  localStorage.removeItem("signup_code");

  return {"type": SIGN_OUT}
}

function selectGroup(group_id, role, signup_code) {
  if(signup_code === null) {
    signup_code = "";
  }

  localStorage.setItem("group_id", group_id);
  localStorage.setItem("role", role);
  localStorage.setItem("signup_code", signup_code);

  return {"type": SELECT_GROUP, "group_id": group_id, "role": role, "signup_code": signup_code}
}

export {
  SIGN_IN,
  SIGN_OUT,
  SELECT_GROUP,
  signIn,
  signOut,
  selectGroup
}