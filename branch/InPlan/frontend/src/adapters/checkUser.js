import axios from "axios";

import { BACKEND_URL } from "./apiCalls";

function checkUser() {
  /* Check si le token est valide en l'envoyant au back et en écoutant la réponse */
  return axios({
    method: "get",
    url: `${BACKEND_URL}/api/1/users/current`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access-token")}`,
    },
  })
    .then((response) => {
      if (response.status === 200) return response;
      return false;
    })
    .catch(() => false);
}

export default checkUser;
