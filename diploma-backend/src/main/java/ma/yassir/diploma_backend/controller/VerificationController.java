package ma.yassir.diploma_backend.controller;

import ma.yassir.diploma_backend.dto.VerificationResponse;
import ma.yassir.diploma_backend.entity.Diploma;
import ma.yassir.diploma_backend.service.DiplomaService;
import ma.yassir.diploma_backend.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/api/verification")
@CrossOrigin(origins = "*")
public class VerificationController {

    @Autowired
    private DiplomaService diplomaService;

    @Autowired
    private PdfService pdfService;

    // --- MÉTHODE 1 : VÉRIFICATION PAR UPLOAD (Niveau de preuve : ABSOLU) ---
    // POST http://localhost:8080/api/verification/verify
    @PostMapping("/verify")
    public ResponseEntity<VerificationResponse> verifyByFile(@RequestParam("file") MultipartFile file) {
        try {
            String uploadHash = pdfService.calculateHashFromStream(file.getInputStream());
            System.out.println("🔍 Hash calculé : " + uploadHash);

            Optional<Diploma> diplomaOpt = diplomaService.getDiplomaByHash(uploadHash);

            if (diplomaOpt.isPresent()) {
                return ResponseEntity.ok(mapToResponse(diplomaOpt.get(), true));
            } else {
                return ResponseEntity.ok(VerificationResponse.builder()
                        .valid(false)
                        .message("❌ Ce document n'est pas reconnu (Hash introuvable).")
                        .build());
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(VerificationResponse.builder()
                    .valid(false).message("Erreur : " + e.getMessage()).build());
        }
    }

    // --- MÉTHODE 2 : VÉRIFICATION PAR ID (Pour le QR Code) ---
    // GET http://localhost:8080/api/verification/{id}
    @GetMapping("/{id}")
    public ResponseEntity<VerificationResponse> verifyById(@PathVariable Long id) {
        try {
            // On utilise la méthode existante du service
            Diploma d = diplomaService.getDiplomaById(id);

            // Si on arrive ici, c'est que l'ID existe (sinon le service lance une exception)
            return ResponseEntity.ok(mapToResponse(d, true));

        } catch (Exception e) {
            // Si l'ID n'existe pas
            return ResponseEntity.ok(VerificationResponse.builder()
                    .valid(false)
                    .message("❌ Aucun diplôme trouvé avec cet identifiant.")
                    .build());
        }
    }

    // --- Petite méthode utilitaire pour éviter de répéter le code de mapping ---
    private VerificationResponse mapToResponse(Diploma d, boolean isValid) {
        return VerificationResponse.builder()
                .valid(isValid)
                .message("✅ Ce diplôme est enregistré dans le système.")
                .studentName(d.getStudent().getFirstName() + " " + d.getStudent().getLastName())
                .speciality(d.getSpeciality())
                .graduationYear(d.getGraduationYear())
                .transactionHash(d.getTransactionHash())
                .build();
    }
}