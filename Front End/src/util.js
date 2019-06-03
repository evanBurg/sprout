export const token = "R0dGTXdVcng3Nk9DRk5DdlRrWWNNdz09";

export const api = "https://evenburgers.com:6969";

export const development = process.env.NODE_ENV === "development";

export const getToken = async origin => {
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

export const capitalize = text => {
  return text
    .toLowerCase()
    .split(" ")
    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
};

export const removeDuplicates = ( arr, prop ) => {
  let obj = {};
  for ( let i = 0, len = arr.length; i < len; i++ ){
    if(!obj[arr[i][prop]]) obj[arr[i][prop]] = arr[i];
  }
  let newArr = [];
  for ( let key in obj ) newArr.push(obj[key]);
  return newArr;
}

// eslint-disable-next-line
String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};