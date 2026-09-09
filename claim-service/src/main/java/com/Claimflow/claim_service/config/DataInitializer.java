package com.Claimflow.claim_service.config;

import com.Claimflow.claim_service.model.Role;
import com.Claimflow.claim_service.model.User;
import com.Claimflow.claim_service.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) 
    {
        return args -> {
        User existingManager = userRepository.findByUsername("manager1")
                .orElse(null);

        if (existingManager == null) {
            User manager = new User();
            manager.setUsername("manager1");
            manager.setPassword(passwordEncoder.encode("manager123"));
            manager.setRole(Role.MANAGER);

            userRepository.save(manager);
        } else if (existingManager.getRole() != Role.MANAGER) {
            existingManager.setRole(Role.MANAGER);
            userRepository.save(existingManager);
        }
        };
    }
}