package ma.yassir.diploma_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "diplomas") // Correspond à la table page 7 [cite: 90]
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Diploma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Cet ID sera envoyé au Smart Contract [cite: 92]

    @Column(length = 100)
    private String speciality; // Ex: Ingénierie Logicielle [cite: 97]

    @Column(name = "graduation_year")
    private Integer graduationYear; // [cite: 100]

    @Column(name = "ipfs_cid")
    private String ipfsCid; // Lien vers le document (ou chemin local) [cite: 102]

    @Column(name = "pdf_hash", length = 66)
    private String pdfHash; // Hash SHA-256 du PDF pour vérification [cite: 104]

    @Column(name = "transaction_hash", length = 66)
    private String transactionHash; // Preuve de la transaction Ethereum [cite: 107]

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // [cite: 112]

    // Clé étrangère vers Student
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false) // [cite: 95]
    private Student student;
}