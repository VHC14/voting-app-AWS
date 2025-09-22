package com.votingapp.controller;

import com.votingapp.model.User;
import com.votingapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        try {
            if(userRepository.findByUsername(user.getUsername()).isPresent()) {
                return "Username already exists!";
            }
            user.setRole("USER");
            userRepository.save(user);
            return "User registered successfully!";
        } catch (Exception e) {
            System.err.println("Error during registration: " + e.getMessage());
            return "Registration failed: " + e.getMessage();
        }
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        try {
            Optional<User> u = userRepository.findByUsername(user.getUsername());
            if(u.isPresent() && u.get().getPassword().equals(user.getPassword())) {
                return u.get().getRole(); // returns ADMIN or USER
            }
            return "Invalid credentials";
        } catch (Exception e) {
            System.err.println("Error during login: " + e.getMessage());
            return "Login failed: " + e.getMessage();
        }
    }
}
