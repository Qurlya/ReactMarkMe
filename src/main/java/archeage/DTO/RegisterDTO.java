package archeage.DTO;

import lombok.Data;

@Data
public class RegisterDTO {
    private String username; // Имя пользователя
    private String email;    // Электронная почта
    private String password; // Пароль (будет хешироваться)
}