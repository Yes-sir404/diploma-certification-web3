package ma.yassir.diploma_backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DiplomaRequest {

    // @NotBlank : Vérifie que ce n'est pas null ET pas vide ("")
    @NotBlank(message = "Le CNE est obligatoire")
    private String cne;

    @NotBlank(message = "La spécialité est obligatoire")
    private String speciality;

    // @NotNull : Vérifie que ce n'est pas null
    // @Min : Vérifie que l'année est cohérente (pas l'an 0)
    @NotNull(message = "L'année d'obtention est requise")
    @Min(value = 2000, message = "L'année doit être supérieure à 2000")
    private Integer graduationYear;
}