// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DiplomaCertification is Ownable {
    struct Diploma {
        string cne;
        string fullName;
        string major;
        uint256 graduationDate;
        uint256 issueDate;
        bytes32 pdfHash; // Empreinte numérique du PDF
        bool isValid; // <--- Pour gérer la révocation
    }

    mapping(string => Diploma) public diplomas;

    // Events pour tracer l'activité
    event DiplomaIssued(string indexed cne, bytes32 pdfHash, uint256 timestamp);
    event DiplomaRevoked(string indexed cne, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    // 1. ÉMISSION (Appelée par Java)
    function issueDiploma(
        string memory _cne,
        string memory _fullName,
        string memory _major,
        uint256 _graduationDate,
        bytes32 _pdfHash
    ) public onlyOwner {
        // On vérifie que ce CNE n'a pas déjà un diplôme ACTIF
        require(
            bytes(diplomas[_cne].cne).length == 0,
            "Ce diplome existe deja"
        );

        diplomas[_cne] = Diploma({
            cne: _cne,
            fullName: _fullName,
            major: _major,
            graduationDate: _graduationDate,
            issueDate: block.timestamp,
            pdfHash: _pdfHash,
            isValid: true // <--- Valide par défaut
        });

        emit DiplomaIssued(_cne, _pdfHash, block.timestamp);
    }

    // 2. RÉVOCATION (Pour annuler un diplôme en cas d'erreur/fraude)
    function revokeDiploma(string memory _cne) public onlyOwner {
        require(bytes(diplomas[_cne].cne).length != 0, "Diplome introuvable");
        require(diplomas[_cne].isValid == true, "Diplome deja revoque");

        diplomas[_cne].isValid = false; // On le marque comme invalide

        emit DiplomaRevoked(_cne, block.timestamp);
    }

    // 3. D'abord, déclare un nouvel événement (tout en haut avec les autres events)
    event DiplomaReactivated(string indexed cne, uint256 timestamp);

    // 4. Ajoute cette fonction pour REACTIVER
    function reactivateDiploma(string memory _cne) public onlyOwner {
        // Vérifie que le diplôme existe
        require(bytes(diplomas[_cne].cne).length != 0, "Diplome introuvable");

        // Vérifie qu'il est bien invalide actuellement (sinon ça sert à rien)
        require(diplomas[_cne].isValid == false, "Le diplome est deja valide");

        // L'action principale : on remet à TRUE
        diplomas[_cne].isValid = true;

        emit DiplomaReactivated(_cne, block.timestamp);
    }

    // 3. VÉRIFICATION (Utile pour le Frontend "Verify")
    // function verifyDiploma(
    //     string memory _cne
    // ) public view returns (Diploma memory) {
    //     require(bytes(diplomas[_cne].cne).length != 0, "Diplome introuvable");
    //     return diplomas[_cne];
    // }

    // Fonction helper pour vérifier juste la validité (bool)
    // function isDiplomaValid(string memory _cne) public view returns (bool) {
    //     if (bytes(diplomas[_cne].cne).length == 0) return false;
    //     return diplomas[_cne].isValid;
    // }

    function getDiplomaHash(
        string memory _cne
    ) public view returns (bytes32, bool) {
        // Si le diplôme n'existe pas, on renvoie un hash vide et false
        if (bytes(diplomas[_cne].cne).length == 0) {
            return (bytes32(0), false);
        }
        return (diplomas[_cne].pdfHash, diplomas[_cne].isValid);
    }
}
