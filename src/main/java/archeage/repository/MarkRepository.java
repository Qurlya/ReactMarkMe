package archeage.repository;

import archeage.models.Mark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface MarkRepository extends JpaRepository<Mark, Long> {
    Optional<Mark> findByIdMemberAndIdEvent(Long idMember, Long idEvent);
    List<Mark> findByIdMemberAndStatusInAndDateEventIn(Long idMember, Collection<String> statuses, Collection<LocalDate> dateEvents);
    Optional<Mark> findByIdEventAndStatus(Long idEvent, String status);

}
