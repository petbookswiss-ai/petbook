// netlify/functions/submission-created.js
const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const annonce = {
      id: Date.now(),
      titre: body["Titre"] || "Sans titre",
      type: body["Type d'annonce"] || "Inconnu",
      categorie: body["Catégorie"] || "",
      famille: body["Famille"] || "",
      localisation: body["Localisation"] || "",
      prix: body["Prix"] || "0",
      description: body["Description"] || "",
      photo: body["Photos"] || "",
      valide: false // ✅ par défaut, il faut valider avant d'afficher
    };

    const filePath = path.join("/tmp", "annonces.json");

    let annonces = [];
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      annonces = JSON.parse(data);
    }

    annonces.push(annonce);
    fs.writeFileSync(filePath, JSON.stringify(annonces));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Annonce enregistrée", annonce }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};