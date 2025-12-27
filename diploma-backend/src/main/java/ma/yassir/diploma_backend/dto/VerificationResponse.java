package ma.yassir.diploma_backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder // Permet une construction facile de l'objet
public class VerificationResponse {
    private boolean valid;
    private String message;
    private String studentName;
    private String speciality;
    private Integer graduationYear;
    private String transactionHash; // Preuve Blockchain
}