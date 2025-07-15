package archeage.controllers;

import archeage.services.AuthService;
import archeage.DTO.LoginDTO;
import archeage.DTO.RegisterDTO;
import archeage.models.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") // Базовый путь для всех эндпоинтов
@CrossOrigin(origins = "http://localhost:3000") // Разрешить запросы с фронта
public class AuthController {
    private final AuthService authService;

    // Внедрение сервиса через конструктор
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterDTO registerDTO) {
        User user = authService.register(registerDTO);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginDTO loginDTO) {
        User user = authService.login(loginDTO);
        return ResponseEntity.ok(user);
    }
}