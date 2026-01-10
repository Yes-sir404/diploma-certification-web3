package ma.yassir.diploma_backend.controller;

import ma.yassir.diploma_backend.dto.VerificationResponse;
import ma.yassir.diploma_backend.entity.Diploma;
import ma.yassir.diploma_backend.service.BlockchainService;
import ma.yassir.diploma_backend.service.DiplomaService;
import ma.yassir.diploma_backend.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/api/verification")
@CrossOrigin(origins = "*") // Important pour autoriser le Frontend et le Mobile
public class VerificationController {

    @Autowired
    private DiplomaService diplomaService;

    @Autowired
    private PdfService pdfService;

    @Autowired
    private BlockchainService blockchainService;

    // =========================================================
    // 1. VÉRIFICATION PAR UPLOAD DE FICHIER (Drag & Drop)
    // =========================================================
    @PostMapping("/verify")
    public ResponseEntity<VerificationResponse> verifyByFile(@RequestParam("file") MultipartFile file) {
        try {
            // 1. Calculer le Hash du fichier reçu
            String uploadHash = pdfService.calculateHashFromStream(file.getInputStream());

            // 2. Chercher ce Hash en Base de Données
            Optional<Diploma> diplomaOpt = diplomaService.getDiplomaByHash(uploadHash);

            if (diplomaOpt.isPresent()) {
                Diploma d = diplomaOpt.get();

                // 3. Vérifier sur la Blockchain
                boolean isValidOnChain = blockchainService.verifyDiplomaOnChain(
                        d.getStudent().getCne(),
                        uploadHash
                );

                // 4. Vérifier le statut local (Base de données)
                // Le diplôme est valide SEULEMENT SI : Blockchain OK ET BDD OK
                if (isValidOnChain && d.isValid()) {
                    return ResponseEntity.ok(mapToResponse(d, true));
                } else {
                    // Cas RÉVOQUÉ
                    return ResponseEntity.ok(VerificationResponse.builder()
                            .valid(false)
                            .message("⚠️ Le diplôme a été révoqué par l'université.") // <--- Message demandé
                            .studentName(d.getStudent().getFirstName() + " " + d.getStudent().getLastName())
                            .build());
                }

            } else {
                // Cas NON TROUVÉ
                return ResponseEntity.ok(VerificationResponse.builder()
                        .valid(false)
                        .message("❌ Document inconnu ou non certifié.")
                        .build());
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(VerificationResponse.builder()
                    .valid(false).message("Erreur technique : " + e.getMessage()).build());
        }
    }

    // =========================================================
    // 2. VÉRIFICATION PAR CNE (QR CODE)
    // =========================================================
    @GetMapping("/cne/{cne}")
    public ResponseEntity<VerificationResponse> verifyByCne(@PathVariable String cne) {
        try {
            // 1. Chercher le diplôme via le CNE de l'étudiant
            Optional<Diploma> diplomaOpt = diplomaService.getDiplomaByCne(cne);

            if (diplomaOpt.isPresent()) {
                Diploma d = diplomaOpt.get();

                // 2. Vérifier sur la Blockchain (en utilisant le hash stocké dans le diplôme)
                boolean isValidOnChain = blockchainService.verifyDiplomaOnChain(
                        d.getStudent().getCne(),
                        d.getPdfHash()
                );

                // 3. Vérifier le statut local
                boolean isLocalValid = d.isValid();

                // 4. Logique de validation combinée
                boolean finalStatus = isValidOnChain && isLocalValid;

                if (finalStatus) {
                    return ResponseEntity.ok(mapToResponse(d, true));
                } else {
                    // Cas RÉVOQUÉ (QR Code)
                    return ResponseEntity.ok(VerificationResponse.builder()
                            .valid(false)
                            .message("⚠️ Le diplôme a été révoqué par l'université.") // <--- Message demandé
                            .studentName(d.getStudent().getFirstName() + " " + d.getStudent().getLastName())
                            .build());
                }

            } else {
                return ResponseEntity.ok(VerificationResponse.builder()
                        .valid(false)
                        .message("❌ Aucun diplôme trouvé pour ce CNE.")
                        .build());
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(VerificationResponse.builder()
                    .valid(false).message("Erreur serveur : " + e.getMessage()).build());
        }
    }

    // =========================================================
    // HELPER : Construire la réponse JSON
    // =========================================================
    private VerificationResponse mapToResponse(Diploma d, boolean isValid) {
        return VerificationResponse.builder()
                .valid(isValid)
                .message("✅ Ce diplôme est AUTHENTIQUE et enregistré.")
                .studentName(d.getStudent() != null ? d.getStudent().getFirstName() + " " + d.getStudent().getLastName() : "Inconnu")
                .speciality(d.getSpeciality())
                .graduationYear(d.getGraduationYear())
                .transactionHash(d.getTransactionHash())
                .build();
    }
}