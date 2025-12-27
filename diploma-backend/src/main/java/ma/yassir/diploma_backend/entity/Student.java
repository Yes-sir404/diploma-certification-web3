package ma.yassir.diploma_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "students") // Correspond à la table page 7 [cite: 68]
@Data // Lombok génère Getters/Setters/ToString
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // [cite: 70]

    @Column(nullable = false, unique = true, length = 20)
    private String cne; // Login (Code National Étudiant) [cite: 72]

    @Column(nullable = false, length = 20)
    private String cni; // Partie du mot de passe initial [cite: 75]

    @Column(nullable = false)
    private String firstName; // [cite: 81]

    @Column(nullable = false)
    private String lastName; // [cite: 82]

    @Column(nullable = false)
    private LocalDate birthDate; // [cite: 80]

    @Column(nullable = false)
    private String passwordHash; // Stocké chiffré (BCrypt) [cite: 81]

    @Column(length = 100)
    private String email; // [cite: 85]

    // Relation: Un étudiant peut avoir plusieurs diplômes (ex: Licence, Master)
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Diploma> diplomas;
}