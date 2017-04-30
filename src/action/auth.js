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

  return {"type": SIGN_OUT}
}

function selectGroup(group_id, role) {
  localStorage.setItem("group_id", group_id);
  localStorage.setItem("role", role);

  return {"type": SELECT_GROUP, "group_id": group_id, "role": role}
}

export {
  SIGN_IN,
  SIGN_OUT,
  SELECT_GROUP,
  signIn,
  signOut,
  selectGroup
}