// Login Admin (Wallet) et Login Étudiant (CNE)
package ma.yassir.diploma_backend.controller;

import jakarta.validation.Valid;
import ma.yassir.diploma_backend.dto.LoginRequest;
import ma.yassir.diploma_backend.entity.Student;
import ma.yassir.diploma_backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Important pour React
public class AuthController {

    @Autowired
    private AuthService authService;

    // POST http://localhost:8080/api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> loginStudent(@Valid @RequestBody LoginRequest request) {
        try {
            Student student = authService.authenticateStudent(request);

            // On renvoie l'étudiant connecté (sans le mot de passe évidemment,
            // Spring ignore passwordHash par défaut ou on peut le mettre à null manuellement ici pour être sûr)

            // Astuce Pro: Ne jamais renvoyer le hash au front
            student.setPasswordHash(null);

            return ResponseEntity.ok(Map.of(
                    "message", "Connexion réussie",
                    "user", student
            ));

        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }
}