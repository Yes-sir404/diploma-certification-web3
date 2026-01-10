package ma.yassir.diploma_backend.controller;

import ma.yassir.diploma_backend.entity.Diploma;
import ma.yassir.diploma_backend.entity.Student;
import ma.yassir.diploma_backend.repository.DiplomaRepository;
import ma.yassir.diploma_backend.repository.StudentRepository;
import ma.yassir.diploma_backend.service.BlockchainService;
import ma.yassir.diploma_backend.service.DiplomaService;
import ma.yassir.diploma_backend.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;       // <--- IMPORT MANQUANT
import org.springframework.core.io.UrlResource;    // <--- IMPORT MANQUANT
import org.springframework.http.HttpHeaders;       // <--- IMPORT MANQUANT
import org.springframework.http.MediaType;         // <--- IMPORT MANQUANT
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.web3j.utils.Numeric;

import java.nio.file.Path;                         // <--- IMPORT MANQUANT
import java.nio.file.Paths;                        // <--- IMPORT MANQUANT
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/diplomas")
@CrossOrigin(origins = "*")
public class DiplomaController {

    @Autowired private BlockchainService blockchainService;
    @Autowired private PdfService pdfService;
    @Autowired private DiplomaRepository diplomaRepository;
    @Autowired private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // <--- Nécessaire car passwordHash est 'nullable = false'

    @Autowired
    private DiplomaService diplomaService;

    // 1. DTO MÉTÉ À JOUR (Correspond à votre formulaire React)
    public static class DiplomaRequestDTO {
        public String firstName;
        public String lastName;
        public String cne;
        public String cni;        // <--- Obligatoire pour Student
        public String email;      // <--- Nouveau
        public String birthDate;  // <--- Nouveau (Format "YYYY-MM-DD")
        public String major;
        public int graduationYear;
    }

    @PostMapping
    public ResponseEntity<?> createDiploma(@RequestBody DiplomaRequestDTO request) {
        try {
            String fullName = request.firstName + " " + request.lastName;

            // --- A. GÉNÉRATION PDF & HASH (Off-Chain) ---
            String filePath = pdfService.generateDiplomaPdf(request);
            byte[] pdfHashBytes = pdfService.calculatePdfHashBytes(filePath);

            // --- CORRECTION : Utilisation de Web3j ---
            String pdfHashString = Numeric.toHexString(pdfHashBytes);;

            // --- B. BLOCKCHAIN (Infos Publiques UNIQUEMENT) ---
            // On n'envoie PAS la CNI, ni l'Email, ni la Date de naissance ici !
            String txHash = blockchainService.createDiploma(
                    request.cne,
                    fullName, // attention à bien définir fullName
                    request.major,
                    request.graduationYear,
                    pdfHashBytes
            );

            // --- C. BASE DE DONNÉES (Infos Complètes & Privées) ---

            // Gestion de l'étudiant
            Student student = studentRepository.findByCne(request.cne)
                    .orElse(new Student());

            // Remplissage des données de l'entité Student
            student.setCne(request.cne);
            student.setCni(request.cni);
            student.setFirstName(request.firstName);
            student.setLastName(request.lastName);
            student.setEmail(request.email);

            // Conversion String -> LocalDate
            if (request.birthDate != null && !request.birthDate.isEmpty()) {
                student.setBirthDate(LocalDate.parse(request.birthDate));
            }

            // GESTION DU MOT DE PASSE (Car nullable = false)
            // Si l'étudiant est nouveau, on génère un mot de passe par défaut (ex: sa CNI)
            if (student.getId() == null) {
                // On crypte la CNI comme mot de passe initial
                student.setPasswordHash(passwordEncoder.encode(request.cni));
            }

            student = studentRepository.save(student);

            // Sauvegarde du diplôme
            Diploma diploma = new Diploma();
            diploma.setStudent(student);
            diploma.setSpeciality(request.major);
            diploma.setGraduationYear(request.graduationYear);
            diploma.setPdfHash(pdfHashString);
            diploma.setTransactionHash(txHash);
            diploma.setIpfsCid(filePath);

            diplomaRepository.save(diploma);

            return ResponseEntity.ok(Map.of(
                    "message", "Succès ! Données complètes en BDD, Preuve sur Blockchain.",
                    "transactionHash", txHash,
                    "student", fullName
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    // --- 2. LISTER TOUS LES DIPLÔMES (GET) ---
    @GetMapping
    public ResponseEntity<List<Diploma>> getAllDiplomas() {
        return ResponseEntity.ok(diplomaRepository.findAll());
    }

    // --- 3. TÉLÉCHARGER LE PDF (GET) ---
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadPdf(@PathVariable Long id) {
        try {
            Diploma diploma = diplomaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Diplôme introuvable"));

            // Récupère le chemin du fichier
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
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // --- AJOUT : Endpoint RÉVOQUER ---
    @PostMapping("/revoke/{cne}")
    public ResponseEntity<?> revokeDiploma(@PathVariable String cne) {
        try {
            String txHash = diplomaService.revokeDiploma(cne);
            return ResponseEntity.ok(Map.of("message", "Diplôme révoqué", "txHash", txHash));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- AJOUT : Endpoint RÉACTIVER ---
    @PostMapping("/reactivate/{cne}")
    public ResponseEntity<?> reactivateDiploma(@PathVariable String cne) {
        try {
            String txHash = diplomaService.reactivateDiploma(cne);
            return ResponseEntity.ok(Map.of("message", "Diplôme réactivé", "txHash", txHash));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    // 4. RÉCUPÉRER LES DIPLÔMES D'UN ÉTUDIANT (Pour son Dashboard)
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Diploma>> getStudentDiplomas(@PathVariable Long studentId) {
        try {
            List<Diploma> list = diplomaService.getDiplomasByStudentId(studentId);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}