exports.capitalize = text =>
  text
    .toLowerCase()
    .split(" ")
    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");

exports.token = "R0dGTXdVcng3Nk9DRk5DdlRrWWNNdz09";

exports.site = "http://localhost:3000";
