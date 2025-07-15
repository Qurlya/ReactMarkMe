package archeage.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class RequestMarkDTO {
    @NotNull
    private LocalDate dateEvent;

    private String nameEvent;

    private Long id; // Может быть null
    private String user; // Может быть null
}