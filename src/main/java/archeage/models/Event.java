package archeage.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate dateBoss;

    @Column(nullable = false)
    private String nameBoss;

    @Column(nullable = true)
    private String timeBoss;

    @Column(nullable = true)
    private boolean pvpBoss;

    @Column(nullable = true)
    private String noteBoss;

    @Column(nullable = true)
    private String urlBoss;

    @Column(nullable = true)
    private String masterBoss;

    @Column(nullable = true)
    private boolean created;

    @Column(nullable = true)
    private boolean needCheck;


}