package ma.yassir.diploma_backend.config;

import ma.yassir.diploma_backend.entity.Student;
import ma.yassir.diploma_backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            String cneHajar = "D130333444";
            String rawPassword = "123456";

            // Vérifie si Hajar existe, sinon on la crée, sinon on la met à jour
            Student student = studentRepository.findByCne(cneHajar).orElse(new Student());

            student.setCne(cneHajar);
            student.setFirstName("Hajar");
            student.setLastName("Bennani");
            student.setCni("JA98765");
            student.setEmail("hajar.bennani@ensias.ma");
            student.setBirthDate(LocalDate.of(2002, 3, 22));

            // C'EST ICI QUE LA MAGIE OPÈRE : On génère le VRAI hash valide
            student.setPasswordHash(passwordEncoder.encode(rawPassword));

            studentRepository.save(student);

            System.out.println("----------------------------------------------------------");
            System.out.println("✅ COMPTE TEST MIS À JOUR AVEC SUCCÈS !");
            System.out.println("👤 Utilisateur : Hajar Bennani");
            System.out.println("🔑 CNE (Login) : " + cneHajar);
            System.out.println("🔒 Password    : " + rawPassword);
            System.out.println("----------------------------------------------------------");
        };
    }
}