// src/utils/validators.js

// Fonction utilitaire pour vérifier la longueur
const maxLength = (value, max) => value && value.length > max ? `Ne doit pas dépasser ${max} caractères.` : null;
const required = (value) => !value ? "Ce champ est obligatoire." : null;
const emailFormat = (value) => {
    if (!value) return null;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !re.test(value) ? "Format d'email invalide." : null;
};

// Règles de validation basées sur le schéma DB
// Nous retournons un objet contenant les erreurs pour chaque champ
export const validateEnseignant = (data) => {
    const errors = {};

    // NOM VARCHAR2(50) NOT NULL
    if (required(data.nom)) errors.nom = required(data.nom);
    else if (maxLength(data.nom, 50)) errors.nom = maxLength(data.nom, 50);

    // PRENOM VARCHAR2(50) NOT NULL
    if (required(data.prenom)) errors.prenom = required(data.prenom);
    else if (maxLength(data.prenom, 50)) errors.prenom = maxLength(data.prenom, 50);

    // TYPE VARCHAR2(10) NOT NULL
    if (required(data.type)) errors.type = required(data.type);
    else if (maxLength(data.type, 10)) errors.type = maxLength(data.type, 10);

    // SEXE VARCHAR2(1) NOT NULL
    if (required(data.sexe)) errors.sexe = required(data.sexe);
    else if (maxLength(data.sexe, 1)) errors.sexe = maxLength(data.sexe, 1);

    // ADRESSE VARCHAR2(255) NOT NULL
    // Note: Dans le code Vue, 'adresse' n'est pas marqué required dans le HTML, 
    // mais le schéma DB dit NOT NULL. Je vais suivre le schéma DB pour la "business logic".
    if (required(data.adresse)) errors.adresse = required(data.adresse);
    else if (maxLength(data.adresse, 255)) errors.adresse = maxLength(data.adresse, 255);

    // CP VARCHAR2(10) NOT NULL
    if (required(data.cp)) errors.cp = required(data.cp);
    else if (maxLength(data.cp, 10)) errors.cp = maxLength(data.cp, 10);

    // VILLE VARCHAR2(255) NOT NULL
    if (required(data.ville)) errors.ville = required(data.ville);
    else if (maxLength(data.ville, 255)) errors.ville = maxLength(data.ville, 255);

    // PAYS VARCHAR2(255) NOT NULL
    if (required(data.pays)) errors.pays = required(data.pays);
    else if (maxLength(data.pays, 255)) errors.pays = maxLength(data.pays, 255);

    // ENC_PERSO_EMAIL VARCHAR2(255)
    // Note: Le code Vue semble l'utiliser comme clé étrangère ou identifiant important.
    if (maxLength(data.encPersoEmail, 255)) errors.encPersoEmail = maxLength(data.encPersoEmail, 255);
    if (emailFormat(data.encPersoEmail)) errors.encPersoEmail = emailFormat(data.encPersoEmail);

    // TEL_PORT VARCHAR2(20)
    if (maxLength(data.telPort, 20)) errors.telPort = maxLength(data.telPort, 20);

    return errors;
};

export const validateEtudiant = (data) => {
    const errors = {};

    // NO_ETUDIANT_NAT VARCHAR2(50) NOT NULL
    if (required(data.noEtudiantNat)) errors.noEtudiantNat = required(data.noEtudiantNat);
    else if (maxLength(data.noEtudiantNat, 50)) errors.noEtudiantNat = maxLength(data.noEtudiantNat, 50);

    // ANNEE_PRO VARCHAR2(10) NOT NULL
    if (required(data.anneePro)) errors.anneePro = required(data.anneePro);
    else if (maxLength(data.anneePro, 10)) errors.anneePro = maxLength(data.anneePro, 10);

    // NOM VARCHAR2(50) NOT NULL
    if (required(data.nom)) errors.nom = required(data.nom);
    else if (maxLength(data.nom, 50)) errors.nom = maxLength(data.nom, 50);

    // PRENOM VARCHAR2(50) NOT NULL
    if (required(data.prenom)) errors.prenom = required(data.prenom);
    else if (maxLength(data.prenom, 50)) errors.prenom = maxLength(data.prenom, 50);

    // SEXE VARCHAR2(1) NOT NULL
    if (required(data.sexe)) errors.sexe = required(data.sexe);
    else if (maxLength(data.sexe, 1)) errors.sexe = maxLength(data.sexe, 1);

    // DATE_NAISSANCE DATE NOT NULL
    if (required(data.dateNaissance)) errors.dateNaissance = required(data.dateNaissance);

    // LIEU_NAISSANCE VARCHAR2(255) NOT NULL
    if (required(data.lieuNaissance)) errors.lieuNaissance = required(data.lieuNaissance);
    else if (maxLength(data.lieuNaissance, 255)) errors.lieuNaissance = maxLength(data.lieuNaissance, 255);

    // SITUATION VARCHAR2(3) NOT NULL
    if (required(data.situation)) errors.situation = required(data.situation);
    else if (maxLength(data.situation, 3)) errors.situation = maxLength(data.situation, 3);

    // NATIONALITE VARCHAR2(50) NOT NULL
    if (required(data.nationalite)) errors.nationalite = required(data.nationalite);
    else if (maxLength(data.nationalite, 50)) errors.nationalite = maxLength(data.nationalite, 50);

    // EMAIL VARCHAR2(255)
    if (maxLength(data.email, 255)) errors.email = maxLength(data.email, 255);
    if (emailFormat(data.email)) errors.email = emailFormat(data.email);

    // PERM_ADRESSE VARCHAR2(255) NOT NULL
    if (required(data.permAdresse)) errors.permAdresse = required(data.permAdresse);
    else if (maxLength(data.permAdresse, 255)) errors.permAdresse = maxLength(data.permAdresse, 255);

    // PERM_CP VARCHAR2(10) NOT NULL
    if (required(data.permCp)) errors.permCp = required(data.permCp);
    else if (maxLength(data.permCp, 10)) errors.permCp = maxLength(data.permCp, 10);

    // PERM_VILLE VARCHAR2(255) NOT NULL
    if (required(data.permVille)) errors.permVille = required(data.permVille);
    else if (maxLength(data.permVille, 255)) errors.permVille = maxLength(data.permVille, 255);

    // PERM_PAYS VARCHAR2(255) NOT NULL
    if (required(data.permPays)) errors.permPays = required(data.permPays);
    else if (maxLength(data.permPays, 255)) errors.permPays = maxLength(data.permPays, 255);

    // DERNIER_DIPLOME VARCHAR2(255) NOT NULL
    if (required(data.dernierDiplome)) errors.dernierDiplome = required(data.dernierDiplome);
    else if (maxLength(data.dernierDiplome, 255)) errors.dernierDiplome = maxLength(data.dernierDiplome, 255);

    // UNIVERSITE VARCHAR2(255) NOT NULL
    if (required(data.universite)) errors.universite = required(data.universite);
    else if (maxLength(data.universite, 255)) errors.universite = maxLength(data.universite, 255);

    // SIGLE_ETU VARCHAR2(3) NOT NULL
    if (required(data.sigleEtu)) errors.sigleEtu = required(data.sigleEtu);
    else if (maxLength(data.sigleEtu, 3)) errors.sigleEtu = maxLength(data.sigleEtu, 3);
    
    // COMPTE_CRI VARCHAR2(10) NOT NULL
    if (required(data.compteCri)) errors.compteCri = required(data.compteCri);
    else if (maxLength(data.compteCri, 10)) errors.compteCri = maxLength(data.compteCri, 10);

    return errors;
};

export const validateFormation = (data) => {
    const errors = {};

    // CODE_FORMATION VARCHAR2(8) NOT NULL
    if (required(data.codeFormation)) errors.codeFormation = required(data.codeFormation);
    else if (maxLength(data.codeFormation, 8)) errors.codeFormation = maxLength(data.codeFormation, 8);

    // NOM_FORMATION VARCHAR2(64) NOT NULL
    if (required(data.nomFormation)) errors.nomFormation = required(data.nomFormation);
    else if (maxLength(data.nomFormation, 64)) errors.nomFormation = maxLength(data.nomFormation, 64);

    // DIPLOME VARCHAR2(3) NOT NULL
    if (required(data.diplome)) errors.diplome = required(data.diplome);
    else if (maxLength(data.diplome, 3)) errors.diplome = maxLength(data.diplome, 3);

    // DOUBLE_DIPLOME CHAR(1) NOT NULL
    if (required(data.doubleDiplome)) errors.doubleDiplome = required(data.doubleDiplome);
    else if (maxLength(data.doubleDiplome, 1)) errors.doubleDiplome = maxLength(data.doubleDiplome, 1);

    return errors;
};

export const validatePromotion = (data) => {
    const errors = {};

    // ANNEE_PRO VARCHAR2(10) NOT NULL
    if (required(data.anneePro)) errors.anneePro = required(data.anneePro);
    else if (maxLength(data.anneePro, 10)) errors.anneePro = maxLength(data.anneePro, 10);

    // SIGLE_PRO VARCHAR2(5) NOT NULL
    if (required(data.siglePro)) errors.siglePro = required(data.siglePro);
    else if (maxLength(data.siglePro, 5)) errors.siglePro = maxLength(data.siglePro, 5);

    // NB_ETU_SOUHAITE NUMBER(3) NOT NULL
    if (required(data.nbEtuSouhaite)) errors.nbEtuSouhaite = required(data.nbEtuSouhaite);
    // Number validation is slightly different but assuming converted to string for length or just value check
    // If it's number type in JS, maxLength on string repr works, or range check.
    // NUMBER(3) means -999 to 999.
    else if (String(data.nbEtuSouhaite).length > 3) errors.nbEtuSouhaite = "Maximum 3 chiffres.";

    // ETAT_PRESELECTION VARCHAR2(3) NOT NULL
    if (required(data.etatPreselection)) errors.etatPreselection = required(data.etatPreselection);
    else if (maxLength(data.etatPreselection, 3)) errors.etatPreselection = maxLength(data.etatPreselection, 3);

    // LIEU_RENTREE VARCHAR2(255)
    if (maxLength(data.lieuRentree, 255)) errors.lieuRentree = maxLength(data.lieuRentree, 255);

    return errors;
};
