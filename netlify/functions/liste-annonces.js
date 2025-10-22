// netlify/functions/list-annonces.js
const fs = require("fs");
const path = require("path");

exports.handler = async () => {
  const filePath = path.join("/tmp", "annonces.json");

  if (!fs.existsSync(filePath)) {
    return {
      statusCode: 200,
      body: JSON.stringify([]), // aucune annonce pour l'instant
    };
  }

  const annonces = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const valides = annonces.filter((a) => a.valide);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(valides),
  };
};