// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DiplomaCertification is Ownable {
    struct Certificate {
        uint256 id;
        bytes32 pdfHash;
        string ipfsCid;
        uint256 issueDate;
        bool isValid;
        address issuer;
    }

    mapping(uint256 => Certificate) public certificates;

    event CertificateIssued(
        uint256 indexed id,
        bytes32 pdfHash,
        string ipfsCid,
        uint256 timestamp
    );
    event CertificateRevoked(uint256 indexed id);

    // Le constructeur initialise le propriétaire (Admin)
    constructor() Ownable(msg.sender) {}

    function issueCertificate(
        uint256 _id,
        bytes32 _pdfHash,
        string memory _ipfsCid
    ) public onlyOwner {
        require(certificates[_id].issueDate == 0, "Ce diplome existe deja");

        certificates[_id] = Certificate({
            id: _id,
            pdfHash: _pdfHash,
            ipfsCid: _ipfsCid,
            issueDate: block.timestamp,
            isValid: true,
            issuer: msg.sender
        });

        emit CertificateIssued(_id, _pdfHash, _ipfsCid, block.timestamp);
    }

    function verifyCertificate(
        uint256 _id
    ) public view returns (bytes32, string memory, uint256, bool, address) {
        Certificate memory cert = certificates[_id];
        require(cert.issueDate != 0, "Diplome introuvable");
        return (
            cert.pdfHash,
            cert.ipfsCid,
            cert.issueDate,
            cert.isValid,
            cert.issuer
        );
    }

    function revokeCertificate(uint256 _id) public onlyOwner {
        require(certificates[_id].issueDate != 0, "Diplome introuvable");
        require(certificates[_id].isValid == true, "Deja revoque");
        certificates[_id].isValid = false;
        emit CertificateRevoked(_id);
    }
}
