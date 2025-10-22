// netlify/functions/verify-annonce.js
const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Méthode non autorisée" };
  }

  const { id } = JSON.parse(event.body);
  const filePath = path.join("/tmp", "annonces.json");

  if (!fs.existsSync(filePath)) {
    return { statusCode: 404, body: "Aucune annonce trouvée" };
  }

  const annonces = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const index = annonces.findIndex((a) => a.id === id);
  if (index === -1) {
    return { statusCode: 404, body: "Annonce introuvable" };
  }

  annonces[index].valide = true;
  fs.writeFileSync(filePath, JSON.stringify(annonces));

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Annonce validée", annonce: annonces[index] }),
  };
};