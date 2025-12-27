package ma.yassir.diploma_backend.repository;

import ma.yassir.diploma_backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // Permet de trouver un étudiant par son CNE (Utilisé pour le Login)
    Optional<Student> findByCne(String cne);

    // Vérifie si un CNE existe déjà (pour éviter les doublons lors de la création par l'Admin)
    boolean existsByCne(String cne);
}