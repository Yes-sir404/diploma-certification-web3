package ma.yassir.diploma_backend.dto;

import lombok.Data;
import ma.yassir.diploma_backend.entity.Student;

@Data
public class StudentDto {
    private Long id;
    private String cne;
    private String firstName;
    private String lastName;
    private String email;

    // Méthode utilitaire pour convertir facilement une Entité en DTO
    public static StudentDto fromEntity(Student student) {
        StudentDto dto = new StudentDto();
        dto.setId(student.getId());
        dto.setCne(student.getCne());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setEmail(student.getEmail());
        return dto;
    }
}