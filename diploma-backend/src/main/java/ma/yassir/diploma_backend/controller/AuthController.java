package ma.yassir.diploma_backend.controller;

import jakarta.validation.Valid;
import ma.yassir.diploma_backend.dto.LoginRequest;
import ma.yassir.diploma_backend.entity.Student;
import ma.yassir.diploma_backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value; // <--- Import Important
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    // 1. On injecte l'adresse publique depuis application.properties
    @Value("${admin.wallet.address}")
    private String adminAddress;

    // --- LOGIN ÉTUDIANT (Existant) ---
    @PostMapping("/login")
    public ResponseEntity<?> loginStudent(@Valid @RequestBody LoginRequest request) {
        try {
            Student student = authService.authenticateStudent(request);
            student.setPasswordHash(null); // Sécurité

            return ResponseEntity.ok(Map.of(
                    "message", "Connexion réussie",
                    "user", student
            ));

        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    // --- LOGIN ADMIN (À AJOUTER) ---
    @PostMapping("/admin-login")
    public ResponseEntity<?> loginAdmin(@RequestBody Map<String, String> request) {
        // On récupère l'adresse envoyée par le Frontend (MetaMask)
        String incomingAddress = request.get("walletAddress");

        // Vérification 1 : Est-ce qu'on a bien reçu une adresse ?
        if (incomingAddress == null || incomingAddress.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Adresse Wallet manquante"));
        }

        // Vérification 2 : Est-ce que c'est la bonne adresse ? (Insensible à la casse)
        // adminAddress vient de application.properties
        if (adminAddress.equalsIgnoreCase(incomingAddress)) {
            // SUCCÈS : On renvoie un token (simulé pour le PFA)
            return ResponseEntity.ok(Map.of(
                    "message", "Authentification Admin réussie",
                    "role", "ADMIN",
                    "token", "admin-token-super-secret-pfa-2025"
            ));
        } else {
            // ÉCHEC
            return ResponseEntity.status(403).body(Map.of(
                    "error", "Accès refusé. Cette adresse n'est pas administrateur."
            ));
        }
    }
}