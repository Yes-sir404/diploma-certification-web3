// Config Spring Security (Hashage mot de passe, CORS)
package ma.yassir.diploma_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Désactiver la protection CSRF (Inutile pour les API REST stateless)
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Configurer les règles d'accès
                .authorizeHttpRequests(auth -> auth
                        // Autoriser l'accès public à toutes les routes API pour le développement
                        .requestMatchers("/api/**").permitAll()
                        // Toute autre requête nécessitera une authentification
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    // Bean pour encoder les mots de passe (sera utile pour la création de compte Étudiant)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}