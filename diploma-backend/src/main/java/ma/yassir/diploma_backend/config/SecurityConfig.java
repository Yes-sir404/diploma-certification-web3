package ma.yassir.diploma_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. ACTIVER CORS (C'est la ligne qui manquait !)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. Désactiver CSRF (Inutile pour les API REST stateless)
                .csrf(AbstractHttpConfigurer::disable)

                // 3. Configurer les règles d'accès
                .authorizeHttpRequests(auth -> auth
                        // Autoriser l'accès public à toutes les routes API pour le développement
                        .requestMatchers("/api/**").permitAll()
                        // Toute autre requête nécessitera une authentification
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    // --- AJOUT : Configuration CORS Globale ---
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Autoriser TOUTES les origines (Localhost, IP Mobile, etc.)
        configuration.setAllowedOrigins(List.of("*"));

        // Autoriser TOUTES les méthodes (GET, POST, PUT, DELETE, OPTIONS)
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Autoriser TOUS les headers (Authorization, Content-Type, etc.)
        configuration.setAllowedHeaders(List.of("*"));

        // Exposer les headers si besoin
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}