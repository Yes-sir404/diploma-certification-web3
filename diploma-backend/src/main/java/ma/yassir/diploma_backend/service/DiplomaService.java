package ma.yassir.diploma_backend.service;

import ma.yassir.diploma_backend.entity.Diploma;
import ma.yassir.diploma_backend.entity.Student;
import ma.yassir.diploma_backend.repository.DiplomaRepository;
import ma.yassir.diploma_backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class DiplomaService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private DiplomaRepository diplomaRepository;

    @Autowired
    private PdfService pdfService;

    @Autowired
    private SmartContractService smartContractService;

    /**
     * Processus complet d'émission d'un diplôme (Chapitre 5.1 du rapport)
     * 1. Vérifie l'étudiant
     * 2. Génère le PDF
     * 3. Calcule le Hash
     * 4. Envoie sur la Blockchain (Ancrage)
     * 5. Sauvegarde le tout en BDD
     */
    @Transactional
    public Diploma issueDiploma(String cne, String speciality, Integer graduationYear) throws Exception {

        // 1. Récupérer l'étudiant (Il doit exister en base pour avoir un diplôme)
        Student student = studentRepository.findByCne(cne)
                .orElseThrow(() -> new RuntimeException("Étudiant introuvable avec le CNE : " + cne));

        // 2. Créer l'objet Diplôme (statut "en cours")
        Diploma diploma = new Diploma();
        diploma.setStudent(student);
        diploma.setSpeciality(speciality);
        diploma.setGraduationYear(graduationYear);

        // Sauvegarde temporaire pour obtenir un ID (nécessaire pour nommer le PDF)
        diploma = diplomaRepository.save(diploma);

        // 3. Génération du PDF (Off-Chain)
        // Le PDF inclura un QR code pointant vers l'ID du diplôme
        String pdfPath = pdfService.generateDiplomaPdf(student, diploma);
        diploma.setIpfsCid(pdfPath); // Ici on stocke le chemin local pour l'instant (simulation IPFS)

        // 4. Calcul du Hash (Empreinte numérique)
        String pdfHash = pdfService.calculatePdfHash(pdfPath);
        diploma.setPdfHash(pdfHash);

        // 5. Ancrage sur la Blockchain (On-Chain)
        // On envoie l'ID de la BDD, le Hash du PDF, et le chemin du fichier
        String txHash = smartContractService.anchorDiploma(
                diploma.getId(),
                pdfHash,
                pdfPath // Dans une V2, ce serait le CID IPFS réel
        );

        diploma.setTransactionHash(txHash);

        // 6. Mise à jour finale en base de données
        return diplomaRepository.save(diploma);
    }

    // Méthode utilitaire pour vérifier un diplôme (Chapitre 3.3)
    public Diploma verifyDiploma(String pdfHash) {
        return diplomaRepository.findByPdfHash(pdfHash)
                .orElseThrow(() -> new RuntimeException("Aucun diplôme ne correspond à ce document."));
    }
    // Dans DiplomaService.java
// Ajoutez ceci juste avant la dernière accolade fermante }
    public java.util.Optional<Diploma> getDiplomaByHash(String hash) {
        return diplomaRepository.findByPdfHash(hash);
    }
    public Diploma getDiplomaById(Long id) {
        return diplomaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diplôme non trouvé"));
    }


}