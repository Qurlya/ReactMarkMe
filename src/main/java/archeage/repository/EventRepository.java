package archeage.repository;

import archeage.models.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findByDateBossAndNameBoss(LocalDate dateBoss, String name);
    List<Event> findByDateBossInAndCreated(Collection<LocalDate> dateBoss, boolean created);
    Optional<Event> findById(Long id);
    List<Event> findAllByNeedCheck(boolean needCheck);
}
