package ma.yassir.diploma_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Le CNE est requis")
    private String cne;

    @NotBlank(message = "Le mot de passe est requis")
    private String password;
}