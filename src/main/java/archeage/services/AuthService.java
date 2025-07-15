package archeage.services;


import archeage.DTO.LoginDTO;
import archeage.DTO.RegisterDTO;
import archeage.models.User;
import archeage.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Внедрение зависимостей через конструктор
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User register(RegisterDTO registerDTO) {
        // Проверка уникальности имени пользователя
        if (userRepository.existsByUsername(registerDTO.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        // Проверка уникальности email
        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        // Создание нового пользователя с хешированным паролем
        User user = new User(
                registerDTO.getUsername(),
                passwordEncoder.encode(registerDTO.getPassword()),
                registerDTO.getEmail()
        );

        // Сохранение в базу данных
        return userRepository.save(user);
    }

    public User login(LoginDTO loginDTO) {
        // Поиск пользователя по имени
        User user = userRepository.findByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // Проверка пароля
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }

        return user;
    }
}