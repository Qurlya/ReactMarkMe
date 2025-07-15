package archeage.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class DeleteBossDTO {
    private String nameBoss;
    private LocalDate dateBoss;
}
