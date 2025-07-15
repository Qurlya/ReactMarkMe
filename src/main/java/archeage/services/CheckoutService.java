package archeage.services;

import archeage.DTO.DateDTO;
import archeage.models.Event;
import archeage.repository.EventRepository;
import archeage.repository.MarkRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CheckoutService {
    private final MarkRepository markRepository;
    private final EventRepository eventRepository;
    public CheckoutService(MarkRepository markRepository, EventRepository eventRepository) {
        this.markRepository = markRepository;
        this.eventRepository = eventRepository;
    }
    @Transactional
    public List<Event> getAllDate() {
        List<Event> optEvent = eventRepository.findAllByNeedCheck(true);
        return optEvent;
    }

}
