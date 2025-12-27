// Endpoints pour générer et récupérer les diplômes
package ma.yassir.diploma_backend.controller;

import jakarta.validation.Valid;
import ma.yassir.diploma_backend.dto.DiplomaRequest;
import ma.yassir.diploma_backend.entity.Diploma;
import ma.yassir.diploma_backend.service.DiplomaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/diplomas")
@CrossOrigin(origins = "*") // Autorise les appels depuis n'importe quel frontend
public class DiplomaController {

    @Autowired
    private DiplomaService diplomaService;
    @Autowired
    private ma.yassir.diploma_backend.service.PdfService pdfService;

    // --- 1. ÉMISSION (Admin) ---
    // POST http://localhost:8080/api/diplomas/issue
    // Body (JSON): { "cne": "D1300000", "speciality": "Ingénierie Logicielle", "graduationYear": 2024 }
    @PostMapping("/issue")
    public ResponseEntity<?> issueDiploma(@Valid @RequestBody DiplomaRequest request) { // <--- On utilise l'objet ici
        try {
            // Plus besoin de "request.get("cne")", on utilise les getters directs !
            Diploma diploma = diplomaService.issueDiploma(
                    request.getCne(),
                    request.getSpeciality(),
                    request.getGraduationYear()
            );

            return ResponseEntity.ok(diploma);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    // --- 2. TÉLÉCHARGEMENT (Étudiant) ---
    // GET http://localhost:8080/api/diplomas/download/{id}
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadDiploma(@PathVariable Long id) {
        try {
            Diploma diploma = diplomaService.getDiplomaById(id);
            Path filePath = Paths.get(diploma.getIpfsCid());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}