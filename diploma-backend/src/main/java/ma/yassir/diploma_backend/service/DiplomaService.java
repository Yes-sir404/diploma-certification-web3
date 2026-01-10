package ma.yassir.diploma_backend.service;

import ma.yassir.diploma_backend.entity.Diploma;
import ma.yassir.diploma_backend.repository.DiplomaRepository;
import ma.yassir.diploma_backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DiplomaService {

    @Autowired
    private DiplomaRepository diplomaRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private BlockchainService blockchainService; // Injection manquante dans ton code précédent

    // --- Méthodes de lecture pour la Vérification ---

    public Optional<Diploma> getDiplomaByHash(String hash) {
        return diplomaRepository.findByPdfHash(hash);
    }

    public Diploma getDiplomaById(Long id) {
        return diplomaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diplôme non trouvé avec l'ID : " + id));
    }

    // (Optionnel) Si vous avez besoin de récupérer par CNE
    public Optional<Diploma> getDiplomaByCne(String cne) {
        // Attention au nom exact de la méthode ici
        return diplomaRepository.findByStudent_Cne(cne);
    }

    // --- AJOUT : Logique de Révocation ---
    public String revokeDiploma(String cne) throws Exception {
        // 1. Action Blockchain
        String txHash = blockchainService.revokeDiploma(cne);

        // 2. Action Base de Données
        Diploma diploma = diplomaRepository.findByStudent_Cne(cne)
                .orElseThrow(() -> new RuntimeException("Diplôme introuvable pour le CNE : " + cne));

        diploma.setValid(false); // On marque comme invalide
        diplomaRepository.save(diploma);

        return txHash;
    }

    // --- AJOUT : Logique de Réactivation ---
    public String reactivateDiploma(String cne) throws Exception {
        // 1. Action Blockchain
        String txHash = blockchainService.reactivateDiploma(cne);

        // 2. Action Base de Données
        Diploma diploma = diplomaRepository.findByStudent_Cne(cne)
                .orElseThrow(() -> new RuntimeException("Diplôme introuvable"));

        diploma.setValid(true); // On remarque comme valide
        diplomaRepository.save(diploma);

        return txHash;
    }

    public List<Diploma> getDiplomasByStudentId(Long studentId) {
        return diplomaRepository.findByStudentId(studentId);
    }

}