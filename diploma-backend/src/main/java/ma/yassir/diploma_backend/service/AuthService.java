package ma.yassir.diploma_backend.service;

import ma.yassir.diploma_backend.dto.LoginRequest;
import ma.yassir.diploma_backend.entity.Student;
import ma.yassir.diploma_backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Celui configuré dans SecurityConfig

    public Student authenticateStudent(LoginRequest request) throws Exception {
        // 1. Chercher l'étudiant par son CNE
        Student student = studentRepository.findByCne(request.getCne())
                .orElseThrow(() -> new Exception("Utilisateur introuvable"));

        // 2. Vérifier le mot de passe (Raw vs Hash)
        // La méthode matches() compare "123456" avec "$2a$10$..."
        if (!passwordEncoder.matches(request.getPassword(), student.getPasswordHash())) {
            throw new Exception("Mot de passe incorrect");
        }

        // 3. Authentification réussie
        return student;
    }
}