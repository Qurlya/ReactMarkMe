package archeage.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.Map;


@Data
public class DateIdDTO {
    @NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Map<String, LocalDate> dates;

    private long id;

}