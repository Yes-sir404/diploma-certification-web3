package ma.yassir.diploma_backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DiplomaRequest {

    @NotBlank(message = "Le CNE est obligatoire")
    private String cne;

    @NotBlank(message = "Le CNI est obligatoire")
    private String cni;

    @NotBlank(message = "Le prénom est obligatoire")
    private String firstName;

    @NotBlank(message = "Le nom est obligatoire")
    private String lastName;

    @NotBlank(message = "L'email est obligatoire")
    private String email;

    // J'ai renommé 'speciality' en 'major' pour correspondre à ton DiplomaService
    // Si tu préfères garder 'speciality', il faudra changer 'request.major' en 'request.speciality' dans le Service
    @NotBlank(message = "La spécialité (Major) est obligatoire")
    private String major;

    @NotBlank(message = "La date de naissance est obligatoire")
    private String birthDate; // Format attendu: "YYYY-MM-DD"

    @NotNull(message = "L'année d'obtention est requise")
    @Min(value = 2000, message = "L'année doit être supérieure à 2000")
    private int graduationYear; // int primitif est plus simple à gérer que Integer ici
}