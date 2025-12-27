package ma.yassir.diploma_backend.repository;


import ma.yassir.diploma_backend.entity.Diploma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiplomaRepository extends JpaRepository<Diploma, Long> {

    // Récupère tous les diplômes d'un étudiant spécifique via son ID
    // (Utilisé pour le tableau de bord de l'étudiant)
    List<Diploma> findByStudentId(Long studentId);

    // Trouve un diplôme grâce au Hash du PDF
    // (Utilisé par le vérificateur public pour valider un document)
    Optional<Diploma> findByPdfHash(String pdfHash);

    // Trouve un diplôme grâce au Hash de la transaction Ethereum
    Optional<Diploma> findByTransactionHash(String transactionHash);
}