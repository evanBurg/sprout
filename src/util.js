let {api} = require("./constants")

exports.capitalize = text => {
  return text
    .toLowerCase()
    .split(" ")
    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
  }

exports.getToken = async (origin) => {
  let jwt = await fetch(`${api}/token?origin=${origin}`);

  if (jwt.ok) {
    jwt = await jwt.json();
  } else {
    jwt = await jwt.text();
    console.error("There was an issue fetching the JWT token...");
    console.error(jwt);
  }
  return jwt;
};