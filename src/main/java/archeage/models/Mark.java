package archeage.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "Marks")
@NoArgsConstructor
public class Mark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long idEvent;

    @Column(nullable = false)
    private String nameMember;

    @Column(nullable = false)
    private LocalDate dateEvent;

    @Column(nullable = false)
    private String nameEvent;

    @Column(nullable = false)
    private Long idMember;

    @Column(nullable = true)
    private Long idInspector = null;

    @Column(nullable = false)
    private String status;


}
