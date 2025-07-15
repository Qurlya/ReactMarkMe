package archeage.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BossDTO {
    private String urlBoss;
    private String noteBoss;
    private String timeBoss;
    private boolean pvpBoss;
    private String masterBoss;
    private String nameBoss;
    private LocalDate dateBoss;


}
